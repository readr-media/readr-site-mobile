import Vue from 'vue'
import Vuex from 'vuex'
import actions from './actions'
import mutations from './mutations'
import getters from './getters'

Vue.use(Vuex)

export function createStore () {
  return new Vuex.Store({
    state: {
      'chosenChoices': [],
      'clearUpPointsFlag': {
        'active': false,
        'item': {},        
      },      
      'customEditors': [],
      'commentCount': [],
      'consumeFlag': { 
        "active": false, 
        "item": {}, 
      },  
      'conversationFlag': {
        'active': false,
        'message': '',
      },         
      'donateFlag': { 
        'active': false, 
        'item': {}, 
      },
      'embedPoll': {},
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
      'isRecaptchaLoaded': false,
      'invitation_switch_status': false,
      'invitation_quota': 0,
      'isTappayRequired': false,
      'isTappayLoaded': false,
      'itemsByTag': {},
      'loginAskFlag': {
        'active': false,
        'message': '',
      },      
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
      'projectContents': [],
      'publicPosts': [],
      'publicPostsHot': [],
      'publicPostSingle': [],
      'publicPostReview': [], 
      'publicPostNews': [], 
      'publicMember': {},
      'publicMemberAnnouncement': {},
      'publicMembers': {},
      'publicMemos': [],
      'publicMemoSingle': {},
      'publicProjects': {
        inProgress: [],
        done: [],
        normal: [],
        recommends: [],
        trends: [],
      },
      'publicProjectSingle': {},
      'publicProjectContents': [],
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
