import Vue from 'vue'
import Router from 'vue-router'
// import { ReadrPerm, } from '../util/services'

Vue.use(Router)
// Vue.use(ReadrPerm)

const AppHome = () => import('../views/AppHome.vue')
const AppPost = () => import('../views/AppPost.vue')
const AppReport = () => import('../views/AppReport.vue')
const AppSearch = () => import('../views/AppSearch.vue')
const AppSeries = () => import('../views/AppSeries.vue')

const MemberAccount = () => import('../views/MemberAccount.vue')
const MemberFollowing = () => import('../views/MemberFollowing.vue')

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
      return { y: 0 }
    }
  },
  routes: [
    {
      name: 'home',
      path: '/',
      component: AppHome
    },
    {
      name: 'post',
      path: '/post/:postId?',
      component: AppPost
    },
    {
      name: 'report',
      path: '/report/:slug',
      component: AppReport
    },
    {
      name: 'search',
      path: '/search',
      component: AppSearch
    },
    {
      name: 'series',
      path: '/series/:slug',
      component: AppSeries
    },
    {
      name: 'account',
      path: '/account/:section?',
      component: MemberAccount,
      meta: { permission: 'member' }
    },
    {
      name: 'memberFollowing',
      path: '/following',
      component: MemberFollowing,
      meta: { permission: 'member' }
    },
    { path: '/404', component: PageNotFound },
    { path: '/500', component: ServerError },
    { path: '*', component: PageNotFound }
  ]
})

export function createRouter () {
  return router
}
