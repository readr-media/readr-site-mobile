<template>
  <div class="tag-relateds">
    <PostBoxWrapper :showPostBox.sync="showPostBox" :hadRouteBeenNavigate="hadRouteBeenNavigate">
      <Invite></Invite>
      <TagNav
        v-if="tagsForNav && tagsForNav.length > 0"
        :tags="tagsForNav"
        :shouldTagShowAction="true"
        class="tag-relateds__tag-nav"
      />
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
  import { find, get, isEqual, uniqWith, } from 'lodash'

  const fetchPostAndReportByTag = (store, {
    tagId,
    max_result = 5,
    page = 1,
    sort = '-published_at',
    datetime,
    nextLink,
  } = {}) => {
    const time = datetime ? datetime : new Date().toISOString()
    const sortClean = sort.replace('-', '')
    return store.dispatch('GET_POST_REPORT_BY_TAG', {
      tagId,
      params: {
        max_result,
        page,
        sort,
        filter: `pnr:${sortClean}<=${time}`,
      },
      nextLink,
    })
  }
  
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
    asyncData ({ store, route, }) {
      return fetchPostAndReportByTag(store, {
        tagId: get(route, 'params.tagId'),
      })
    },
    metaInfo () {
      return {
        description: this.$i18n ? this.$t('OG.DESCRIPTION') : '',
        ogTitle: this.$i18n ? get(this.tagsForNav, '0.text', this.$t('OG.TITLE')) : '',
        title: this.$i18n ? get(this.tagsForNav, '0.text', this.$t('OG.TITLE')) : '',
        metaUrl: this.$route.path,         
      }
    },    
    computed: {
      posts () {
        return uniqWith(this.$store.state.itemsByTag.items, isEqual)
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
        return get(this.$store, 'state.itemsByTag.items.0.tags', []).filter(tag => tag.id === Number(this.$route.params.tagId))
      },
    },
    data () {
      return {
        hadRouteBeenNavigate: false,
      }
    },    
    methods: {},
    beforeMount () {
      const postIds = this.posts.filter(post => !post.projectId).map(post => post.id)
      const reportIds = this.posts.filter(report => report.projectId).map(report => report.id)
      if (postIds.length > 0) {
        fetchFollowing(this.$store, { resource: 'post', ids: postIds, })
        fetchEmotion(this.$store, { resource: 'post', ids: postIds, emotion: 'like', })
        fetchEmotion(this.$store, { resource: 'post', ids: postIds, emotion: 'dislike', })
      }
      if (reportIds.length > 0) {
        fetchFollowing(this.$store, { resource: 'report', ids: reportIds, })
        fetchEmotion(this.$store, { resource: 'report', ids: reportIds, emotion: 'like', })
        fetchEmotion(this.$store, { resource: 'report', ids: reportIds, emotion: 'dislike', })
      }
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