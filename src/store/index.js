import Vue from 'vue'
import Vuex from 'vuex'
import actions from './actions'
import mutations from './mutations'
import getters from './getters'

Vue.use(Vuex)

export function createStore () {
  return new Vuex.Store({
    state: {
      'customEditors': [],
      'commentCount': [],
      'consumeFlag': { 
        "active": false, 
        "item": {}, 
      },    
      'donateFlag': { 
        'active': false, 
        'item': {}, 
      },    
      'emotionByResource': {
        'memo': {
          'like': [],
          'dislike': [],
        },
        'post': {
          'like': [],
          'dislike': [],
        },
        'report': {
          'like': [],
          'dislike': [],
        },
      },
      'followingByResource': {
        'member': [],
        'memo': [],
        'post': [],
        'project': [],
        'report': [],
        'tag': [],
      },
      'followingByUser': {},
      'followingByUserStats': {
        post: {
          review: {},
          news: {},
        },
        report: {},
        memo: {},
        project: {},
        tag: {},
      },
      'isClientSide': false,
      'isLoggedIn': false,
      'invitation_switch_status': false,
      'invitation_quota': 0,
      'isTappayRequired': false,
      'isTappayLoaded': false,
      'itemsByTag': {},
      'members': [],
      'membersCount': 0,
      'memos': [],
      'memoSingle': {},
      'notification': [],
      'personalSetting': {},
      'personalPoints': 0, 
      'pointHistories': [],
      'posts': [],
      'postsByTag': [],
      'postsCount': 0,
      'postsDraft': [],
      'postsDraftCount': 0,
      'profile': {},
      'projectsList': [],
      'publicPosts': [],
      'publicPostsHot': [],
      'publicPostSingle': [],
      'publicPostReview': [], 
      'publicPostNews': [], 
      'publicMember': {},
      'publicMembers': {},
      'publicMemos': [],
      'publicMemoSingle': {},
      'publicProjects': {},
      'publicProjectSingle': {},
      'publicReports': [],
      'publicTags': [],
      'publicVideos': {},
      'publicVideosCount': 0,
      'register-token': '',
      'searchResult': {
        'items': [],
      },
      'tags': [],
      'tagsCount': 0,
    },
    actions,
    mutations,
    getters,
  })
}
