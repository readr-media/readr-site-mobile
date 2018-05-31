<template>
  <div class="backstage member">
    <control-bar
      @closeControlBar="$_member_closeControlBar"
      @editProfile="$_member_showProfile">
    </control-bar>
    <main class="backstage-container">
      <section class="backstage__records">
        <app-tab class="backstage__tab" :tabs="tabs">
          <following-list-tab slot="0"></following-list-tab>
        </app-tab>
      </section>
    </main>
    <base-light-box borderStyle="nonBorder" :showLightBox.sync="showProfile">
      <base-light-box-profile :profile="profile" :showLightBox="showProfile" @save="showProfile = false"></base-light-box-profile>
    </base-light-box>
  </div>
</template>
<script>
  import BaseLightBox from '../components/BaseLightBox.vue'
  import BaseLightBoxProfileEdit from '../components/BaseLightBoxProfileEdit.vue'
  import FollowingListInTab from '../components/FollowingListInTab.vue'
  import Tab from '../components/Tab.vue'
  import TheControlBar from '../components/TheControlBar.vue'
  import { get, } from 'lodash'

  // const MAXRESULT = 20
  const DEFAULT_PAGE = 1
  // const DEFAULT_SORT = '-updated_at'
  
  export default {
    name: 'AppMember',
    components: {
      'app-tab': Tab,
      'base-light-box': BaseLightBox,
      'base-light-box-profile': BaseLightBoxProfileEdit,
      'control-bar': TheControlBar,
      'following-list-tab': FollowingListInTab,
    },
    props: {
      openControlBar: {
        type: Boolean,
      },
    },
    data () {
      return {
        page: DEFAULT_PAGE,
        showProfile: false,
        tabs: [
          this.$t('tab.WORDING_TAB_FOLLOW_RECORD'),
        ],
      }
    },
    computed: {
      profile () {
        return get(this.$store, [ 'state', 'profile', ], {})
      },
    },
    watch: {
      openControlBar (val) {
        if (val) {
          document.querySelector('.controlBar').classList.add('open')
        } else {
          document.querySelector('.controlBar').classList.remove('open')
        }
      },
    },
    methods: {
      $_member_closeControlBar () {
        this.$emit('closeControlBar')
      },
      $_member_showProfile () {
        this.showProfile = true
      },
    },
  }
</script>
<style lang="stylus" scoped>

</style>
