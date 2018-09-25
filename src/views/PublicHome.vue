<template>
  <section class="home main">
    <PostBoxWrapper :showPostBox.sync="showPostBox" :hadRouteBeenNavigate="hadRouteBeenNavigate">
      <Invite></Invite>
      <main>
        <TagNavList/>
        <HomeArticleMain v-for="post in postsHome" :key="post.id" :articleData="post" ></HomeArticleMain>
      </main>
      <BaseLightBoxPost :showLightBox="showPostBox" :post="postBox" slot="postContent" /> 
    </PostBoxWrapper>
  </section>
</template>
<script>
  import { get, find, uniqBy, } from 'lodash'
  // import { createStore, } from 'src/store'
  import { currEnv, isScrollBarReachBottom, isCurrentRoutePath, } from 'src/util/comm'
  import HomeArticleMain from 'src/components/home/HomeArticleMain.vue'
  import HomeNavigationMobile from 'src/components/home/HomeNavigationMobile.vue'
  import BaseLightBoxPost from 'src/components/BaseLightBoxPost.vue'
  import Invite from 'src/components/invitation/Invite.vue'
  import PostBoxWrapper from 'src/components/PostBoxWrapper.vue'
  import TagNavList from 'src/components/tag/TagNavList.vue'
  
  const MAXRESULT_POSTS = 10
  const DEFAULT_PAGE = 1
  const DEFAULT_SORT = '-published_at'
  const DEFAULT_CATEGORY = 'latest'
  // const debug = require('debug')('CLIENT:PublicHome')

  const fetchEmotion = (store, params) => {
    return store.dispatch('FETCH_EMOTION_BY_RESOURCE', params)
  }

  const fetchFollowing = (store, params) => {
    if (params.subject) {
      return store.dispatch('GET_FOLLOWING_BY_USER', params)
    } else {
      return store.dispatch('GET_FOLLOWING_BY_RESOURCE', params)
    }
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

  const getUserFollowing = (store, { id = get(store, 'state.profile.id'), resource, resourceType = '', } = {}) => {
    return store.dispatch('GET_FOLLOWING_BY_USER', {
      id: id,
      resource: resource,
      resource_type: resourceType,
    })
  }

  export default {
    name: 'AppHome',
    asyncData ({ store, route, }) {
      const jobs = !get(store, 'state.publicPosts.items.length') ? [
        fetchPosts(store).then(() => {
          if (store.state.isLoggedIn) {
            const postIdsLatest = get(store.state.publicPosts, 'items', []).map(post => post.id)
            if (postIdsLatest.length > 0) {
              fetchEmotion(store, { resource: 'post', ids: postIdsLatest, emotion: 'like', })
              fetchEmotion(store, { resource: 'post', ids: postIdsLatest, emotion: 'dislike', })
            } 
          }
        }),
      ] : []
    
      if (get(route, 'params.postId')) {
        jobs.push(fetchPost(store, { id: get(route, 'params.postId'), }).then(({ status, }) => {
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
            return
          }
        }))
      }

      return Promise.all(jobs)
    },
    components: {
      HomeArticleMain,
      HomeNavigationMobile,
      BaseLightBoxPost,
      Invite,
      PostBoxWrapper,
      TagNavList,
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
      postBox () {
        if (this.showPostBox) {
          const findPostInList = find(this.postsHome, [ 'id', Number(this.$route.params.postId), ])
          return findPostInList || this.postSingle
        } else {
          return {}
        }
      },
      postSingle () {
        return get(this.$store, 'state.publicPostSingle.items.0', {})
      },
      postsHome () {
        return this.articlesListMainCategory !== '/hot' ? this.postsLatest : this.postsHot
      },
      postsHomeTagIds () {
        return uniqBy(this.postsHome.map(post => post.tags).filter(tags => tags).reduce((all, tags) => all.concat(tags), []), 'id').map(tag => tag.id)
      },
      postsHot () {
        return get(this.$store.state.publicPostsHot, 'items', [])
      },
      postsLatest () {
        return get(this.$store.state.publicPosts, 'items', [])
      },
      showPostBox () {
        return this.isCurrentRoutePath('/post/:postId')
      },
    },
    watch: {
      isReachBottom (val) {
        if (val && !this.endPage) {
          this.$_home_loadmore()
        }
      },
      postsHomeTagIds (ids) {
        fetchFollowing(this.$store, { resource: 'tag', ids: ids, })
      },
      '$route' (to, from) {
        this.articlesListMainCategory = this.isCurrentRoutePath('/post/:postId') ? from.path : to.path
        if (!this.hadRouteBeenNavigate) this.hadRouteBeenNavigate = true
      },
    },
    beforeRouteEnter (to, from, next) {
      next(vm => {
        vm.hadRouteBeenNavigate = true
      })
    },
    beforeRouteUpdate (to, from, next) {
      next()
    },
    beforeMount () {
      getUserFollowing(this.$store, { resource: 'post', })
      if (!get(this.postsLatest, 'length')) {
        fetchPosts(this.$store).then(() => {
          if (this.$store.state.isLoggedIn) {
            const postIdsLatest = get(this.$store.state.publicPosts, 'items', []).map(post => post.id)
            if (postIdsLatest.length > 0) {
              fetchEmotion(this.$store, { resource: 'post', ids: postIdsLatest, emotion: 'like', })
              fetchEmotion(this.$store, { resource: 'post', ids: postIdsLatest, emotion: 'dislike', })
            } 
          }
        })
      }
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
              fetchEmotion(this.$store, { mode: 'update', resource: 'post', ids: ids, emotion: 'like', })
              fetchEmotion(this.$store, { mode: 'update', resource: 'post', ids: ids, emotion: 'dislike', })
            }
          }
        })
      },
    },
  }
</script>
<style lang="stylus" scoped>
  .home
    main
      padding-top 20px
</style>