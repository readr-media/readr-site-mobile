<template>
  <section :class="[ postType, 'post' ]">
    <figure v-if="postImage" />
    <main>
      <p
        v-if="post.publishedAt"
        class="post__date small app-content-area"
        v-text="dayjs(post.publishedAt).format('YYYY/MM/DD')"
      />
      <h1
        class="app-content-area"
        v-text="post.title || post.ogTitle"
      />
      <PostAuthor
        v-if="post.author && post.author.nickname"
        :author="post.author"
        :post-type="postType"
        :class="[ !isReview ? 'app-content-area' : '' ]"
        class="post__author"
      />
      <article
        class="app-content-area"
        v-html="postContentProcessed"
      />
      <TagsInPost
        v-if="post.tags && post.tags.length > 0"
        :tags="post.tags"
        class="post__tags app-content-area"
      />
      <PostReviewLink
        v-if="isReview"
        :description="post.linkDescription"
        :image="post.linkImage"
        :link="post.link"
        :source-name="post.linkName"
        :title="post.linkTitle"
        class="post__review-link"
      />
    </main>
    <lazy-component
      class="post-bottom"
      @show="fetchSeries"
    >
      <DonateWithShare :url="getPostFullUrl(post)" />
      <div class="app-content-area post__related">
        <h2>系列內容</h2>
        <PostList
          :items="seriesPostsFiltered"
          class="post__post-list"
        />
        <h2>更多系列</h2>
        <SeriesList
          :item-style="'comm-series-more'"
          :items="seriesFiltered"
          class="post__series-list"
        />
      </div>
    </lazy-component>
  </section>
</template>
<script>
import { SITE_FULL } from 'src/constants'
import { createPost } from 'src/util/post'
import { getPostFullUrl } from 'src/util/post/index'
import { mapState } from 'vuex'

import DonateWithShare from 'src/components/DonateWithShare.vue'
import PostAuthor from 'src/components/post/PostAuthor.vue'
import PostList from 'src/components/post/PostList.vue'
import PostReviewLink from 'src/components/post/PostReviewLink.vue'
import SeriesList from 'src/components/series/SeriesList.vue'
import TagsInPost from 'src/components/tag/TagsInPost.vue'
import dayjs from 'dayjs'

export default {
  name: 'AppPost',
  components: {
    DonateWithShare,
    PostAuthor,
    PostList,
    PostReviewLink,
    SeriesList,
    TagsInPost
  },
  metaInfo () {
    const title = this.post.title
    const description = this.post.ogDescription || this.postProcessed.contentTruncateWithoutHtml
    const image = this.post.ogImage || this.post.heroImage || `${SITE_FULL}/public/og-image.jpg`
    return {
      title: title,
      meta: [
        { name: 'description', content: description },
        { name: 'og:title', content: title },
        { name: 'og:description', content: description },
        { name: 'og:url', content: getPostFullUrl(this.post) },
        { name: 'og:image', content: image }
      ]
    }
  },
  computed: {
    ...mapState({
      post: state => state.DataPost.post,
      series: state => state.DataSeries.publicProjects.normal,
      seriesPosts: state => state.DataSeriesContents.publicProjectContents
    }),
    isReview () {
      return this.postType === 'review'
    },
    postContentProcessed () {
      return this.postProcessed.contentProcessed.join('')
    },
    postImage () {
      return this.post.heroImage || this.post.ogImage
    },
    postProcessed () {
      return createPost(this.post)
    },
    postType () {
      return this.postProcessed.typeProcessed
    },
    seriesFiltered () {
      return this.series.slice(0, 3)
    },
    seriesPostsFiltered () {
      return this.seriesPosts.filter(post => post.id !== Number(this.$route.params.postId)).slice(0, 3)
    }
  },
  asyncData ({ store, route }) {
    return store.dispatch('DataPost/GET_POST', { id: route.params.postId, showAuthor: true, showTag: true })
  },
  methods: {
    dayjs,
    fetchSeries () {
      this.$store.dispatch('DataSeries/FETCH', { maxResult: 4 })
    },
    getPostFullUrl
  }
}
</script>
<style lang="stylus" scoped>
.post
  background-color #f1f1f1
  main
    display flex
    flex-direction column
    padding calc(50px + 1em) 0 5em
    overflow hidden
    > *
      order 10
    h1
      order 2
      word-break break-word
    article
      order 4
    .post__date
      order 1
    .post__author
      order 3
    .post__review-link
      order 9
  article
    margin 1.5rem auto 0
    >>> *
      & + *
        margin-top 1.5rem
      & + p
        margin-top 17px
    >>> h1, >>> h2, >>> h3
      font-weight normal
    >>> p
      line-height 1.86
      text-align justify
      & + *
        margin-top 17px
    >>> a
      border-bottom 2px solid #11b8c9
    >>> img
      width 100%
    >>> iframe
      width 100%
    >>> .readme-embed
      > div
        display none
  h1
    font-weight normal
    line-height 1.27
    & + *
      margin-top 1.5rem
  h2
    & + div
      margin-top 1.5em
  p
    &.small
      color #4a4a4a
    & + h1
      margin-top 17px
  &__related
    margin 2em auto 0
    h2, div
      & + h2, & + div
        margin-top .5em
  &__post-list
    display flex
    flex-direction column
    >>> .list-item
      width 100%
      padding-bottom .5em
      border-bottom 1px solid #979797
      &:last-child
        border-bottom none
      & + .list-item
        margin-top .5em
      figure, .date, .description
        display none
      figure
        & + p
          margin-top 0
  &__series-list
    display flex
    flex-wrap wrap
    justify-content space-between
    >>> .list-item
      width calc((100% - 1em) / 3)
      figure
        border 1px solid #979797
      h1
        margin-top .2em
      .description
        display none
  &__tags
    display flex
    margin-top 30px
  &__review-link
    margin-top 30px
  .post-bottom
    margin 0
    padding 30px 0 60px
    background-color #fff

  &.review
    main
      padding calc(50px + 2em) 0 0
    .post__author
      order 0
      margin 0
    .post__date
      margin-top .5em
@media (min-width: 768px)
  .post
    article
      >>> img
        position relative
        top 0
        left -12.5%
        width 125%
    &__post-list
      >>> .list-item
        display flex
        border-bottom none
        figure
          display block
          width 33%
          padding-top calc(33% * 0.5625)
        .list-item__content
          flex 1
          margin 0 0 0 15px
          border-bottom 1px solid #979797
    &__review-link
      width 60%
      max-width 800px
      margin 30px auto 0
    &.review
      main
        padding calc(50px + 2em) 0

</style>
