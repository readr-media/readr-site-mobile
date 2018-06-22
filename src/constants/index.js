import { ROLE_MAP as ROLE_MAP_CONF, } from 'api/config' 
import { get, } from 'lodash'
import projectList from './projectList'
export const PROJECTS = projectList

export const SITE_DOMAIN = 'readr.tw'
export const SITE_DOMAIN_DEV = 'dev.readr.tw'

export const ROLE_MAP = [
  { key: get(ROLE_MAP_CONF, 'ADMIN'), value: '管理員', route: 'admin', },
  { key: get(ROLE_MAP_CONF, 'EDITOR'), value: '編輯', route: 'editor', },
  { key: get(ROLE_MAP_CONF, 'GUESTEDITOR'), value: '總編', route: 'guesteditor', },
  { key: get(ROLE_MAP_CONF, 'MEMBER'), value: '會員', route: 'member', },
]

export const SECTIONS_DEFAULT = {
  // 'chief-editor-talk': '總編評論',
  // 'celebrities-talk': '名人聊新聞',
  // 'hot-talk': '熱門評論',
  // 'chief-editor-list': '總編列表',
  // 'projects': '新聞專題'
  'chief-editor-talk': '視角',
  'celebrities-talk': '對話',
  'hot-talk': '焦點',
  'chief-editor-list': '客座',
  'projects': '議題',
}

export const MM_SITE_DOMAIN = 'mirrormedia.mg'

export const OLD_PROJECTS_SLUGS = [
  'burkinafasogallery',
  'burkinafaso',
  'allenlien',
  'taiwan_diplomatic_relations',
  'legendhou-painting',
  'legendhou-gallery',
  'legendhou',
  'airquality',
  'valentines_day',
  'transport-industry',
  'transport-industry-mrt',
  'lottery',
  'mining',
  'hot-sugar',
  '20170801aboriginal',
  'universiade2017-chenshihchieh',
  'universiade2017-chenchieh',
  'universiade2017-chenyenyu',
  'universiade2017-kungyun',
  'universiade2017',
  'whitecollar',
  'real-name',
  'poetry',
  'rent-king',
  'rent-house',
  'political-contribution',
  'fertility',
]

// Image upload max size 30 MB
export const IMAGE_UPLOAD_MAX_SIZE = 31457280

export const CUSTOM_EDITOR_LIMIT = 3
export const RESOURCE_TYPE = {
  POST: 'post',
  RPOJECT: 'series',
  MEMO: 'memo',
  REPORT: 'project',
}
