const _ = require('lodash')
const Cookies = require('cookies')
const fs = require('fs')
const path = require('path')
const LRU = require('lru-cache')
const express = require('express')
const favicon = require('serve-favicon')
const compression = require('compression')
const maxMemUsageLimit = 1000 * 1024 * 1024
const memwatch = require('memwatch-next')
const microcache = require('route-cache')
const requestIp = require('request-ip')
const resolve = file => path.resolve(__dirname, file)
const useragent = require('express-useragent')
const uuidv4 = require('uuid/v4')
const { PAGE_CACHE_EXCLUDING } = require('./api/config')
const { SERVER_PROTOCOL, SERVER_HOST, SERVER_PORT } = require('./api/config')
const { SERVER_PROTOCOL_MOBILE, SERVER_HOST_MOBILE, SERVER_PORT_MOBILE } = require('./api/config')
const config = require('./api/config')
const { createBundleRenderer } = require('vue-server-renderer')

const debug = require('debug')('READR:server')
const isProd = process.env.NODE_ENV === 'production'
const useMicroCache = process.env.MICRO_CACHE !== 'false'
const serverInfo =
  `express/${require('express/package.json').version} ` +
  `vue-server-renderer/${require('vue-server-renderer/package.json').version}`

const app = express()

const formatMem = (bytes) => {
  return (bytes / 1024 / 1024).toFixed(2) + ' Mb'
}

function createRenderer (bundle, options) {
  // https://github.com/vuejs/vue/blob/dev/packages/vue-server-renderer/README.md#why-use-bundlerenderer
  return createBundleRenderer(bundle, Object.assign(options, {
    // for component caching
    cache: LRU({
      max: 1000,
      maxAge: 1000 * 60 * 15
    }),
    // this is only needed when vue-server-renderer is npm-linked
    basedir: resolve('./distribution'),
    // recommended for performance
    runInNewContext: false
  }))
}

app.use(useragent.express())
app.use(requestIp.mw())
app.set('views', path.join(__dirname, 'src/views'))
app.set('view engine', 'ejs')

let renderer
let readyPromise
const templatePath = resolve('./src/index.template.html')
if (isProd) {
  // In production: create server renderer using template and built server bundle.
  // The server bundle is generated by vue-ssr-webpack-plugin.
  const template = fs.readFileSync(templatePath, 'utf-8')
  const bundle = require('./distribution/vue-ssr-server-bundle.json')
  // The client manifests are optional, but it allows the renderer
  // to automatically infer preload/prefetch links and directly add <script>
  // tags for any async chunks used during render, avoiding waterfall requests.
  const clientManifest = require('./distribution/vue-ssr-client-manifest.json')
  renderer = createRenderer(bundle, {
    template,
    clientManifest
  })
} else {
  // In development: setup the dev server with watch and hot-reload,
  // and create a new renderer on bundle / index template update.
  readyPromise = require('./build/setup-dev-server')(
    app,
    templatePath,
    (bundle, options) => {
      renderer = createRenderer(bundle, options)
    }
  )
}

const serve = (path, cache) => express.static(resolve(path), {
  maxAge: cache && isProd ? 1000 * 60 * 60 : 0
})

const staticNotFound = (req, res) => res.status(404).send('Not Found')
app.use(compression({ threshold: 0 }))
app.use(favicon('./public/favicon.png'))
app.use('/distribution', serve('./distribution', true), staticNotFound)
app.use('/public', serve('./public', true), staticNotFound)
app.use('/manifest.json', serve('./manifest.json', true), staticNotFound)
app.use('/service-worker.js', serve('./distribution/service-worker.js'), staticNotFound)
app.use('/assets', staticNotFound)

// since this app has no user-specific content, every page is micro-cacheable.
// if your app involves user-specific content, you need to implement custom
// logic to determine whether a request is cacheable based on its url and
// headers.
// 1-second microcache.
// https://www.nginx.com/blog/benefits-of-microcaching-nginx/
// app.use(microcache.cacheSeconds(1, req => useMicroCache && req.originalUrl))

