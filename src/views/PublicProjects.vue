<template>
  <section class="projects main">
    <Invite></Invite>
    <template v-for="p in projects" >
      <ProjectBlock :key="p.id" :project="p"></ProjectBlock>
    </template>
  </section>
</template>

<script>
import { PROJECT_STATUS, PROJECT_PUBLISH_STATUS, } from '../../api/config'
import { get, } from 'lodash'
import { isScrollBarReachBottom, } from '../util/comm'
import Invite from '../components/invitation/Invite.vue'
import ProjectBlock from '../components/ProjectBlock.vue'

const MAX_RESULT = 8
const DEFAULT_PAGE = 1
const DEFAULT_SORT = 'project_order,-updated_at'

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
        publish_status: PROJECT_PUBLISH_STATUS.PUBLISHED,
      },
    },
  })
}

const fetchFollowing = (store, params) => {
  if (params.subject) {
    return store.dispatch('GET_FOLLOWING_BY_USER', {
      subject: params.subject,
      resource: 'project',
    })
  } else {
    return store.dispatch('GET_FOLLOWING_BY_RESOURCE', {
      resource: 'project',
      ids: params.ids,
    })
  }
}

export default {
  name: 'PublicProjects',
  // asyncData ({ store, }) {
  //   return fetchProjectsList(store)
  // },
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
  beforeMount () {
    // Beta version code
    fetchProjectsList(this.$store, {})
    .then(() => {
      if (this.$store.state.isLoggedIn) {
        const projectIds = get(this.$store, 'state.publicProjects.done', []).map(project => `${project.id}`)
        fetchFollowing(this.$store, {
          ids: projectIds,
        })
      }
    })
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
</style>

