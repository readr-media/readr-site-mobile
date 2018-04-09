<template>
  <section class="home main">
    <BaseLightBox v-show="showLightBox" @closeLightBox="closeLightBox">
      <BaseLightBoxPost :showLightBox="showLightBox" :post="postLightBox"/>
    </BaseLightBox>
    <Invite></Invite>
    <main>
      <HomeNavigationMobile v-if="hasNavigation" :projectsDone="projectsDone" :projectsInProgress="projectsInProgress" :video="video"></HomeNavigationMobile>
      <HomeArticleMain v-for="post in postsHome" :key="post.id" :articleData="post" ></HomeArticleMain>
    </main>
  </section>
</template>
<script>
  import { PROJECT_STATUS, } from '../../api/config'
  import { get, find, uniq, concat, } from 'lodash'
  import { isScrollBarReachBottom, isCurrentRoutePath, } from '../util/comm'
  import { createStore, } from '../store'
  import HomeArticleMain from '../components/home/HomeArticleMain.vue'
  import HomeNavigationMobile from '../components/home/HomeNavigationMobile.vue'
  import BaseLightBox from 'src/components/BaseLightBox.vue'
  import BaseLightBoxPost from 'src/components/BaseLightBoxPost.vue'
  import Invite from '../components/invitation/Invite.vue'
  
  const MAXRESULT_POSTS = 10
  const MAXRESULT_PROJECTS = 2
  const MAXRESULT_VIDEOS = 1
  const DEFAULT_PAGE = 1
  const DEFAULT_SORT = '-updated_at'
  const DEFAULT_CATEGORY = 'latest'

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

  const fetchProjectsList = (store, {
    max_result = MAXRESULT_PROJECTS,
    status,
  } = {}) => {
    return store.dispatch('GET_PUBLIC_PROJECTS', {
      params: {
        max_result: max_result,
        where: {
          status: status,
        },
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

  export default {
    name: 'AppHome',
    asyncData ({ store, route, }) {
      let reqs = [
        fetchPosts(store),
        fetchPosts(store, { category: 'hot', }),
        fetchProjectsList(store, { max_result: 5, status: PROJECT_STATUS.WIP, }),
        fetchProjectsList(store, { max_result: 2, status: PROJECT_STATUS.DONE, }),
        fetchVideos(store),
      ]

      if (route.params.postId) {
        reqs.push(fetchPost(store, { id: route.params.postId, }))
      }

      return Promise.all(reqs)
    },
    components: {
      HomeArticleMain,
      HomeNavigationMobile,
      BaseLightBox,
      BaseLightBoxPost,
      Invite,
    },
    data () {
      return {
        currentPage: DEFAULT_PAGE,
        endPage: false,
        isReachBottom: false,
        articlesListMainCategory: this.$route.path !== '/hot' ? '/' : '/hot',
      }
    },
    computed: {
      postsLatest () {
        return get(this.$store.state.publicPosts, 'items', [])
      },
      postsHot () {
        return get(this.$store.state.publicPostsHot, 'items', [])
      },
      postSingle () {
        return get(this.$store.state.publicPostSingle, 'items[0]', {})
      },
      postLightBox () {
        if (this.showLightBox) {
          const findPostInList = find(this.postsHome, [ 'id', Number(this.$route.params.postId), ])
          return findPostInList || this.postSingle
        } else {
          return {}
        }
      },
      showLightBox () {
        return this.isCurrentRoutePath('/post/:postId')
      },
      postsHome () {
        return this.articlesListMainCategory !== '/hot' ? this.postsLatest : this.postsHot
      },
      hasNavigation () {
        return this.projectsDone.length !== 0 || this.projectsInProgress.length !== 0
      },
      projectsDone () {
        return get(this.$store, [ 'state', 'publicProjects', 'done', ], [])
      },
      projectsInProgress () {
        return get(this.$store, [ 'state', 'publicProjects', 'inProgress', ], [])
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
      },
    },
    beforeRouteEnter (to, from, next) {
      const store = createStore()
      if ('postId' in to.params) {
        fetchPost(store, { id: to.params.postId, }).then(({ status, }) => {
          status === 'error' ? next('/404') : next()
        })
      } else {
        next()
      }
    },
    beforeMount () {
      if (this.$store.state.isLoggedIn) {
        const postIdsLatest = get(this.$store.state.publicPosts, 'items', []).map(post => `${post.id}`)
        const postIdsHot = get(this.$store.state.publicPostsHot, 'items', []).map(post => `${post.id}`)
        const postIdFeaturedProject = get(this.$store.state.projectsList, 'items', []).map(project => `${project.id}`)
        const ids = uniq(concat(postIdsLatest, postIdsHot))

        if (ids.length !== 0) {
          fetchFollowing(this.$store, {
            resource: 'post',
            ids: ids,
          })
        }

        if (postIdFeaturedProject.length !== 0) {
          fetchFollowing(this.$store, {
            resource: 'project',
            ids: postIdFeaturedProject,
          })
        }
      }
    },
    mounted () {
      window.addEventListener('scroll', () => {
        this.isReachBottom = isScrollBarReachBottom(1/3)
      })
    },
    methods: {
      closeLightBox () {
        this.$router.push(this.articlesListMainCategory)
      },
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
              const ids = res.items.map(post => `${post.id}`)
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