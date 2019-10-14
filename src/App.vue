<template>
  <div
    id="app"
    class="app"
  >
    <LoginLight />
    <AppHeader class="app__header" />
    <transition
      name="fade"
      mode="out-in"
    >
      <router-view class="view" />
    </transition>
    <AppFooter class="app__footer" />
  </div>
</template>

<script>
import AppHeader from 'src/components/AppHeader/AppHeader.vue'
import AppFooter from 'src/components/AppFooter.vue'
import LoginLight from 'src/components/login/LoginLight.vue'
import Tap from 'tap.js'
import { MM_GA_ID, MM_GA_TEST_ID, SITE_FULL, SITE_NAME } from './constants'
import { isAlink, logTrace } from 'src/util/services'
import { mapState } from 'vuex'
import { updateViewport } from 'src/util/comm'

export default {
  components: {
    AppHeader,
    AppFooter,
    LoginLight
  },
  metaInfo () {
    let script = []
    let gaId = MM_GA_TEST_ID
    if (process.env.VUE_ENV === 'client') {
      gaId = location.hostname.match(/(www|m).readr.tw/) ? MM_GA_ID : MM_GA_TEST_ID
      script = [
        {
          src: `https://www.googletagmanager.com/gtag/js?id=${gaId}`,
          async: true
        },
        {
          innerHTML: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${gaId}');
          `
        }
      ]
    }
    return {
      titleTemplate: `%s - ${SITE_NAME}`,
      meta: [
        { vmid: 'og:image', property: 'og:image', content: `${SITE_FULL}/public/og-image.jpg` }
      ],
      script,
      changed: (newInfo, addedTags, removedTags) => {
        if (process.env.VUE_ENV === 'client' && this.needToSendPageView && gtag) {
          gtag('config', `${gaId}`, {
            'page_title': newInfo.title,
            'page_location': location.href
          })
          this.needToSendPageView = false
        }
      }
    }
  },
  data () {
    return {
      needToSendPageView: false,
      tapEvent: undefined // resolve eslint error
    }
  },
  computed: {
    ...mapState({
      currentUser: state => state.DataUser.profile.id,
      useragent: state => state.useragent
    })
  },
  watch: {
    '$route.fullPath' () {
      process.browser && this.sendPageview()
      this.needToSendPageView = true
    }
  },
  beforeMount () {
    this.updateViewport()
  },
  mounted () {
    this.sendPageview()
    this.tapEvent = new Tap(window)
    window.addEventListener('tap', this.handleClickLogger)
    window.addEventListener('resize', this.updateViewport)
  },
  beforeDestroy () {
    window.removeEventListener('tap', this.handleClickLogger)
    window.removeEventListener('resize', this.updateViewport)
  },
  methods: {
    handleClickLogger (event) {
      const checkAlink = isAlink(event.target)
      checkAlink && logTrace({
        category: 'whole-site',
        description: 'ele clicked',
        eventType: 'click',
        sub: this.currentUser,
        target: event.target,
        useragent: this.useragent,
        isAlink: checkAlink
      })
    },
    sendPageview () {
      logTrace({
        category: this.$route.fullPath,
        description: 'pageview',
        eventType: 'pageview',
        sub: this.currentUser,
        target: {},
        useragent: this.useragent
      })
    },
    updateViewport () {
      updateViewport(this.$store)
    }
  }
}
</script>

<style lang="stylus">

h1, h2, h3, p, a, figure, pre
  margin 0
h1, h2, h3, p, a
  color #000
h1
  font-size 2.8125rem
  font-weight normal
h2
  font-size 1.5rem
  font-weight 500
p
  font-size 1.125rem
  font-weight normal
  &.small
    color #4a4a4a
    font-size .875rem
button, input, textarea
  font-size 1rem
a
  text-decoration none
  cursor pointer
  &:link, &:visited, &:hover, &:active
    color #000
button
  background-color transparent
  border none
  cursor pointer
figure
  background-color #979797
img
  font-size .75rem // for alt text
pre
  padding .5em
  color #f8f8f2
  white-space pre-line
  background-color #23241f
  border-radius 3px

.fade-enter-active, .fade-leave-active
  transition opacity .5s
.fade-enter, .fade-leave-to
  opacity 0

.app
  display flex
  flex-direction column
  min-height 100vh
  background-color #f1f1f1
  &__header
    position fixed
    top 0
    left 0
  &-list
    h1, h2, p
      line-height 1.3
    h1, h2, p, figure
      & + h1, & + h2, & + p, & + div
        margin-top .5em
    h1
      font-size .75rem
      font-weight normal
    figure
      background-color #979797
  &-content-area
    width 90%
    margin-left auto
    margin-right auto

.view
  flex 1

@media (min-width: 768px)
  h1
    font-size 2.8125rem
  h2
    font-size 1.5rem
  p
    font-size 1.125rem
    &.small
      font-size .875rem
  .app
    &-content-area
      width 60%
      max-width 800px
    &-list
      font-size 1.5rem
      h1
        font-size 1.5rem
</style>
