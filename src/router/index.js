import Vue from 'vue'
import Router from 'vue-router'
// import { ReadrPerm, } from '../util/services'

Vue.use(Router)
// Vue.use(ReadrPerm)

// route-level code splitting
const AppPost = () => import('../views/AppPost.vue')
const PublicHome = () => import('../views/PublicHome.vue')

const PageNotFound = () => import('../views/PageNotFound.vue')
const ServerError = () => import('../views/ServerError.vue')

const debug = require('debug')('CLIENT:router')

const router = new Router({
  mode: 'history',
  fallback: false,
  scrollBehavior: (to, from, savedPosition) => {
    debug('savedPosition', savedPosition)
    if (savedPosition) {
      return savedPosition
    } else {
      return { y: 0, }
    }
  },
  routes: [
    { name: 'home', path: '/', component: PublicHome, },
    { name: 'post', path: '/post/:postId?', component: AppPost, },
    { path: '/404', component: PageNotFound, },
    { path: '/500', component: ServerError, },
    { path: '*', component: PageNotFound, },
  ],
})

export function createRouter () {
  return router
}
