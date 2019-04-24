<template>
  <section class="home main">
    <PostBoxWrapper :showPostBox.sync="showPostBox" :hadRouteBeenNavigate="hadRouteBeenNavigate">
      <main>
        <HomeRadios :picked.sync="pickedMainView"/>
        <TagNavList v-show="pickedMainView === 'tags'"/>
        <HomeArticleMain
          v-show="pickedMainView === 'posts'"
          v-for="post in postsHome"
          :key="post.id"
          :articleData="post"
          :shouldShowMultipleDate="false"
        />
      </main>
      <BaseLightBoxPost :showLightBox="showPostBox" :post="postBox" slot="postContent" /> 
    </PostBoxWrapper>
  </section>
</template>
<script>
  import { SITE_FULL, } from 'src/constants'
  import { get, find, uniqBy, } from 'lodash'
  // import { createStore, } from 'src/store'
  import { currEnv, isScrollBarReachBottom, isCurrentRoutePath, } from 'src/util/comm'
  import HomeArticleMain from 'src/components/home/HomeArticleMain.vue'
  // import HomeNavigationMobile from 'src/components/home/HomeNavigationMobile.vue'
  import HomeRadios from 'src/components/home/HomeRadios.vue'
  import BaseLightBoxPost from 'src/components/BaseLightBoxPost.vue'
  import PostBoxWrapper from 'src/components/PostBoxWrapper.vue'
  import TagNavList from 'src/components/tag/TagNavList.vue'
  import sanitizeHtml from 'sanitize-html'
  import truncate from 'truncate-html'

  
  const MAXRESULT_POSTS = 10
  const DEFAULT_PAGE = 1
  const DEFAULT_SORT = '-published_at'
  const DEFAULT_CATEGORY = 'latest'
  const debug = require('debug')('CLIENT:Home')

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

  const fetchPost = (store, { id, isPreview, }) => {
    return store.dispatch('GET_POST', {
      id,
      isPreview,
      params: {
        showAuthor: true,
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
        showAuthor: true,
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
    name: 'Home',
    asyncData ({ store, route, router, }) {
      const jobs = !get(store, 'state.publicPosts.items.length') ? [
        fetchPosts(store).then(() => {
          const postIdsLatest = get(store.state.publicPosts, 'items', []).map(post => post.id)
          if (postIdsLatest.length > 0) {
            return Promise.all([
              fetchEmotion(store, { resource: 'post', ids: postIdsLatest, emotion: 'like', }),
              fetchEmotion(store, { resource: 'post', ids: postIdsLatest, emotion: 'dislike', }),
            ])
          } 
        }),
      ] : []
    
      if (get(route, 'params.postId')) {
        jobs.push(fetchPost(store, {
          id: get(route, 'params.postId'),
        }).catch(e => {
          /** Post Not Found */
          debug('Error:', e)
          if (e === 'Not Found') {
            if (!get(store, 'state.publicPostSingle.items.0.ogTitle') && !get(store, 'state.publicPostSingle.items.0.title')) {

              /** If preview, dont redirect to 404 */
              if (get(route, 'query.preview')) { return }

              if (process.browser) {
                router.push('/404')
              } else {
                debug('Going to throw 404 Error')
                const err = new Error()
                err.massage = 'Page Not Found'
                err.code = 404
                throw err  
              }
            }          
          } else {
            const err = new Error()
            err.massage = e
            err.code = 500
            throw err 
          }
        }))
      }

      return Promise.all(jobs)
    },
    metaInfo () {
      if (this.$route.params.postId) {
        return {
          ogTitle: get(this.postSingle, 'ogTitle') || get(this.postSingle, 'title'),
          description: get(this.postSingle, 'ogDescription') || truncate(sanitizeHtml(get(this.postSingle, 'content', ''), { allowedTags: [], }), 100),
          metaUrl: this.$route.path,
          metaImage: get(this.postSingle, 'ogImage') || `${SITE_FULL}/public/og-image-post.jpg`,
        }
      } else {
        return {
          description: this.$i18n ? this.$t('OG.DESCRIPTION') : '',
          ogTitle: '',
          title: '',
          metaUrl: this.$route.path,
        }

      }
    },
    components: {
      HomeArticleMain,
      // HomeNavigationMobile,
      HomeRadios,
      BaseLightBoxPost,
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
        pickedMainView: 'posts',
      }
    },
    computed: {
      currEnv,
      me () {
        return get(this.$store, 'state.profile', {})
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
      me() {
        getUserFollowing(this.$store, { resource: 'post', })
      },       
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
          const postIdsLatest = get(this.$store.state.publicPosts, 'items', []).map(post => post.id)
          if (postIdsLatest.length > 0) {
            fetchEmotion(this.$store, { resource: 'post', ids: postIdsLatest, emotion: 'like', })
            fetchEmotion(this.$store, { resource: 'post', ids: postIdsLatest, emotion: 'dislike', })
          } 
        })
      }
      if (get(this.$route, 'params.postId') && get(this.$route, 'query.preview')) {
        fetchPost(this.$store, {
          id: get(this.$route, 'params.postId'),
          isPreview: get(this.$route, 'query.preview'),
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
            const ids = res.items.map(post => post.id)
            fetchEmotion(this.$store, { mode: 'update', resource: 'post', ids: ids, emotion: 'like', })
            fetchEmotion(this.$store, { mode: 'update', resource: 'post', ids: ids, emotion: 'dislike', })
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