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
        v-if="post.author"
        :author="post.author"
        :postType="postType"
        :class="[ !isReview ? 'app-content-area' : '' ]"
        class="post__author"
      />
      <article
        class="app-content-area"
        v-html="postContentProcessed"
      />
      <PostReviewLink
        v-if="isReview"
        :description="post.linkDescription"
        :image="post.linkImage"
        :link="post.link"
        :sourceName="post.linkName"
        :title="post.linkTitle"
        class="post__review-link"
      />
    </main>
    <lazy-component
      class="post-bottom"
      @show="fetchSeries"
    >
      <DonateWithShare :url="getPostFullUrl(post)" />
      <div class="app-content-area post__series">
        <h2>更多系列</h2>
        <SeriesList
          :items="seriesFiltered"
          class="post__series-list more"
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
import PostReviewLink from 'src/components/post/PostReviewLink.vue'
import SeriesList from 'src/components/Series/SeriesList.vue'
import dayjs from 'dayjs'

export default {
  name: 'AppPost',
  components: {
    DonateWithShare,
    PostAuthor,
    PostReviewLink,
    SeriesList
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
  asyncData ({ store, route }) {
    return store.dispatch('DataPost/GET_POST', { id: route.params.postId, showAuthor: true })
  },
  computed: {
    ...mapState({
      post: state => state.DataPost.post,
      series: state => state.DataSeries.publicProjects.normal
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
    }
  },
  asyncData ({ store, route }) {
    return store.dispatch('DataPost/GET_POST', { id: route.params.postId })
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
    h1
      order 2
    article
      order 4
    .post__date
      order 1
    .post__author
      order 3
    .post__review-link
      order 9
  article
    margin .5em auto 0
    >>> *
      & + *
        margin-top .5em
    >>> p
      font-size .875rem
      line-height 1.86
      text-align justify
      & + p
        margin-top 1em
    >>> h1
      font-size 1.875rem
    >>> h2
      font-size 1.25rem
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
    font-size 1.875rem
    font-weight normal
    line-height 1.27
    & + *
      margin-top .5em
  h2
    & + div
      margin-top .5em
  p
    &.small
      color #4a4a4a
      font-size .75rem
    & + h1
      margin-top .5em
  &__series
    margin 2em auto 0
    &-list
      display flex
      flex-wrap wrap
      justify-content space-between
      &.more
        >>> .list-item
          width calc((100% - 1em) / 3)
          figure
            border 1px solid #979797
          h1
            margin-top .2em
          .description
            display none
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
    &__series-list
      &.more
        >>> .list-item
          figure
            padding-top 56.25%
    &__review-link
      width 60%
      max-width 800px
      margin 30px auto 0
    &.review
      main
        padding calc(50px + 2em) 0

</style>
