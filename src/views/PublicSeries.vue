<template>
  <div class="series">
    <PostBoxWrapper :showPostBox.sync="showPostBox" :hadRouteBeenNavigate="hadRouteBeenNavigate">
      <Invite></Invite>
      <Leading>
        <TagNav
          v-if="project.tags && project.tags.length > 0"
          slot="tagNav"
          :tags="project.tags"
          class="series__tag-nav" />
      </Leading>
      <HomeArticleMain v-for="(post, index) in posts" :key="post.id" :articleData="post" :class="{ 'last-one': index === posts.length - 1, }"></HomeArticleMain>
      <BaseLightBoxPost :showLightBox="showPostBox" :post="postBox" slot="postContent"></BaseLightBoxPost>
    </PostBoxWrapper>
    <Donate></Donate>
  </div>
</template>
<script>
import BaseLightBoxPost from 'src/components/BaseLightBoxPost.vue'
import Donate from 'src/components/point/Donate.vue'
import HomeArticleMain from 'src/components/home/HomeArticleMain.vue'
import Invite from 'src/components/invitation/Invite.vue'
import Leading from 'src/components/leading/Leading.vue'
import PostBoxWrapper from 'src/components/PostBoxWrapper.vue'
import TagNav from 'src/components/tag/TagNav.vue'
import sanitizeHtml from 'sanitize-html'
import truncate from 'truncate-html'
import { SITE_FULL, } from 'src/constants'
import { MEMO_PUBLISH_STATUS, PROJECT_PUBLISH_STATUS, PROJECT_STATUS, } from 'api/config'
import { find, get, } from 'lodash'
import { isScrollBarReachBottom, isElementReachInView, } from 'src/util/comm'
import { createPost, } from 'src/util/post'

const MAXRESULT_POSTS = 10
const DEFAULT_PAGE = 1

const debug = require('debug')('CLIENT:PublicMemo')

const fetchMemoSingle = (store, memoId) => {
  return store.dispatch('GET_MEMO', {
    params: {
      memoId,
    },
  })
}
const fetchPublicMemoSingle = (store, memoId) => {
  return store.dispatch('GET_PUBLIC_MEMO', {
    params: {
      memoId,
      where: { 
        memo_publish_status: MEMO_PUBLISH_STATUS.PUBLISHED, 
        project_publish_status: PROJECT_PUBLISH_STATUS.PUBLISHED, 
      }, 
    },
  })
}
const fetchProjectSingle = (store, proj_slug) => {
  return store.dispatch('GET_PUBLIC_PROJECT', {
    params: {
      where: {
        status: [ PROJECT_STATUS.WIP, PROJECT_STATUS.DONE, ],
        publish_status: PROJECT_PUBLISH_STATUS.PUBLISHED,
      },
      slugs: [ proj_slug, ],
    },
  })
}

const fetchFollowing = (store, params) => {
  return store.dispatch('GET_FOLLOWING_BY_RESOURCE', params)
}

const fetchEmotion = (store, params) => {
  return store.dispatch('FETCH_EMOTION_BY_RESOURCE', params)
}

const getUserFollowing = (store, { id = get(store, 'state.profile.id'), resource, resourceType = '', } = {}) => {
  return store.dispatch('GET_FOLLOWING_BY_USER', {
    id: id,
    resource: resource,
    resource_type: resourceType,
  })
}

const fetchProjectContents = (store, {
  mode = 'set',
  project_id,
  max_result = MAXRESULT_POSTS,
  page = DEFAULT_PAGE,
} = {}) => {
  return store.dispatch('GET_PROJECT_CONTENTS', {
    mode,
    project_id,
    params: {
      max_result,
      page,
    },
  })
}

const fetchPublicProjectContents = (store, {
  mode = 'set',
  project_id,
  max_result = MAXRESULT_POSTS,
  page = DEFAULT_PAGE,
} = {}) => {
  return store.dispatch('GET_PUBLIC_PROJECT_CONTENTS', {
    mode,
    project_id,
    params: {
      max_result,
      page,
    },
  })
}

const loadTappaySDK = store => store.dispatch('LOAD_TAPPAY_SDK')
const switchOn = (store, item) => store.dispatch('SWITCH_ON_DONATE_PANEL', { item, })
const switchOff = store => store.dispatch('SWITCH_OFF_DONATE_PANEL', {})

