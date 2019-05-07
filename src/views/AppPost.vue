<template>
  <section class="post">
    <figure v-if="postImage"></figure>
    <main class="app-content-area">
      <p class="small" v-text="dayjs(post.publishedAt).format('YYYY/MM/DD')"></p>
      <h1 v-text="post.title || post.ogTitle"></h1>
      <article v-html="postContentProcessed"></article>
    </main>
    <lazy-component class="post-bottom" @show="fetchSeries">
      <DonateWithShare :url="getPostFullUrl(post)" />
      <div class="app-content-area post__series">
        <h2>更多系列</h2>
        <SeriesListInPost :series="seriesFiltered" class="post__series-list" /> 
      </div>
    </lazy-component>
  </section>
</template>
<script>
import { SITE_FULL, } from 'src/constants' 
import { createPost, } from 'src/util/post'
import { getPostFullUrl, } from 'src/util/post/index'
import { mapState, } from 'vuex'

import DonateWithShare from 'src/components/DonateWithShare.vue'
import SeriesListInPost from 'src/components/Series/SeriesListInPost.vue'
import dayjs from 'dayjs'

export default {
  name: 'AppPost',
  components: {
    DonateWithShare,
    SeriesListInPost,
  },
  metaInfo () {
    const title = this.post.title
    const description = this.post.ogDescription || this.postProcessed.contentTruncateWithoutHtml
    const image = this.post.ogImage || this.post.heroImage || `${SITE_FULL}/public/og-image.jpg`
    return {
      title: title,
      meta: [
        { name: 'description', content: description, },
        { name: 'og:title', content: title, },
        { name: 'og:description', content: description, },
        { name: 'og:url', content: getPostFullUrl(this.post), },
        { name: 'og:image', content: image, },
      ],
    }
  },
  serverPrefetch () {
    return this.$store.dispatch('DataPost/GET_POST', { id: this.$route.params.postId, })
  },
  computed: {
    ...mapState({
      post: state => state.DataPost.post,
      series: state => state.DataSeries.series,
    }),
    postImage () {
      return this.post.heroImage || this.post.ogImage
    },
    postContentProcessed () {
      return this.postProcessed.contentProcessed.join('')
    },
    postProcessed () {
      return createPost(this.post)
    },
    seriesFiltered () {
      return this.series.slice(0, 3)
    },
  },
  methods: {
    dayjs,
    fetchSeries () {
      this.$store.dispatch('DataSeries/GET_SERIES', { maxResult: 4, })
    },
    getPostFullUrl,
  },
}
</script>
<style lang="stylus" scoped>
.post
  background-color #f1f1f1
  main
    padding 1em 0 5em
    > h1
      font-size 1.875rem
  article
    margin .5em 0 0
    >>> *
      & + *
        margin-top .5em
    >>> p
      font-size .875rem
      line-height 1.86
      text-align justify
    >>> h1
      font-size 1.875rem
    >>> h2
      font-size 1.25rem
    >>> img
      width 100%
    >>> iframe
      width 100%
    >>> .readme-embed
      > div
        display none
      
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
      >>> .list-item
        width calc((100% - 1em) / 3)
        figure
          background-color #979797
          border 1px solid #979797
        h1
          margin-top .2em
        
  .post-bottom
    margin 0
    padding 30px 0 60px
    background-color #fff

@media (min-width: 768px)
  .post
    article
      >>> img
        position relative
        top 0
        left -12.5%
        width 125%
    &__series-list
      >>> .list-item
        figure
          padding-top 56.25%
        
</style>
