<template>
  <section class="account">
    <AppTab
      :current="currentTab"
      :items="tabs"
      class="app-content-area"
      @change="handleTab"
    />
    <div
      :is="currentTabComponent"
      :notification="notification"
      :profile="profile"
      class="account__feature app-content-area"
    />
  </section>
</template>
<script>

import AccountNotice from 'src/components/member/AccountNotice.vue'
import AccountSetting from 'src/components/member/AccountSetting.vue'

import AppTab from 'src/components/AppTab.vue'
import { find } from 'lodash'
import { mapState } from 'vuex'

const componentMapping = {
  notice: { index: 0, component: 'AccountNotice', route: '/account/notice' },
  setting: { index: 1, component: 'AccountSetting', route: '/account/' }
}
const getProps = (routeSection) => {
  // const mapping = {
  //   notice: { notification: this.notification },
  //   setting: { profile: this.profile }
  // }
  console.log('getProps', this)
  return {}
  // return mapping[routeSection] ? mapping[routeSection] : mapping.setting
}

const getData = (store, routeSection, id) => {
  const features = {
    notice: () => store.dispatch('DataNotification/GET_NOTIFICATION', id)
  }
  return features[routeSection] ? features[routeSection]() : ''
}

export default {
  name: 'MemberAccount',
  components: {
    AccountNotice,
    AccountSetting,
    AppTab
  },
  data () {
    return {
      currentTab: 0,
      tabs: [ '通知', '設定' ]
    }
  },
  computed: {
    ...mapState({
      profile: state => state.DataUser.profile,
      notification: state => state.DataNotification.notification
    }),
    currentTabComponent () {
      const section = this.$route.params.section
      return section ? componentMapping[section].component : componentMapping.setting.component
    },
    currentProps () {
      return getProps(this.$route.params.section)
    }
  },
  watch: {
    '$route.path' () {
      getData(this.$store, this.$route.params.section, this.profile.id)
      this.currentTab = this.getCurrentTab()
    }
  },
  beforeMount () {
    getData(this.$store, this.$route.params.section, this.profile.id)
    this.currentTab = this.getCurrentTab()
  },
  methods: {
    getCurrentTab () {
      const section = this.$route.params.section
      return section ? componentMapping[section].index : componentMapping.setting.index
    },
    handleTab (tab) {
      const info = find(componentMapping, { index: tab.index })
      this.$router.push({ path: info.route })
    }
  }
}
</script>
<style lang="stylus" scoped>
.account
  padding calc(50px + 1em) 0 0
  &__feature
    margin-top 1em
  // &__block
  //   padding-bottom 20px
  //   & + .account__block
  //     padding-top 1em
  //     border-top 1px solid #979797
</style>