export default {
  name: 'PublicSeries',
  asyncData ({ store, route, }) {
    const processes = []
    if (get(route, 'params.subItem') && get(route, 'params.subItem') !== 'donate') {
      processes.push(fetchPublicMemoSingle(store, get(route, 'params.subItem')))
    }
    if (get(route, 'params.slug')) {
      processes.push(fetchProjectSingle(store, get(route, 'params.slug')).then(proj => {
        const projId = get(proj, 'id')
        return fetchPublicProjectContents(store, { project_id: projId, })
      }))
    }
    return processes.length > 0 ? Promise.all(processes) : Promise.resolve()
  },  
  metaInfo () {
    if (this.$route.params.subItem) {
      const isPaid = get(this.postSingle, 'project.paid')
      const isProjectDone = get(this.postSingle, 'project.status') === PROJECT_STATUS.DONE
      const desc = isPaid || isProjectDone
        ? truncate(sanitizeHtml(get(this.postSingle, 'content', ''), { allowedTags: [], }), 100)
        : truncate(sanitizeHtml(get(this.postSingle, 'content', ''), { allowedTags: [], }), 100) + '...'
      return {
        title: get(this.postSingle, 'title'),
        ogTitle: get(this.postSingle, 'title'),
        description: desc,
        metaUrl: this.$route.path,
        metaImage: get(this.project, 'heroImage') || `${SITE_FULL}/public/og-image-memo.jpg`,     
        isTappayNeeded: this.isTappayRequired,
      }
    } else {
      return {
        title: get(this.project, 'title'),
        ogTitle: get(this.project, 'ogTitle') || get(this.project, 'title'),
        description: get(this.project, 'ogDescription') || get(this.project, 'description'),
        metaUrl: this.$route.path,
        metaImage: get(this.project, 'ogImage') || get(this.project, 'heroImage'),            
        isTappayNeeded: this.isTappayRequired,
      }
    }    
  },    
  components: {
    BaseLightBoxPost,
    Donate,
    HomeArticleMain,
    Invite,
    Leading,
    PostBoxWrapper,
    TagNav,
  },
  computed: {
    isTappayRequired () {
      return get(this.$store, 'state.isTappayRequired', false)
    },   
    me () {
      return get(this.$store, 'state.profile', {})
    },
    posts () {
      const publicProjectContents = get(this.$store.state, 'publicProjectContents')
      const projectContents = get(this.$store.state, 'projectContents')
      return projectContents.length === 0 ? publicProjectContents : projectContents
    },
    postSingle () {
      return get(this.$store, 'state.memoSingle.id') ? get(this.$store, 'state.memoSingle') : get(this.$store, 'state.publicMemoSingle', {})
    },    
    postBox () {
      if (this.showPostBox) {
        const findPostInList = find(this.posts, { 'id' : Number(this.$route.params.subItem), })
        debug('Number(this.$route.params.subItem)', Number(this.$route.params.subItem), this.$route.params.subItem)
        debug('findPostInList', findPostInList)
        debug('this.postSingle', this.postSingle)
        return findPostInList || this.postSingle
      } else {
        return {}
      }      
    },
    project () {
      return get(this.$store, 'state.publicProjectSingle')
    },
    projectTagIds () {
      const tags = this.project.tags || []
      return tags.map(tag => tag.id)
    },
    showPostBox () {
      return typeof(get(this.$route, 'params.subItem')) === 'string' && get(this.$route, 'params.subItem') !== 'donate'
    },
  },
  data () {
    return {
      currPage: DEFAULT_PAGE,
      hadRouteBeenNavigate: false,
      isReachBottom: false,
      isLoadMoreEnd: false,
      isSeriesDonate: false,
    }
  },
  methods: {
    donateCheck () { 
      debug('do check donate')
      this.isSeriesDonate && this.project && switchOn(this.$store, this.project) 
      if (this.isSeriesDonate) {
        this.project && switchOn(this.$store, this.project)
      } else {
        switchOff(this.$store)
      }      
    },    
    isScrollBarReachBottom,
    isElementReachInView,
    loadmore () {
      // this.shouldShowSpinner = true
      const process = () => (this.me.id ? fetchProjectContents(this.$store, {
        mode: 'update',
        project_id: get(this.project, 'id', 0),
        page: this.currPage + 1,
      }) : fetchPublicProjectContents(this.$store, {
        mode: 'update',
        project_id: get(this.project, 'id', 0),
        page: this.currPage + 1,
      }))
      return process().then((res) => {
        // this.shouldShowSpinner = false
        debug('Loadmore done. Status', res, get(res, 'status'))
        this.currPage += 1
        if (get(res, 'status') === 200) {
          this.fetchSeriesPostsResources(this.posts)
        } else if (get(res, 'status') === 'end') {
          this.isLoadMoreEnd = true
        }
      })
    },
    fetchSeriesPostsResources (postItems) {
      const posts = postItems.map(item => createPost(item)).map(item => ({ postType: get(item, [ 'processed', 'postType', ], ''), id: item.id, }))
      const reportIds = posts.filter(item => item.postType === 'report').map(item => item.id)
      const memoIds = posts.filter(item => item.postType === 'memo').map(item => item.id)
      if (reportIds.length > 0) {
        // fetchFollowing(this.$store, { resource: 'report', ids: reportIds, })
        fetchEmotion(this.$store, { resource: 'report', ids: reportIds, emotion: 'like', })
        fetchEmotion(this.$store, { resource: 'report', ids: reportIds, emotion: 'dislike', })
      }
      if (memoIds.length > 0) {
        // fetchFollowing(this.$store, { resource: 'memo', ids: memoIds, })
        fetchEmotion(this.$store, { resource: 'memo', ids: memoIds, emotion: 'like', })
        fetchEmotion(this.$store, { resource: 'memo', ids: memoIds, emotion: 'dislike', })
      }
    },
    runJobs () {
      if (get(this.me, 'id')) {
        fetchProjectContents(this.$store, { project_id: get(this.project, 'id', 0), })
        this.$route.params.subItem && fetchMemoSingle(this.$store, this.$route.params.subItem)
      }
      this.fetchSeriesPostsResources(this.posts)

      getUserFollowing(this.$store, { resource: 'post', })
      getUserFollowing(this.$store, { resource: 'memo', })
      getUserFollowing(this.$store, { resource: 'report', })
      getUserFollowing(this.$store, { resource: 'project', })
      getUserFollowing(this.$store, { resource: 'tag', })
    },   
  },
  beforeRouteUpdate (to, from, next) {
    debug('this.showLightBox', this.showPostBox)
    debug('this.postBox', this.postBox)
    debug('this.postSingle', this.postSingle)
    debug(`get(this.$route, 'params.subItem')`, get(to, 'params.subItem'))
    debug('this.hadRouteBeenNavigate', this.hadRouteBeenNavigate)
    this.isSeriesDonate = get(to, 'params.subItem') === 'donate'
    next()
  },  
  beforeMount () {
    this.runJobs()
    loadTappaySDK(this.$store)
    this.isSeriesDonate = get(this.$route, 'params.subItem') === 'donate'
  }, 
  mounted () {
    this.donateCheck() 
    window.addEventListener('scroll', () => {
      this.isReachBottom
        = this.$el.getBoundingClientRect().bottom < window.innerHeight - 10
        || this.isElementReachInView('.last-one', 0.5)
        || this.isScrollBarReachBottom()
    })    
  },
  watch: {
    isSeriesDonate () { 
      debug('Mutation detected: isSeriesDonate', this.isSeriesDonate) 
      this.donateCheck() 
    }, 
    me () {
      this.runJobs()
    },    
    project () { 
      debug('Mutation detected: project')
    },    
    isReachBottom () {
      debug('Mutation detected: isReachBottom', this.isReachBottom, this.isLoadMoreEnd)
      if (!this.isReachBottom || this.isLoadMoreEnd) { return }
      this.loadmore()
    },
    isTappayRequired () {
      debug('Mutation detected: isTappayRequired', this.isTappayRequired)
      this.$forceUpdate()
    },     
    projectTagIds (ids) {
      fetchFollowing(this.$store, { resource: 'tag', ids: ids, })
    },
    '$route' (to, from) {
      // this.articlesListMainCategory = this.isCurrentRoutePath('/post/:postId') ? from.path : to.path
      // if (!this.hadRouteBeenNavigate) this.hadRouteBeenNavigate = true
      debug('Mutation detected: $route', to, from)
      if (!this.hadRouteBeenNavigate) this.hadRouteBeenNavigate = true
    },
    '$route.params.subItem' () {
      debug('Mutation detected: $route.params.subItem')
      this.isSeriesDonate = get(this.$route, 'params.subItem') === 'donate'
    },
  },
}
</script>
<style lang="stylus" scoped>
.series
  padding-bottom 50px
  background-color #e6e6e6
  &__tag-nav
    margin-bottom 10px
    padding 0 15px
    >>> .tag
      background-color #fff
</style>