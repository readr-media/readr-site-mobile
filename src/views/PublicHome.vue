<template>
  <section class="section">
    <div
      v-if="publicProjectsRecommends.length > 0"
      class="section__block block"
    >
      <h1 class="block__title">
        為您推薦
      </h1>
      <SeriesList
        :items="publicProjectsRecommends"
      />
    </div>
    <div
      v-if="publicProjectsTrends.length > 0"
      class="section__block block"
    >
      <h1 class="block__title">
        最熱門系列
      </h1>
      <SeriesListFull
        :items="publicProjectsTrends"
      />
    </div>
    <div class="section__block block">
      <h1 class="block__title">
        系列報導 
      </h1>
      <SeriesList
        :items="publicProjectsNormal"
      />
    </div>
  </section>
</template>

<script>
import { get, } from 'lodash'
import { mapState, } from 'vuex'
import { PROJECT_STATUS, PROJECT_PUBLISH_STATUS, } from '../../api/config'
import { isScrollBarReachBottom, } from '../util/comm'

import SeriesList from 'src/components/SeriesList/List.vue'
import SeriesListFull from 'src/components/SeriesListFull/List.vue'

const DEFAULT_PAGE = 1
const DEFAULT_SORT = 'project_order,-updated_at'
const MAX_RESULT = 12

const fetchProjectsList = (store, {
  max_result = MAX_RESULT,
  page = DEFAULT_PAGE,
  sort = DEFAULT_SORT,
} = {}) => {
  return store.dispatch('GET_PUBLIC_PROJECTS', {
    params: {
      max_result: max_result,
      page: page,
      sort: sort,
      where: {
        status: [ PROJECT_STATUS.DONE, PROJECT_STATUS.WIP, ],
        publish_status: PROJECT_PUBLISH_STATUS.PUBLISHED,
      },
    },
  })
}

export default {
  components: {
    SeriesList,
    SeriesListFull,
  },
  asyncData ({ store, }) {
    return fetchProjectsList(store)
  },
  data () {
    return {
      currentPage: DEFAULT_PAGE,
      hasMore: true,
      loading: false,
    }
  },
  computed: {
    ...mapState({
      publicProjects: state => state.publicProjects,
    }),
    publicProjectsRecommends () {
      return this.publicProjects.recommends
    },
    publicProjectsTrends () {
      return this.publicProjects.trends
    },
    publicProjectsNormal () {
      return this.publicProjects.normal
    },
  },
  mounted () {
    window.addEventListener('scroll', this.loadMore)
  },
  beforeDestroy () {
    window.removeEventListener('scroll', this.loadMore)
  },
  methods: {
    loadMore () {
      if (this.hasMore && !this.loading && isScrollBarReachBottom(1/3)) {
        const origCount = get(this.projects, [ 'length', ], 0)
        this.loading = true
        fetchProjectsList(this.$store, { page: this.currentPage + 1, })
        .then(() => {
          this.currentPage += 1
          get(this.projects, [ 'length', ], 0) <= origCount ? this.hasMore = false : true
          this.loading = false
        })
      }
    },
  },
}
</script>

<style lang="stylus" scoped>
.section
  padding 60px 15px

.block
  & + &
    margin 16px 0 0 0
  &__title
    font-size 16px
    font-weight 500
    margin 0 0 10px 0
</style>
