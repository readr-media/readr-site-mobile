<template>
  <section class="series">
    <main>
      <figure
        v-if="singleSeries.heroImage || singleSeries.ogImage"
        class="series__image app-content-area"
      >
        <img
          :src="singleSeries.heroImage || singleSeries.ogImage"
          :alt="singleSeries.title || singleSeries.ogTitle"
        >
      </figure>
      <h1
        class="app-content-area"
        v-text="singleSeries.title || singleSeries.ogTitle"
      />
      <p
        class="app-content-area"
        v-text="singleSeries.description || singleSeries.ogDescription"
      />
    </main>
    <lazy-component
      class="series-bottom"
      @show="fetchSeries"
    >
      <div class="app-content-area series__more-series">
        <h2>更多系列</h2>
        <SeriesList
          :item-style="'comm-series-more'"
          :items="seriesFilterSelf"
          class="series__more-series-list"
        />
      </div>
    </lazy-component>
  </section>
</template>
<script>
import { SITE_FULL } from 'src/constants'
import { getFullUrl } from 'src/util/comm'
import { mapState } from 'vuex'

import SeriesList from 'src/components/series/SeriesList.vue'

export default {
  name: 'AppSeries',
  components: {
    SeriesList
  },
  metaInfo () {
    const title = this.singleSeries.ogTitle || this.singleSeries.title
    const description = this.singleSeries.ogDescription || this.singleSeries.description
    const image = this.singleSeries.ogImage || this.singleSeries.heroImage || `${SITE_FULL}/public/og-image.jpg`
    return {
      title: title,
      meta: [
        { name: 'description', content: description },
        { name: 'og:title', content: title },
        { name: 'og:description', content: description },
        { name: 'og:url', content: getFullUrl(this.$route.path) },
        { name: 'og:image', content: image }
      ]
    }
  },
  computed: {
    ...mapState({
      series: state => state.DataSeries.publicProjects.normal,
      singleSeries: state => state.DataSeries.singleSeries
    }),
    seriesFilterSelf () {
      return this.series.filter(series => series.slug !== this.$route.params.slug).slice(0, 3)
    }
  },
  asyncData ({ store, route }) {
    return store.dispatch('DataSeries/FETCH_SINGLE_SERIES', { slug: route.params.slug })
  },
  methods: {
    fetchSeries () {
      this.$store.dispatch('DataSeries/FETCH', { maxResult: 4 })
    }
  }
}
</script>
<style lang="stylus" scoped>
.series
  padding-top 40px
  main
    padding-bottom 20px
    border-bottom 1px solid #979797
  h1
    & + *
      margin-top 1.5rem
    & + p
      margin-top 17px
  h2
    & + div
      margin-top 1.5rem
  p
    line-height 1.86
  figure
    & + *
      margin-top 1.5rem
  &__image
    position relative
    padding-top calc(90% * 0.5625)
    img
      position absolute
      top 0
      left 0
      right 0
      bottom 0
      width 100%
      height 100%
      object-fit cover
      object-position center center
  &__more-series
    padding 2em 0
    &-list
      display flex
      justify-content space-between
      >>> .list-item
        width calc((100% - 1em) / 3)
        figure
          border 1px solid #979797
        h1
          margin-top .2em
        .description
          display none

@media (min-width: 768px)
  .series
    padding-top 50px
    &__image
      padding-top calc(60% * 0.5625)

</style>
