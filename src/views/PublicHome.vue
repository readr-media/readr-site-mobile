<template>
  <section class="home main">
    <PostBoxWrapper :showPostBox.sync="showPostBox" :hadRouteBeenNavigate="hadRouteBeenNavigate">
      <Invite></Invite>
      <main>
        <HomeNavigationMobile v-if="hasNavigation" :memos="memos" :reports="reports" :video="video"></HomeNavigationMobile>
        <HomeArticleMain v-for="post in postsHome" :key="post.id" :articleData="post" ></HomeArticleMain>
      </main>
      <BaseLightBoxPost :showLightBox="showPostBox" :post="postBox" slot="postContent" /> 
    </PostBoxWrapper>
  </section>
</template>
<script>
  import { MEMO_PUBLISH_STATUS, POINT_OBJECT_TYPE, REPORT_PUBLISH_STATUS, } from 'api/config'
  import { get, find, uniq, concat, } from 'lodash'
  // import { createStore, } from 'src/store'
  import { currEnv, isScrollBarReachBottom, isCurrentRoutePath, } from 'src/util/comm'
  import HomeArticleMain from 'src/components/home/HomeArticleMain.vue'
  import HomeNavigationMobile from 'src/components/home/HomeNavigationMobile.vue'
  import BaseLightBoxPost from 'src/components/BaseLightBoxPost.vue'
  import Invite from 'src/components/invitation/Invite.vue'
  import PostBoxWrapper from 'src/components/PostBoxWrapper.vue'
  
  const MAXRESULT_MEMOS = 3
  const MAXRESULT_POSTS = 10
  const MAXRESULT_REPORTS = 4
  const MAXRESULT_VIDEOS = 1
  const DEFAULT_PAGE = 1
  const DEFAULT_SORT = '-published_at'
  const DEFAULT_CATEGORY = 'latest'
  // const debug = require('debug')('CLIENT:PublicHome')

  const fetchFollowing = (store, params) => {
    if (params.subject) {
      return store.dispatch('GET_FOLLOWING_BY_USER', params)
    } else {
      return store.dispatch('GET_FOLLOWING_BY_RESOURCE', params)
    }
  }

  const fetchMemos = (store, {
    max_result = MAXRESULT_MEMOS,
    sort = DEFAULT_SORT,
  } = {}) => {
    return store.dispatch('GET_PUBLIC_MEMOS', {
      params: {
        max_result: max_result,
        member_id: get(store, 'state.profile.id'),
        where: {
          memo_publish_status: MEMO_PUBLISH_STATUS.PUBLISHED,
        },
        sort: sort,
      },
    })
  }

  const fetchPost = (store, { id, }) => {
    return store.dispatch('GET_POST', {
      params: {
        id: id,
      },
    })
  }

  const fetchPosts = (store, {
    max_result = MAXRESULT_POSTS,
    mode = 'set',
    category = DEFAULT_CATEGORY,
    page = DEFAULT_PAGE,
    sort = DEFAULT_SORT,
  } = {}) => {
    return store.dispatch('GET_PUBLIC_POSTS', {
      params: {
        mode: mode,
        category: category,
        max_result: max_result,
        page: page,
        sort: sort,
      },
    })
  }

  const fetchPointHistories = (store, { objectIds, objectType, }) => {
    return store.dispatch('GET_POINT_HISTORIES', {
      params: {
        memberId: get(store, [ 'state', 'profile', 'id', ]),
        objectType: objectType,
        objectIds: objectIds,
      },
    })
  }

  const fetchReportsList = (store, {
    max_result = MAXRESULT_REPORTS,
    sort = DEFAULT_SORT,
  } = {}) => {
    return store.dispatch('GET_PUBLIC_REPORTS', {
      params: {
        max_result: max_result,
        where: {
          publish_status: REPORT_PUBLISH_STATUS.PUBLISHED,
        },
        sort: sort,
      },
    })
  }

  const fetchVideos = (store) => {
    return store.dispatch('GET_PUBLIC_VIDEOS', {
      params: {
        max_result: MAXRESULT_VIDEOS,
      },
    })
  }

  const pageJump = ({ store, to, next, }) => {
    if ('postId' in to.params && to.params.postId) {
      fetchPost(store, { id: to.params.postId, }).then(({ status, }) => {
        if (status === 'error') {
          if (process.browser) {
            // next('/404')
          } else {
            const e = new Error()
            e.massage = 'Page Not Found'
            e.code = '404'
            throw e  
          }
        } else {
          next()
        }
      })
    } else {
      next()
    }
  }

  export default {
    name: 'AppHome',
    // Uncomment this when v1.0 is released
    // asyncData ({ store, route, }) {
    //   let reqs = [
    //     fetchPosts(store),
    //     fetchPosts(store, { category: 'hot', }),
    //     fetchProjectsList(store, { max_result: 5, status: PROJECT_STATUS.WIP, }),
    //     fetchProjectsList(store, { max_result: 2, status: PROJECT_STATUS.DONE, }),
    //     fetchVideos(store),
    //   ]

    //   if (route.params.postId) {
    //     reqs.push(fetchPost(store, { id: route.params.postId, }))
    //   }

    //   return Promise.all(reqs)
    // },
    components: {
      HomeArticleMain,
      HomeNavigationMobile,
      BaseLightBoxPost,
      Invite,
      PostBoxWrapper,
    },
    data () {
      return {
        articlesListMainCategory: this.$route.path !== '/hot' ? '/' : '/hot',
        hadRouteBeenNavigate: false,
        currentPage: DEFAULT_PAGE,
        endPage: false,
        isReachBottom: false,
      }
    },
    computed: {
      currEnv,
      hasNavigation () {
        return this.memos.length !== 0 || this.reports.length !== 0
      },
      isClientSide () {
        return get(this.$store, 'state.isClientSide', false)
      },
      memos () {
        return get(this.$store.state, 'publicMemos', [])
      },
      postBox () {
        if (this.showPostBox) {
          const findPostInList = find(this.postsHome, [ 'id', Number(this.$route.params.postId), ])
          return findPostInList || this.postSingle
        } else {
          return {}
        }
      },
      postSingle () {
        return get(this.$store.state.publicPostSingle, 'items[0]', {})
      },
      postsHome () {
        return this.articlesListMainCategory !== '/hot' ? this.postsLatest : this.postsHot
      },
      postsHot () {
        return get(this.$store.state.publicPostsHot, 'items', [])
      },
      postsLatest () {
        return get(this.$store.state.publicPosts, 'items', [])
      },
      reports () {
        return get(this.$store, [ 'state', 'publicReports', ], [])
      },
      showPostBox () {
        return this.isCurrentRoutePath('/post/:postId')
      },
      video () {
        return get(this.$store, [ 'state', 'publicVideos', 0, ])
      },
    },
    watch: {
      isReachBottom (val) {
        if (val && !this.endPage) {
          this.$_home_loadmore()
        }
      },
      '$route' (to, from) {
        this.articlesListMainCategory = this.isCurrentRoutePath('/post/:postId') ? from.path : to.path
        if (!this.hadRouteBeenNavigate) this.hadRouteBeenNavigate = true
      },
    },
    beforeRouteEnter (to, from, next) {
      // const store = createStore()
      // pageJump({ store, to, next, })
      next()
    },
    beforeRouteUpdate (to, from, next) {
      pageJump({ store: this.$store, to, next, })
    },
    beforeMount () {
      const process = () => {
        let reqs = [
          fetchMemos(this.$store),
          fetchPosts(this.$store),
          fetchPosts(this.$store, { category: 'hot', }),
          fetchReportsList(this.$store),
          fetchVideos(this.$store),
        ]

        if (this.$route.params.postId) {
          reqs.push(fetchPost(this.$store, { id: this.$route.params.postId, }))
        }

        Promise.all(reqs).then(() => {
          if (this.$store.state.isLoggedIn) {
            const postIdsLatest = get(this.$store.state.publicPosts, 'items', []).map(post => post.id)
            const postIdsHot = get(this.$store.state.publicPostsHot, 'items', []).map(post => post.id)
            const reportIds = get(this.$store.state, 'publicReports', []).map(report => report.id)
            const ids = uniq(concat(postIdsLatest, postIdsHot))
            const projectIds = uniq(get(this.$store, 'state.publicMemos', []).map(memo => memo.projectId))
            if (ids.length !== 0) {
              fetchFollowing(this.$store, {
                resource: 'post',
                ids: ids,
              })
            }
            if (reportIds.length !== 0) {
              fetchFollowing(this.$store, {
                resource: 'report',
                ids: reportIds,
              })
            }
            if (projectIds.length !== 0) {
              fetchPointHistories(this.$store, { objectType: POINT_OBJECT_TYPE.PROJECT_MEMO, objectIds: projectIds, })
            }
          }
        })        
      }

      if (get(this.$route, 'params.postId')) {
        fetchPost(this.$store, { id: get(this.$route, 'params.postId'), }).then(({ status, }) => {
          if (status === 'error') {
            if (process.browser) {
              this.$router.push('/404')
            } else {
              const e = new Error()
              e.massage = 'Page Not Found'
              e.code = '404'
              throw e  
            }
          } else {
            process() 
          }
        })
      } else {
        process()
      }

      // Uncomment this when v1.0 is released
      // if (this.$store.state.isLoggedIn) {
      //   const postIdsLatest = get(this.$store.state.publicPosts, 'items', []).map(post => `${post.id}`)
      //   const postIdsHot = get(this.$store.state.publicPostsHot, 'items', []).map(post => `${post.id}`)
      //   const postIdFeaturedProject = get(this.$store.state.projectsList, 'items', []).map(project => `${project.id}`)
      //   const ids = uniq(concat(postIdsLatest, postIdsHot))

      //   if (ids.length !== 0) {
      //     fetchFollowing(this.$store, {
      //       resource: 'post',
      //       ids: ids,
      //     })
      //   }

      //   if (postIdFeaturedProject.length !== 0) {
      //     fetchFollowing(this.$store, {
      //       resource: 'project',
      //       ids: postIdFeaturedProject,
      //     })
      //   }
      // }
    },
    mounted () {
      window.addEventListener('scroll', () => {
        this.isReachBottom = isScrollBarReachBottom(1/3)
      })
    },
    methods: {
      isCurrentRoutePath,
      $_home_loadmore () {
        fetchPosts(this.$store, { mode: 'update', max_result: 10, page: this.currentPage + 1, })
        .then(({ status, res, }) => {
          if (status === 'end') {
            this.endPage = true
          } else if (status === 'error') {
            console.log(res)
          } else {
            this.currentPage += 1
            if (this.$store.state.isLoggedIn) {
              const ids = res.items.map(post => post.id)
              fetchFollowing(this.$store, {
                mode: 'update',
                resource: 'post',
                ids: ids,
              })
            }
          }
        })
      },
    },
  }
</script>
<style lang="stylus" scoped>
  @media (min-width 768px)
    .home
      main
        position relative
        padding 0 20px 0 80px
  //     padding 80px 20px 0 80px

</style>