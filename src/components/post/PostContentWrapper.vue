<template>
  <div class="wrapper">
    <slot :postInstance="postInstance"></slot>
    <AppArticleNav
      :showFollow="false"
      :postId="post.id"
      :postRefId="get(post, 'project.id')"
      :resource="post.flag || get(postInstance, [ 'processed', 'resource' ])"
      :resourceType="resourceType"
      :slug="post.flag || get(postInstance, [ 'processed', 'resource' ]) === 'report'? post.slug : ''"
      :link="post.link"
      :tags="post.tags"
      :commentCount="commentCount"
      :commentsLatest="post.comments"
      :isNotLightbox="true"
      :shouldShowComment="true"
    >
      <PostShareNav slot="share" :post="post" class="wrapper__share" />
      <TagNav
        v-if="post.tags && post.tags.length > 0"
        slot="tagNav"
        :tags="post.tags"
        class="wrapper__tag-nav"
      />
    </AppArticleNav>
  </div>
</template>

<script>
import AppArticleNav from 'src/components/AppArticleNav.vue'
import TagNav from 'src/components/tag/TagNav.vue'
import PostShareNav from 'src/components/post/PostShareNav.vue'
import { get, } from 'lodash'
import { getPostFullUrl, } from 'src/util/post/index'
import { createPost, } from 'src/util/post'

export default {
  props: {
    post: {
      type: Object,
      required: true,
    },
  },
  components: {
    AppArticleNav,
    TagNav,
    PostShareNav,
  },
  computed: {
    postInstance () {
      return createPost(this.post)
    },
    resourceType () {
      return get(this.postInstance, [ 'processed', 'resourceType', ], '')
    },
    commentCount () {
      return get(this.postInstance, [ 'processed', 'commentCount', ], 0)
    },
    shareUrl () {
      return getPostFullUrl(this.post)
    },
  },
  methods: {
    get,
  },
}
</script>

<style lang="stylus" scoped>
.wrapper
  &__share
    margin 0 0 0 auto
  &__tag-nav
    margin-top 20px
    padding-top 10px
    border-top 1px solid #d3d3d3
</style>


