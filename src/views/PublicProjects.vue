<template>
  <section class="projects main">
    <Invite></Invite>
    <template v-for="p in projects" >
      <ProjectBlock :key="p.id" :project="p"></ProjectBlock>
    </template>
  </section>
</template>

<script>
import { PROJECT_STATUS, } from '../../api/config'
import { get, } from 'lodash'
import { isScrollBarReachBottom, } from '../util/comm'
import Invite from '../components/invitation/Invite.vue'
import ProjectBlock from '../components/ProjectBlock.vue'

const MAX_RESULT = 8
const DEFAULT_PAGE = 1
const DEFAULT_SORT = '-updated_at'

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
        status: PROJECT_STATUS.DONE,
      },
    },
  })
}

export default {
  name: 'ProjectsList',
  asyncData ({ store, }) {
    return fetchProjectsList(store)
  },
  components: {
    ProjectBlock,
    Invite,
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
      return get(this.$store, [ 'state', 'publicProjects', 'done', ], [])
    },
  },
  mounted () {
    window.addEventListener('scroll', this.$_projects_loadmoreHandler)
  },
  methods: {
    $_projects_loadmoreHandler () {
      if (this.hasMore && !this.loading && isScrollBarReachBottom(1/3)) {
        const origCount = get(this.projects, [ 'length', ], 0)
        this.loading = true
        fetchProjectsList(this.$store, { page: this.currentPage + 1, })
        .then(() => {
          this.currentPage += 1
          get(this.projects, [ 'length', ], 0) <= origCount ? this.hasMore = false : ''
          this.loading = false
        })
      }
    },
  },
}
</script>

<style lang="stylus" scoped>
</style>

