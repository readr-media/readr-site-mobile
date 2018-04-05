import Vue from 'vue'
import Router from 'vue-router'
import { ReadrPerm, } from '../util/services'

Vue.use(Router)
Vue.use(ReadrPerm)

if (process.browser) {
  const VueQuillEditor = require('vue-quill-editor/dist/ssr')
  Vue.use(VueQuillEditor)
}

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
const PublicProfile = () => import('../views/PublicProfile.vue')
const PublicProjects = () => import('../views/PublicProjects.vue')
const PublicSearch = () => import('../views/PublicSearch.vue')
const PublicSetPassword = () => import('../views/PublicSetPassword.vue')
// const PublicVideos = () => import('../views/PublicVideos.vue')

const PageNotFound = () => import('../views/PageNotFound.vue')
const ServerError = () => import('../views/ServerError.vue')

const router = new Router({
  mode: 'history',
  fallback: false,
  scrollBehavior: () => ({ y: 0, }),
  routes: [
    { path: '/', component: PublicHome, meta: { permission: 'member', }, },
    { path: '/hot', component: PublicHome, meta: { permission: 'member', }, },
    { path: '/about', component: PublicAbout, meta: { permission: 'member', }, },
    { path: '/admin', component: ManageAdmin, meta: { permission: 'admin', }, },
    { path: '/agreement', component: PublicAgreement, },
    { path: '/editor', component: ManageEditor, meta: { permission: 'editor', }, },
    { path: '/editors', component: PublicEditors, meta: { permission: 'member', }, },
    { path: '/guesteditor', component: ManageGuestEditor, meta: { permission: 'guesteditor', }, },
    { path: '/login', component: PublicLogin, },
    { path: '/member', component: ManageMember, meta: { permission: 'member', }, },
    { path: '/post/:postId', component: PublicHome, meta: { permission: 'member', }, },
    { path: '/profile/:id', component: PublicProfile, meta: { permission: 'member', }, },
    { path: '/projects', component: PublicProjects, meta: { permission: 'member', }, },
    { path: '/search/:keyword', component: PublicSearch, meta: { permission: 'member', }, },
    { path: '/setup/:type', component: PublicSetPassword, },
    { path: '/404', component: PageNotFound, },
    { path: '/500', component: ServerError, },
    // { path: '/videos', component: PublicVideos, },
  ],
})

export function createRouter () {
  return router
}
