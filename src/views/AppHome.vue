<template>
  <section class="home">
    <!-- <div v-if="publicProjectsRecommends.length > 0">
      <h2>
        為您推薦
      </h2>
      <SeriesList
        :items="publicProjectsRecommends"
        class="home__list recommend"
      />
    </div> -->
    <div class="election-2020-iframe">
      <iframe
        width="100%"
        height="473"
        src="http://dev.readr.tw/project/election-2020-embed"
        frameborder="0"
      />
    </div>
    <div v-if="publicProjectsTrends.length > 0">
      <h2 class="decorated">
        最熱門專題
      </h2>
      <SeriesList
        :items="publicProjectsTrends"
        ga-event-label="popular"
        class="home__list highlight"
      />
    </div>
    <div>
      <h2 class="decorated">
        文章
      </h2>
      <PostsSlideshow
        :has-more="hasMorePosts"
        :posts="publicPosts"
        class="home__posts-slideshow"
        @toFinalChunk="loadMorePosts"
      />
    </div>
    <div>
      <h2 class="decorated">
        專題
      </h2>
      <SeriesList
        :item-style="'comm-narrow'"
        :items="publicProjectsNormal"
        ga-event-label="series"
        class="home__list"
      />
    </div>
  </section>
</template>

<script>
import { SITE_NAME } from '../constants'
import { get } from 'lodash'
import { mapMutations, mapState } from 'vuex'
import { isScrollBarReachBottom } from '../util/comm'

import PostsSlideshow from 'src/components/post/PostsSlideshow.vue'
import SeriesList from 'src/components/series/SeriesList.vue'

export default {
  components: {
    PostsSlideshow,
    SeriesList
  },
  metaInfo: {
    title: SITE_NAME,
    titleTemplate: null
  },
  data () {
    return {
      currentPostsPage: 1,
      currentSeriesPage: 1,
      hasMorePosts: true,
      hasMoreSeries: true,
      loading: false
    }
  },
  computed: {
    ...mapState({
      publicPosts: state => state.DataPost.posts,
      publicProjects: state => state.DataSeries.publicProjects
    }),
    // publicProjectsRecommends () {
    //   return this.publicProjects.normal.slice(0, 3)
    // },
    publicProjectsTrends () {
      return this.publicProjects.normal.slice(0, 1)
    },
    publicProjectsNormal () {
      return this.publicProjects.normal
    }
  },
  asyncData ({ store }) {
    return Promise.all([
      store.dispatch('DataSeries/FETCH'),
      store.dispatch('DataPost/GET_POSTS', { projectId: 0 })
    ])
      .catch(err => {
        const error = { code: err.status }
        throw error
      })
  },
  beforeMount () {
    if (this.$route.name === 'donate') {
      this.SET_CURRENT_SIDEBAR_SLOT('donate')
      this.SET_SHOW_SIDEBAR(true)
    }
  },
  mounted () {
    window.addEventListener('scroll', this.loadMoreSeries)
  },
  beforeDestroy () {
    window.removeEventListener('scroll', this.loadMoreSeries)
  },
  methods: {
    ...mapMutations({
      SET_SHOW_SIDEBAR: 'UIAppHeader/SET_SHOW_SIDEBAR',
      SET_CURRENT_SIDEBAR_SLOT: 'UIAppHeader/SET_CURRENT_SIDEBAR_SLOT'
    }),
    loadMorePosts () {
      if (this.hasMorePosts && !this.loading) {
        this.loading = true
        this.$store.dispatch('DataPost/GET_POSTS', { projectId: 0, page: this.currentPostsPage + 1 })
          .then(res => {
            if (res.length === 0) {
              this.hasMorePosts = false
            }
            this.currentPostsPage += 1
            this.loading = false
          })
      }
    },
    loadMoreSeries () {
      if (this.hasMoreSeries && !this.loading && isScrollBarReachBottom(1 / 3)) {
        const origCount = get(this.publicProjectsNormal, [ 'length' ], 0)
        this.loading = true
        this.$store.dispatch('DataSeries/FETCH', { page: this.currentSeriesPage + 1 })
          .then(() => {
            this.currentSeriesPage += 1
            this.hasMoreSeries = !(get(this.publicProjectsNormal, [ 'length' ], 0) <= origCount)
            this.loading = false
          })
      }
    }
  }
}
</script>

<style lang="stylus" scoped>
.home
  width 90%
  margin 0 auto
  padding 60px 0
  > div
    & + div
      margin 15px 0 0
  &__list
    position relative
    left -5px
    display flex
    flex-wrap wrap
    width calc(100% + 10px)
    margin-top .5em
    >>> .list-item
      width calc((100% - 30px) / 3)
      margin 0 5px
      .description
        display none
    &.highlight
      >>> .list-item
        width 100%
        figure
          padding-top 56.25%
  &__posts-slideshow
     >>> .list-item
      display block
      padding 0 0 .5em 0
      border-bottom 1px solid #979797
      figure, .description
        display none
      .title
        display -webkit-box
        -webkit-line-clamp 2
        -webkit-box-orient vertical
        height calc(1em * 1.3 * 2)

@media (max-width: 767px)
  .home
    &__list
      >>> .list-item.comm-narrow
        padding 0
        margin-top 1em
        background-color transparent
        &:nth-child(1), &:nth-child(2), &:nth-child(3)
          margin-top 0
        figure
          padding-top 100%
        h1, h2, p
          width 100%

@media (min-width: 768px)
  .home
    width 80%
    max-width 1040px
    padding 100px 0
    > div
      & + div
        margin 35px 0 0
    h2
      text-align center
      &.decorated
        display flex
        justify-content center
        align-items center
        padding 0 20px
        &:before
          content ''
          display block
          flex 1 1 auto
          height 1px
          background-color #979797
          margin 0 25px 0 0
        &:after
          content ''
          display block
          flex 1 1 auto
          height 1px
          background-color #979797
          margin 0 0 0 25px
    &__list
      left auto
      width 100%
      margin-top 1em
      >>> .list-item
        figure
          padding-top 56.25%
        .description
          display block
      >>> .list-item.comm-narrow
        width calc((100% - 120px) / 3)
        margin 30px 20px 0
        &:nth-child(1), &:nth-child(2), &:nth-child(3)
          margin-top 0
      &.recommend
        >>> .list-item
          width calc((100% - 120px) / 3)
          margin 0 20px
      &.highlight
        justify-content center
        >>> .list-item
          width 80%
          max-width 900px
          margin 0
          background-color transparent
          h1, p
            text-align center
    &__posts-slideshow
      width calc(100% - 40px)
      margin 0 auto

@media (min-width: 1024px)
  .home
    > div
      & + div
        margin 70px 0 0
    &__list
      >>> .list-item.comm-narrow
        width calc((100% - 180px) / 4)
        margin-top 60px
        &:nth-child(1), &:nth-child(2), &:nth-child(3), &:nth-child(4)
          margin-top 14px
</style>
