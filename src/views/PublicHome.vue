<template>
  <section class="home">
    <HomeNavigationMobile :projectsDone="projectsDone" :projectsInProgress="projectsInProgress" :video="video"></HomeNavigationMobile>
    <HomeArticleMain v-for="post in posts" :key="post.id" :articleData="post" ></HomeArticleMain>
  </section>
</template>
<script>
  import { PROJECT_STATUS, } from '../../api/config'
  import { get, } from 'lodash'
  import { isScrollBarReachBottom, } from '../util/comm'
  import HomeArticleMain from '../components/home/HomeArticleMain.vue'
  import HomeNavigationMobile from '../components/home/HomeNavigationMobile.vue'
  
  const MAXRESULT_POSTS = 10
  const MAXRESULT_PROJECTS = 2
  const MAXRESULT_VIDEOS = 1
  const DEFAULT_PAGE = 1
  const DEFAULT_SORT = '-updated_at'

  // const fetchFollowing = (store, params) => {
  //   if (params.subject) {
  //     return store.dispatch('GET_FOLLOWING_BY_USER', params)
  //   } else {
  //     return store.dispatch('GET_FOLLOWING_BY_RESOURCE', params)
  //   }
  // }

  const fetchPosts = (store, {
    max_result = MAXRESULT_POSTS,
    mode = 'set',
    page = DEFAULT_PAGE,
    sort = DEFAULT_SORT,
  } = {}) => {
    return store.dispatch('GET_PUBLIC_POSTS', {
      params: {
        mode: mode,
        category: 'latest',
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
    asyncData ({ store, }) {
      return Promise.all([
        fetchPosts(store),
        fetchProjectsList(store, { max_result: 5, status: PROJECT_STATUS.WIP, }),
        fetchProjectsList(store, { max_result: 2, status: PROJECT_STATUS.DONE, }),
        fetchVideos(store),
      ])
    },
    components: {
      HomeArticleMain,
      HomeNavigationMobile,
    },
    data () {
      return {
        currentPage: DEFAULT_PAGE,
        endPage: false,
        isReachBottom: false,
      }
    },
    computed: {
      posts () {
        return get(this.$store, [ 'state', 'publicPosts', 'items', ], [])
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
    },
    mounted () {
      // if (this.$store.state.isLoggedIn) {
      //   const postIdsLatest = this.$store.state.publicPosts.items.map(post => String(post.id))
      //   fetchFollowing(this.$store, {
      //     resource: 'post',
      //     ids: postIdsLatest,
      //   })
      // }
      window.addEventListener('scroll', () => {
        this.isReachBottom = isScrollBarReachBottom(1/3)
      })
    },
    methods: {
      $_home_loadmore () {
        fetchPosts(this.$store, { mode: 'update', max_result: 10, page: this.currentPage + 1, })
        .then(() => {
          this.currentPage += 1
          // if (this.$store.state.isLoggedIn) {
          //   const ids = res.items.map(post => post.id)
          //   fetchFollowing(this.$store, {
          //     mode: 'update',
          //     resource: 'post',
          //     ids: ids,
          //   })
          // }
        })
        .catch((res) => {
          if (res === 'end') {
            this.endPage = true
          } else {
            console.log(res)
          }
        })
      },
    },
  }
</script>
<style lang="stylus" scoped>
  .home
    position relative
    min-height 100vh
    padding-top 65px
    background-color #e6e6e6

  @media (min-width 768px)
    .home
      padding 80px 20px 0 80px

</style>