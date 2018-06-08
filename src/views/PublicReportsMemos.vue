<template>
  <section class="reports-memos">
    <Invite></Invite>
    <main>
      <HomeNavigationMobile></HomeNavigationMobile>
      <div class="reports-memos__content">
        <template v-if="$route.path === '/reports'">
          <ReportBlock v-for="r in reports" :key="r.id" :report="r"></ReportBlock>
        </template>
        <template v-if="$route.path === '/memos'">
          <MemoFigure v-for="m in memos" :key="m.id" :memo="m"></MemoFigure>
        </template>
      </div>
    </main>
  </section>
</template>

<script>
import HomeNavigationMobile from 'src/components/home/HomeNavigationMobile.vue'
import Invite from 'src/components/invitation/Invite.vue'
import ReportBlock from 'src/components/ReportBlock.vue'
import MemoFigure from 'src/components/projects/MemoFigure.vue'
import { MEMO_PUBLISH_STATUS, REPORT_PUBLISH_STATUS, POINT_OBJECT_TYPE, } from 'api/config'
import { get, uniq, } from 'lodash'

const MAXRESULT = 50
const DEFAULT_SORT = '-published_at'

const fetchMemos = (store, {
  max_result = MAXRESULT,
  sort = DEFAULT_SORT,
} = {}) => {
  return store.dispatch('GET_PUBLIC_MEMOS', {
    params: {
      max_result: max_result,
      where: {
        publish_status: MEMO_PUBLISH_STATUS.PUBLISHED,
      },
      sort: sort,
    },
  })
}

const fetchReportsList = (store, {
  max_result = MAXRESULT,
  sort = DEFAULT_SORT,
} = {}) => {
  return store.dispatch('GET_PUBLIC_REPORTS', {
    params: {
      max_result: max_result,
      where: {
        publish_status: REPORT_PUBLISH_STATUS.PUBLISHED,
      },
      sort: sort,
    },
  })
}

const fetchPointHistories = (store, { objectIds, objectType, }) => {
  return store.dispatch('GET_POINT_HISTORIES', {
    params: {
      memberId: get(store, [ 'state', 'profile', 'id', ]),
      objectType: objectType,
      objectIds: objectIds,
    },
  })
}

export default {
  components: {
    Invite,
    HomeNavigationMobile,
    ReportBlock,
    MemoFigure,
  },
  watch: {
    '$route' () {
      this.fetchData()
    },
  },
  computed: {
    reports () {
      return get(this.$store, [ 'state', 'publicReports', ], [])
    },
    memos () {
      return get(this.$store.state, 'publicMemos', [])
    },
  },
  methods: {
    setRequests (path) {
      let requests = []
      switch (path) {
        case '/reports':
          requests.push(fetchReportsList(this.$store))
          break
        case '/memos':
          requests.push(fetchMemos(this.$store))
          break
        default:
          break
      }
      return requests
    },
    fetchData () {
      const requests = this.setRequests(this.$route.path)
      Promise.all(requests).then(() => {
        const projectIds = uniq(get(this.$store, 'state.publicMemos', []).map(memo => memo.projectId))
        if (projectIds.length !== 0) {
          fetchPointHistories(this.$store, { objectType: POINT_OBJECT_TYPE.PROJECT_MEMO, objectIds: projectIds, })
        }
      })
    },
  },
  beforeMount () {
    this.fetchData()
  },
}
</script>

<style lang="stylus" scoped>
.reports-memos
  background-color #e6e6e6
  padding 40px 0 34px 0
</style>


