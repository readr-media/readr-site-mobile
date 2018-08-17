import Vue from 'vue'
import Router from 'vue-router'
// import pathToRegexp from 'path-to-regexp'
import { ReadrPerm, } from '../util/services'

Vue.use(Router)
Vue.use(ReadrPerm)

// route-level code splitting
const ManageAdmin = () => import('../views/ManageAdmin.vue')
const ManageEditor = () => import('../views/ManageEditor.vue')
const ManageGuestEditor = () => import('../views/ManageGuestEditor.vue')
const ManageMember = () => import('../views/ManageMember.vue')

const PublicAbout = () => import('../views/PublicAbout.vue')
const PublicAgreement = () => import('../views/PublicAgreement.vue')
const PublicEditors = () => import('../views/PublicEditors.vue')
const PublicHome = () => import('../views/PublicHome.vue')
const PublicLogin = () => import('../views/PublicLogin.vue')
const PublicSeries = () => import('../views/PublicSeries.vue')
const PublicProfile = () => import('../views/PublicProfile.vue')
const PublicProjects = () => import('../views/PublicProjects.vue')
const PublicReportsMemos = () => import('../views/PublicReportsMemos.vue')
const PublicSearch = () => import('../views/PublicSearch.vue')
const PublicSetPassword = () => import('../views/PublicSetPassword.vue')
const PublicTag = () => import('../views/PublicTag.vue')
// const PublicVideos = () => import('../views/PublicVideos.vue')

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
    { path: '/post/:postId?', component: PublicHome, meta: { permission: 'member', }, alias: '/', },
    { path: '/hot', component: PublicHome, meta: { permission: 'member', }, },
    { path: '/about', component: PublicAbout, meta: { permission: 'member', }, },
    { path: '/admin/:panel?/:tool?', component: ManageAdmin, meta: { permission: 'admin', }, },
    { path: '/agreement', component: PublicAgreement, },
    { path: '/editor/:panel?/:tool?', component: ManageEditor, meta: { permission: 'editor', }, },
    { path: '/editors', component: PublicEditors, meta: { permission: 'member', }, },
    { path: '/guesteditor/:panel?/:tool?', component: ManageGuestEditor, meta: { permission: 'guesteditor', }, },
    { path: '/login', component: PublicLogin, },
    { path: '/member/:panel?/:tool?', component: ManageMember, meta: { permission: 'member', }, },
    { path: '/series/:slug/:subItem?', component: PublicSeries, meta: { permission: 'member', }, },
    { path: '/profile/:id', component: PublicProfile, meta: { permission: 'member', }, },
    { path: '/reports', component: PublicReportsMemos, meta: { permission: 'member', }, },
    { path: '/memos', component: PublicReportsMemos, meta: { permission: 'member', }, },
    { path: '/search/:keyword', component: PublicSearch, meta: { permission: 'member', }, },
    { path: '/series-list', component: PublicProjects, meta: { permission: 'member', }, },
    { path: '/setup/:type', component: PublicSetPassword, },
    { path: '/tag/:tagName', component: PublicTag, meta: { permission: 'member', },  },
    { path: '/404', component: PageNotFound, },
    { path: '/500', component: ServerError, },
    // { path: '/videos', component: PublicVideos, },
  ],
})

export function createRouter () {
  return router
}
