<template>
  <section class="projects-list">
    <template v-for="p in projects" >
      <ProjectBlock :key="p.id" :project="p"></ProjectBlock>
    </template>
  </section>
</template>

<script>
import { PROJECT_STATUS, } from '../../api/config'
import { get, } from 'lodash'
import ProjectBlock from '../components/ProjectBlock.vue'

const MAX_RESULT = 10
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
  },
  computed: {
    projects () {
      return get(this.$store, [ 'state', 'publicProjects', 'done', ], [])
    },
  },
}
</script>

<style lang="stylus" scoped>
  .projects-list
    position relative
    min-height 100vh
    padding-top 65px
    background-color #e6e6e6
</style>

