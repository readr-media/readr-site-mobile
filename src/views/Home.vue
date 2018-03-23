<template>
  <div class="homepage">
    <main class="homepage__main">
      <HomeArticleMain v-for="post in postsLatest" :articleData="post" :key="post.id"/>
    </main>
  </div> 
</template>
<script>
  // import { SECTIONS_DEFAULT } from '../constants'
  import { removeToken } from '../util/services'
  import { isScrollBarReachBottom } from '../util/comm'
  import _ from 'lodash'
  // import AppHeader from '../components/AppHeader.vue'
  import AppAsideNav from '../components/AppAsideNav.vue'
  import AppTitledList from '../components/AppTitledList.vue'
  import HomeProjectAside from '../components/home/HomeProjectAside.vue'
  import HomeArticleMain from '../components/home/HomeArticleMain.vue'
  import HomeArticleAside from '../components/home/HomeArticleAside.vue'

  const fetchPosts = (store, { mode, category, max_result, page, sort }) => {
    return store.dispatch('GET_PUBLIC_POSTS', {
      params: {
        mode: mode,
        category: category,
        max_result: max_result,
        page: page,
        sort: sort
      }
    })
  }
  const fetchProjectsList = (store, { max_result }) => {
    return store.dispatch('GET_PROJECTS_LIST', {
      params: {
        max_result: max_result
      }
    })
  }
  const fetchFollowing = (store, params) => {
    if (params.subject) {
      return store.dispatch('GET_FOLLOWING_BY_USER', params)
    } else {
      return store.dispatch('GET_FOLLOWING_BY_RESOURCE', params)
    }
  }

  export default {
    components: {
      // 'app-header': AppHeader,
      AppAsideNav,
      AppTitledList,
      HomeProjectAside,
      HomeArticleMain,
      HomeArticleAside
    },
    watch: {
      isReachBottom(isReachBottom) {
        if (isReachBottom && !this.endPage) {
          this.loadmoreLatest()
        }
      }
    },
    data () {
      return {
        isReachBottom: false,
        currentPageLatest: 1,
        endPage: false
      } 
    },
    computed: {
      // sections () {
      //   return SECTIONS_DEFAULT
      // }
      postsLatest () {
        return this.$store.state.publicPosts.items
      },
      postsHot () {
        return this.$store.state.publicPostsHot.items
      }
    },
    name: 'Home',
    methods: {
      logout () {
        removeToken()
      },
      loadmoreLatest () {
        fetchPosts(this.$store, { mode: 'update', max_result: 10, page: this.currentPageLatest + 1 })
        .then((res) => {
          this.currentPageLatest += 1
          if (this.$store.state.isLoggedIn) {
            const ids = res.items.map(post => post.id)
            fetchFollowing(this.$store, {
              mode: 'update',
              resource: 'post',
              ids: ids
            })
          }
        })
        .catch((res) => {
          if (res === 'end') {
            this.endPage = true
          } else {
            console.log(res)
          }
        })
      },
      isScrollBarReachBottom
    },
    beforeMount () {
      // console.log('currentUser', currentUser())
      // console.log('isLoggedIn', isLoggedIn())
      Promise.all([
        fetchPosts(this.$store, {
          mode: 'set',
          category: 'latest',
          max_result: 10,
          page: this.currentPageLatest,
          sort: '-updated_at'
        }),
        fetchPosts(this.$store, {
          mode: 'set',
          category: 'hot',
          max_result: 5,
          page: 1,
          sort: '-updated_at'
        }),
        fetchProjectsList(this.$store, {
          max_result: 1
        })
      ]).then(() => {
        if (this.$store.state.isLoggedIn) {
          const postIdsLatest = this.$store.state.publicPosts.items.map(post => String(post.id))
          const postIdsHot = this.$store.state.publicPostsHot.items.map(post => String(post.id))
          const postIdFeaturedProject = this.$store.state.projectsList.items.map(project => String(project.id))
          const ids = _.uniq(_.concat(postIdsLatest, postIdsHot))
          fetchFollowing(this.$store, {
            resource: 'post',
            ids: ids
          })
          fetchFollowing(this.$store, {
            resource: 'project',
            ids: postIdFeaturedProject
          })
        }
      })
    },
    mounted () {
      window.addEventListener('scroll', () => {
        this.isReachBottom = this.isScrollBarReachBottom()
      })
    }
  }
</script>
<style lang="stylus" scoped>
  .homepage
    min-height 100vh
    &__main
      padding-top 40px
</style>