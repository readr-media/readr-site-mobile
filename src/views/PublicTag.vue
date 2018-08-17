<template>
  <div class="tag-relateds">
    <PostBoxWrapper :showPostBox.sync="showPostBox" :hadRouteBeenNavigate="hadRouteBeenNavigate">
      <Invite></Invite>
      <TagNav
        v-if="tagsForNav && tagsForNav.length > 0"
        :tags="tagsForNav"
        class="tag-relateds__tag-nav" />
      <HomeArticleMain v-for="post in posts" :key="post.id" :articleData="post" ></HomeArticleMain>
      <BaseLightBoxPost :showLightBox="showPostBox" :post="postBox" slot="postContent"></BaseLightBoxPost>
    </PostBoxWrapper>
  </div>
</template>
<script>
  import BaseLightBoxPost from 'src/components/BaseLightBoxPost.vue'
  import HomeArticleMain from 'src/components/home/HomeArticleMain.vue'
  import Invite from 'src/components/invitation/Invite.vue'
  import PostBoxWrapper from 'src/components/PostBoxWrapper.vue'
  import TagNav from 'src/components/tag/TagNav.vue'
  import moment from 'moment'
  import { concat, find, filter, flatten, get, map, sortBy, uniqWith, } from 'lodash'

  const fetchPostsByTags = (store, { keyword, }) => store.dispatch('GET_POSTS_BY_TAG', {
    params: {
      max_result: 200,
      tagged_resources: 1,
      stats: 1,
      keyword,
    },
  })
  const fetchFollowing = (store, params) => store.dispatch('GET_FOLLOWING_BY_RESOURCE', params)
  const fetchEmotion = (store, params) => store.dispatch('FETCH_EMOTION_BY_RESOURCE', params)

  export default {
    name: 'PublicTag',
    components: {
      BaseLightBoxPost,
      HomeArticleMain,
      Invite,
      PostBoxWrapper,
      TagNav,
    },
    computed: {
      posts () {
        const posts = flatten(concat(map(filter(get(this.$store, 'state.postsByTag.items', []), t => (t.taggedPosts && t.text === this.$route.params.tagName)), p => p.taggedPosts)))
        return sortBy(uniqWith(posts, (a, o) => a.id === o.id), [ p => -moment(p.publishedAt), ])
      },
      showPostBox () {
        return typeof(get(this.$route, 'params.subItem')) === 'string'
      },
      postBox () {
        if (this.showPostBox) {
          const findPostInList = find(this.posts, { 'id' : Number(this.$route.params.subItem), })
          return findPostInList
        } else {
          return {}
        }      
      },
      tagsForNav () {
        return filter(get(this.$store, 'state.postsByTag.items', []), t => t.text === this.$route.params.tagName)
      },
    },
    data () {
      return {
        hadRouteBeenNavigate: false,
      }
    },    
    methods: {},
    beforeMount () {
      fetchPostsByTags(this.$store, {
        keyword: this.$route.params.tagName,
      }).then(() => {
        const postsIds = map(this.posts, p => p.id)
        if (postsIds.length > 0) {
          fetchFollowing(this.$store, { resource: 'post', ids: postsIds, })
          fetchEmotion(this.$store, { resource: 'post', ids: postsIds, emotion: 'like', })
          fetchEmotion(this.$store, { resource: 'post', ids: postsIds, emotion: 'dislike', })
        }
      })
    },
    mounted () {},
    watch: {
      '$route' () {
        if (!this.hadRouteBeenNavigate) this.hadRouteBeenNavigate = true
      },
    },
  }
</script>
<style lang="stylus" scoped>
.tag-relateds
  padding-bottom 50px
  background-color #e6e6e6
  &__tag-nav
    margin-top 30px
    margin-bottom 10px
    padding 0 15px
    >>> .tag
      background-color #fff
</style>