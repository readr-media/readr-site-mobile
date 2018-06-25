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
import { concat, find, get, uniq, } from 'lodash'

// const debug = require('debug')('CLIENT:Editors')
const getMembersPublic = (store, params) => {
  return store.dispatch('GET_PUBLIC_MEMBERS', {
    params: params,
  })
}
const fetchFollowing = (store, { ids, }) => {
  return store.dispatch('GET_FOLLOWING_BY_RESOURCE', {
    resource: 'member',
    ids: ids,
  })
}

export default {
  name: 'Editors',
  asyncData ({ store, i18n, }) {
    const targ_key = find(ROLE_MAP, { value: i18n.t('editors.WORDING_EDITORS_GUESTEDITOR'), }).key
    return getMembersPublic(store, {
      role: targ_key,
    })
  },
  components: {
    AppTitledList,
    EditorsIntro,
    Invite,
  },
  data () {
    return {
      asideListRoleValue: this.$t('editors.WORDING_EDITORS_GUESTEDITOR'),
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
  beforeMount () {
    Promise.all([
      getMembersPublic(this.$store, {
        custom_editor: true,
      }),
    ]).then(() => {
      if (this.$store.state.isLoggedIn) {
        const customEditorsIds = this.$store.state.customEditors.items.map(editor => editor.id)
        const asideListMembersIds = this.$store.state.publicMembers[this.asideListRoleValue].items.map(member => member.id)
        const ids = uniq(concat(customEditorsIds, asideListMembersIds))
        fetchFollowing(this.$store, {
          ids: ids,
        })
      }
    })
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
    align-items flex-start
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


