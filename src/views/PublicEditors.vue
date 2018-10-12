<template>
  <div class="editors main">
    <Invite></Invite>
    <main>
      <AppTitledList :listTitle="$t('editors.WORDING_EDITORS_CURRENT_GUESTEDITOR')">
        <ul class="editors-list-container">
          <EditorsIntro class="editors-intro-main" v-for="customEditor in customEditors" :key="customEditor.id" :editor="customEditor"/>
        </ul>
      </AppTitledList>
      <ul class="editors__list-aside">
        <EditorsIntro class="editors-intro-aside" v-for="member in asideListMembers" :key="member.id" :editor="member" :trimDescription="true"/>
      </ul>
    </main>
  </div>
</template>

<script>
import { ROLE_MAP, } from '../constants'
import AppTitledList from '../components/AppTitledList.vue'
import EditorsIntro from '../components/editors/EditorsIntro.vue'
import Invite from '../components/invitation/Invite.vue'
import { isScrollBarReachBottom, } from 'src/util/comm'
import { find, get, } from 'lodash'

// const debug = require('debug')('CLIENT:Editors')

const DEFAULT_MAX_RESULT_INIT = 20
const DEFAULT_PAGE_INIT = 1
const DEFAULT_MAX_RESULT_LOADMORE = 10
const DEFAULT_PAGE_LOADMORE = 3

const getMembersPublic = (store, params) => {
  return store.dispatch('GET_PUBLIC_MEMBERS', {
    params: params,
  })
}

export default {
  name: 'Editors',
  asyncData ({ store, i18n, }) {
    const roleNum = find(ROLE_MAP, { value: i18n.t('editors.WORDING_EDITORS_GUESTEDITOR'), }).key
    return Promise.all([
      getMembersPublic(store, {
        role: roleNum,
        max_result: DEFAULT_MAX_RESULT_INIT,
        page: DEFAULT_PAGE_INIT,
      }),
      getMembersPublic(store, {
        custom_editor: true,
      }),
    ])
  },
  metaInfo () {
    return {
      description: this.$i18n ? this.$t('OG.DESCRIPTION') : 'Readr',
      ogTitle: this.$i18n ? this.$t('OG.GUESTEDITORS') : 'Readr',
      title: this.$i18n ? this.$t('OG.GUESTEDITORS') : 'Readr',
      metaUrl: this.$route.path,
    }
  },  
  components: {
    AppTitledList,
    EditorsIntro,
    Invite,
  },
  watch: {
    isReachBottom () {
      if (this.isReachBottom && this.shouldLoadmore) {
        this.loadmoreEditors()
      }
    },
  },
  data () {
    return {
      asideListRoleValue: this.$t('editors.WORDING_EDITORS_GUESTEDITOR'),
      isReachBottom: false,
      currentPage: DEFAULT_PAGE_LOADMORE,
      shouldLoadmore: true,
    }
  },
  computed: {
    customEditors () {
      return get(this.$store, 'state.customEditors.items', [])
    },
    asideListMembers () {
      return get(this.$store, `state.publicMembers[${this.asideListRoleValue}].items`, [])
    },
  },
  methods: {
    scrollHandler () {
      this.isReachBottom = isScrollBarReachBottom()
    },
    loadmoreEditors () {
      const roleNum = find(ROLE_MAP, { value: this.$t('editors.WORDING_EDITORS_GUESTEDITOR'), }).key
      getMembersPublic(this.$store, {
        role: roleNum,
        max_result: DEFAULT_MAX_RESULT_LOADMORE,
        page: this.currentPage,
      })
      .then(({ body, }) => {
        this.shouldLoadmore = body.items.length >= DEFAULT_MAX_RESULT_LOADMORE
        if (this.shouldLoadmore) { this.currentPage += 1 }
      })
      .catch(error => {
        console.log(error)
        this.shouldLoadmore = false
      })
    },
  },
  mounted () {
    window.addEventListener('scroll', this.scrollHandler)
  },
  destroyed () {
    window.removeEventListener('scroll', this.scrollHandler)
  },
}
</script>

<style lang="stylus" scoped>
.editors
  background-color #fff
  main
    display flex
    flex-direction column
    justify-content flex-start
    padding-top 30px
  &__list-aside
    background-color white
    list-style none
    padding 16px 0
    margin 0

.editors-list-container
  margin 10px 0 0
  padding 0
  border-bottom 1px solid #d3d3d3
.editors-intro-main
  width 100%
  margin 0
.editors-intro-aside
  width 100%
  margin 0 0 10px 0
  padding 0 20px
  &:nth-child(1)
    padding-top 0
</style>


