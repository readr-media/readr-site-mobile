<template>
  <div class="series">
    <PostBoxWrapper :showPostBox.sync="showPostBox" :hadRouteBeenNavigate="hadRouteBeenNavigate">
      <Invite></Invite>
      <Leading></Leading>
      <HomeArticleMain v-for="post in posts" :key="post.id" :articleData="post" ></HomeArticleMain>
      <BaseLightBoxPost :showLightBox="showPostBox" :post="postBox" slot="postContent"></BaseLightBoxPost>
    </PostBoxWrapper>
  </div>
</template>
<script>
import BaseLightBoxPost from 'src/components/BaseLightBoxPost.vue'
import HomeArticleMain from 'src/components/home/HomeArticleMain.vue'
import Invite from 'src/components/invitation/Invite.vue'
import Leading from 'src/components/leading/Leading.vue'
import PostBoxWrapper from 'src/components/PostBoxWrapper.vue'
import moment from 'moment'
import { PROJECT_PUBLISH_STATUS, PROJECT_STATUS, REPORT_PUBLISH_STATUS, } from 'api/config'
import { find, get, sortBy, union, } from 'lodash'
import { isScrollBarReachBottom, isElementReachInView, } from 'src/util/comm'

const MAXRESULT_POSTS = 1
const DEFAULT_PAGE = 1
const DEFAULT_SORT = '-memo_order,-created_at'

const debug = require('debug')('CLIENT:PublicMemo')
const fetchMemos = (store, {
  mode = 'set',
  proj_ids = [],
  page = DEFAULT_PAGE,
}) => {
  return store.dispatch('GET_MEMOS', {
    params: {
      member_id: get(store, 'state.profile.id'),
      project_id: proj_ids,
      max_result: MAXRESULT_POSTS,
      page,
      sort: DEFAULT_SORT,
      where: {
        publish_status: [ 2, ],
      },
    },
    mode,
  })
}
const fetchMemoSingle = (store, memoId) => {
  return store.dispatch('GET_MEMO', {
    params: {
      member_id: get(store, 'state.profile.id'),
      memoId,
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
const fetchReportsList = (store, {
  max_result = 10,
  proj_ids = [],
  sort = '-created_at',
} = {}) => {
  return store.dispatch('GET_PUBLIC_REPORTS', {
    params: {
      max_result: max_result,
      project_id: proj_ids,
      where: {
        publish_status: REPORT_PUBLISH_STATUS.PUBLISHED,
      },
      sort: sort,
    },
  })
}

export default {
  name: 'PublicSeries',
  components: {
    BaseLightBoxPost,
    HomeArticleMain,
    Invite,
    Leading,
    PostBoxWrapper,
  },
  computed: {
    posts () {
      return sortBy(union(get(this.$store, 'state.memos', []), get(this.$store, 'state.publicReports', [])), [ p => -moment(p.publishedAt), ])
    },
    showPostBox () {
      return typeof(get(this.$route, 'params.subItem')) === 'string'
    },
    postSingle () {
      return get(this.$store, 'state.memoSingle', {})
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
  },
  data () {
    return {
      currPage: DEFAULT_PAGE,
      currRefId: 0,
      hadRouteBeenNavigate: false,
      isReachBottom: false,
      isLoadMoreEnd: false,
    }
  },
  methods: {
    isScrollBarReachBottom,
    isElementReachInView,
    loadmore () {
      // this.shouldShowSpinner = true
      return fetchMemos(this.$store, {
        mode: 'update',
        proj_ids: [ this.currRefId, ],
        page: this.currPage,
      }).then((res) => {
        // this.shouldShowSpinner = false
        debug('Loadmore done. Status', res, get(res, 'status'))
        if (get(res, 'status') === 200) {
          this.currPage += 1
        } else if (get(res, 'status') === 'end') {
          this.isLoadMoreEnd = true
        }
      })
    },    
  },
  beforeRouteUpdate (to, from, next) {
    debug('this.showLightBox', this.showPostBox)
    debug('this.postBox', this.postBox)
    debug('this.postSingle', this.postSingle)
    debug(`get(this.$route, 'params.subItem')`, get(to, 'params.subItem'))
    debug('this.hadRouteBeenNavigate', this.hadRouteBeenNavigate)
    next()
  },  
  beforeMount () {
    Promise.all([
      fetchProjectSingle(this.$store, get(this.$route, 'params.slug')).then((proj) => {
        debug(proj)
        this.currRefId = get(proj, 'id') 
        if (proj) {
          return Promise.all([
            Promise.all([
              fetchMemos(this.$store, {
                mode: this.currPage === 1 ? 'set' : 'update',
                proj_ids: [ this.currRefId, ],
                page: this.currPage,
              }),
              fetchReportsList(this.$store, {
                proj_ids: [ this.currRefId, ],
                page: this.currPage,
              }),
            ]).then(() => { this.currPage += 1 }),
            get(this.$route, 'params.subItem')
              ? fetchMemoSingle(this.$store, get(this.$route, 'params.subItem'))
              : Promise.resolve(),
          ])
        } else {
          /**
          * Forbidden.
          */
          this.isLoadMoreEnd = true
          this.$router.push('/')
          return
        }
      }),
    ])
  }, 
  mounted () {
    window.addEventListener('scroll', () => {
      this.isReachBottom = this.isElementReachInView('.memo', 0.5) || this.isScrollBarReachBottom()
    })    
  },
  watch: {
    isReachBottom () {
      debug('Mutation detected: isReachBottom', this.isReachBottom)
      if (!this.isReachBottom || this.isLoadMoreEnd) { return }
      this.loadmore()
    },    
    '$route' (to, from) {
      // this.articlesListMainCategory = this.isCurrentRoutePath('/post/:postId') ? from.path : to.path
      // if (!this.hadRouteBeenNavigate) this.hadRouteBeenNavigate = true
      debug('Mutation detected: $route', to, from)
      if (!this.hadRouteBeenNavigate) this.hadRouteBeenNavigate = true
    },
  },
}
</script>
<style lang="stylus" scoped>
.series
  padding-bottom 50px
</style>