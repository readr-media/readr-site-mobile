<template>
  <section class="projects main">
    <h1 v-text="$t('SECTIONS.SERIES_LIST')"></h1>
    <ProjectsFigure v-for="project in projects" :key="project.id" class="project" :project="project" ></ProjectsFigure>
  </section>
</template>

<script>
import { PROJECT_STATUS, PROJECT_PUBLISH_STATUS, } from '../../api/config'
import { get, } from 'lodash'
import { isScrollBarReachBottom, } from '../util/comm'
import ProjectsFigure from '../components/projects/ProjectsFigure.vue'


const DEFAULT_PAGE = 1
const DEFAULT_SORT = 'project_order,-updated_at'
const MAX_RESULT = 3

const fetchFollowing = (store, params) => {
  return store.dispatch('GET_FOLLOWING_BY_RESOURCE', {
    mode: params.mode,
    ids: params.ids,
    resource: 'project',
  })
}

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
  name: 'PublicProjects',
  // asyncData ({ store, }) {
  //   return fetchProjectsList(store)
  // },
  components: {
    ProjectsFigure,
  },
  data () {
    return {
      currentPage: DEFAULT_PAGE,
      hasMore: true,
      loading: false,
    }
  },
  computed: {
    projects () {
      return get(this.$store, 'state.publicProjects.normal', []) || []
    },
  },
  beforeMount () {
    // Beta version code
    fetchProjectsList(this.$store)
    .then(() => {
      if (this.$store.state.isLoggedIn) {
        const projectIds = get(this.$store, 'state.publicProjects.normal', []).map(project => `${project.id}`)
        fetchFollowing(this.$store, { ids: projectIds, })
      }
    })
  },  
  mounted () {
    window.addEventListener('scroll', this.$_projects_loadmoreHandler)
  },
  beforeDestroy () {
    window.removeEventListener('scroll', this.$_projects_loadmoreHandler)
  },
  methods: {
    $_projects_loadmoreHandler () {
      if (this.hasMore && !this.loading && isScrollBarReachBottom(1/3)) {
        const origCount = get(this.projects, [ 'length', ], 0)
        this.loading = true
        fetchProjectsList(this.$store, { page: this.currentPage + 1, })
        .then((res) => {
          this.currentPage += 1
          get(this.projects, [ 'length', ], 0) <= origCount ? this.hasMore = false : true
          this.loading = false
          if (this.hasMore && this.$store.state.isLoggedIn) {
            const projectIds = res.map(project => `${project.id}`)
            fetchFollowing(this.$store, {
              mode: 'update',
              ids: projectIds,
            })
          }
        })
      }
    },
  },
}
</script>

<style lang="stylus" scoped>
.projects
  padding 40px 20px 20px
  h1
    margin 20px 0 0
    font-size 1.125rem
  .project
    margin-top 10px
    & + .project
      margin-top 20px
</style>