function render (req, res, next) {
  if (req.url.indexOf('/api/') === 0) {
    next()
    return
  }

  const s = Date.now()
  let isUnauthorized = false
  let isPageNotFound = false
  let isErrorOccurred = false  

  const curr_host = _.get(req, 'headers.host') || ''
  const targ_exp = /(dev)|(localhost)/
  const targ_localhost_exp = /(localhost)/
  const targ_exp_login = /(\/login)/
  debug('Current client host:', curr_host, !curr_host.match(targ_exp))
  debug('Requested page:', req.url, req.url.match(targ_exp_login))
  debug('isDesktop', req.useragent.isDesktop)

  if (req.useragent.isDesktop && !curr_host.match(targ_localhost_exp)) {
      if (SERVER_PROTOCOL && SERVER_HOST) {
      res.redirect(302, `${SERVER_PROTOCOL}://${SERVER_HOST}${SERVER_PORT ? ':' + SERVER_PORT : ''}${req.url}`)
      return
    }
  }

  const isPreview = req.url.indexOf('preview=true') > -1
  const is404 = req.url.indexOf('/404') === 0
  if (_.filter(PAGE_CACHE_EXCLUDING, (p) => (req.url.indexOf(p) > -1)).length === 0 && !isPreview && !is404) {
    if (!curr_host.match(targ_exp)) {
      if (req.url.length !== 1) {
        res.setHeader('Cache-Control', 'public, max-age=3600')  
      } else {
        res.setHeader('Cache-Control', 'public, max-age=300')  
      }
    }
  }
  res.setHeader("Content-Type", "text/html")
  res.setHeader("Server", serverInfo)

  const cookies = new Cookies( req, res, {} )
  const readrid = cookies.get('readrid')
  if (!readrid) {
    cookies.set('readrid', uuidv4(), {
      httpOnly: false,
      domain: config.DOMAIN,
      expires: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000)
    })
  }

  const context = {
    title: 'Readr',
    description: 'Readr',
    metaUrl: 'dev.readr.tw',
    metaImage: '/public/og-image.jpg',
    url: req.url,
    cookie: cookies.get('csrf'),
    initmember: cookies.get('initmember'),
    setting: {
      POST_TYPE: config.POST_TYPE,
      PROJECT_STATUS: config.PROJECT_STATUS,
      TAG_ACTIVE: config.TAG_ACTIVE,
      FB_CLIENT_ID: config.FB_CLIENT_ID,
      GOOGLE_CLIENT_ID: config.GOOGLE_CLIENT_ID,      
      GOOGLE_RECAPTCHA_SITE_KEY: config.GOOGLE_RECAPTCHA_SITE_KEY,
      DOMAIN: config.DOMAIN,
      DONATION_IS_DEPOSIT_ACTIVE: config.DONATION_IS_DEPOSIT_ACTIVE, 
      DONATION_DEPOSIT_AMOUNT_ONCE: config.DONATION_DEPOSIT_AMOUNT_ONCE,      
      HOST: `${config.SERVER_PROTOCOL}://${config.SERVER_HOST}${config.SERVER_PORT ? ':' + config.SERVER_PORT : ''}`,
      HOST_MOBILE: `${config.SERVER_PROTOCOL_MOBILE}://${config.SERVER_HOST_MOBILE}${SERVER_PORT_MOBILE ? ':' + config.SERVER_PORT_MOBILE : ''}`,
      REGISTRATION_ACTIVE: config.REGISTRATION_ACTIVE,
      STRIPE_KEY: config.STRIPE_KEY,
      TAPPAY: config.TAPPAY, 
    },
    is404,
  }
  const handleError = err => {
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate')  
    if (err.url) {
      console.error('Error occuerred. Redirect to', err.url)
      res.redirect(err.url)
      return
    }

    let status = err.code || 500
    debug('status', status)

    if (status === 404) {
      isPageNotFound = true
      console.error(`##########REQUEST URL(404)############\n`,
      `ERROR OCCURRED WHEN RUNNING renderToString()\n`,
      `REQUEST URL: ${req.url}\n`,
      `REQUEST IP: ${req.clientIp}\n`,
      `REFERER: ${req.headers.referer}\n`,
      `${err}\n`, '######################')
      req.url = '/404'
      render(req, res, next)      
    } else if (status === 403) {
      isUnauthorized = true
      return res.status(status).send(`<script>location.replace('/login')</script>`)
    } else {
      isErrorOccurred = true
      console.error(`ERROR OCCURRED WHEN RUNNING renderToString()\n`,
      `REQUEST URL: ${req.url}\n`,
      `REQUEST IP: ${req.clientIp}\n`,
      `REFERER: ${req.headers.referer}\n`,
      `${err}`)
      return res.status(500).send('500 | Internal Server Error')
    }
  }

  res.on('finish', function () {
    const mem = process.memoryUsage()
    console.log('MEMORY STAT(heapUsed):', formatMem(mem.heapUsed))
    if (mem.heapUsed > maxMemUsageLimit) {
      for (let i = 0; i < 10; i += 1) {
        console.error('MEMORY WAS RUNNING OUT')
      } 
      console.error(`KILLING PROCESS IN 1 SECOND(At ${(new Date).toString()})`)
      process.exit(1)
    }
    if (isPageNotFound || isErrorOccurred || isUnauthorized) {
      try {
        global.gc()
      } catch (e) {
        // process.exit(1)
      }
    }
  })

  renderer.renderToString(context, (err, html) => {
    if (err) {
      return handleError(err)
    }
    res.status(context.is404 ? 404 : 200).send(html)
    if (!isProd) {
      console.log(`whole request: ${Date.now() - s}ms`)
    }
  })
}

app.get('*', isProd ? render : (req, res, next) => {
  readyPromise.then(() => render(req, res, next))
})

app.use('/api', require('readr-web-api'))

const port = process.env.PORT || 8080
const server = app.listen(port, () => {
  console.log(`server started at localhost:${port}`)
})
module.exports = {
  close: () => {
    server.close()
  },
  ready: readyPromise,
  app: server
}

memwatch.on('leak', function(info) {
  const growth = formatMem(info.growth)
  const mem = process.memoryUsage()
  console.log('GETING MEMORY LEAK:', [ 'growth ' + growth, 'reason ' + info.reason ].join(', '))
  console.log('MEMORY STAT(heapUsed):', formatMem(mem.heapUsed))
})
memwatch.on('stats', function(stats) {
  const estBase = formatMem(stats.estimated_base)
  const currBase = formatMem(stats.current_base)
  const min = formatMem(stats.min)
  const max = formatMem(stats.max)
  console.log('GC STATs:', [
    'num_full_gc ' + stats.num_full_gc,
    'num_inc_gc ' + stats.num_inc_gc,
    'heap_compactions ' + stats.heap_compactions,
    'usage_trend ' + stats.usage_trend,
    'estimated_base ' + estBase,
    'current_base ' + currBase,
    'min ' + min,
    'max ' + max
  ].join(', '))
  if (stats.current_base > maxMemUsageLimit) {
    for (let i = 0; i < 10; i += 1) {
      console.error('MEMORY WAS RUNNING OUT')
    } 
    /**
     * kill this process gracefully
     */
    const killTimer = setTimeout(() => {
      process.exit(1)
    }, 1000)
    killTimer.unref()
    server.close()
    console.error(`GOING TO KILL PROCESS IN 1 SECOND(At ${(new Date).toString()})`)
  }
})
