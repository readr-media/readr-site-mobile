<template>
  <section class="hots">
    <HomeArticleMain v-for="post in posts" :key="post.id" :articleData="post" ></HomeArticleMain>
  </section>
</template>
<script>
  import { get, } from 'lodash'
  import { isScrollBarReachBottom, } from '../util/comm'
  import HomeArticleMain from '../components/home/HomeArticleMain.vue'
  
  const MAX_RESULT = 10
  const DEFAULT_PAGE = 1
  const DEFAULT_SORT = '-updated_at'

  const fetchPosts = (store, {
    max_result = MAX_RESULT,
    mode = 'set',
    page = DEFAULT_PAGE,
    sort = DEFAULT_SORT,
  } = {}) => {
    return store.dispatch('GET_PUBLIC_POSTS', {
      params: {
        mode: mode,
        category: 'hot',
        max_result: max_result,
        page: page,
        sort: sort,
      },
    })
  }

  export default {
    name: 'AppHots',
    asyncData ({ store, }) {
      return Promise.all([
        fetchPosts(store),
      ])
    },
    components: {
      HomeArticleMain,
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
        return get(this.$store, [ 'state', 'publicPostsHot', 'items', ], [])
      },
    },
    watch: {
      isReachBottom (val) {
        if (val && !this.endPage) {
          this.$_hots_loadmore()
        }
      },
    },
    mounted () {
      window.addEventListener('scroll', () => {
        this.isReachBottom = isScrollBarReachBottom(1/3)
      })
    },
    methods: {
      $_hots_loadmore () {
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
  .hots
    position relative
    min-height 100vh
    padding-top 65px
    background-color #e6e6e6

</style>