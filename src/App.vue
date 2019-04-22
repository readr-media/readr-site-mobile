<template>
  <div id="app" :class="{ embed: isEmbed }">
    <template v-if="isEmbed">
      <transition name="fade" mode="out-in">
        <router-view class="view"></router-view>
      </transition>
    </template>
    <template v-else>
      <app-header v-if="!isLoginPage && !isCommentPage" @openControlBar="openControlBar"></app-header>
      <transition name="fade" mode="out-in">
        <router-view class="view" :showControlBar="showControlBar" @closeControlBar="closeControlBar"></router-view>
      </transition>
      <AppFooter v-if="!isLoginPage && !isBackstage && !isCommentPage" />
      <Consume></Consume>
      <DepositTappay v-if="isTappayNeeded" :active.sync="isDepositActive" @fetchCurrentPoint="fetchCurrentPoint"></DepositTappay>    
      <Conversation></Conversation>
      <LoginLight></LoginLight>
      <AlertGDPR v-if="showAlertGDPR" @closeAlertGDPR="showAlertGDPR = false" />
    </template>
  </div>
</template>

<script>
  import { get, filter, } from 'lodash' 
  import { isAlink, isABTest, logTrace, } from 'src/util/services'
  import { ROLE_MAP, } from 'src/constants'
  import AlertGDPR from 'src/components/AlertGDPR.vue'
  import AppFooter from './components2.0/AppFooter.vue'
  import AppHeader from './components/header/AppHeader.vue'
  import Consume from 'src/components/point/Consume.vue' 
  import DepositTappay from 'src/components/point/DepositTappay.vue'
  import Conversation from 'src/components/Conversation.vue'
  import LoginLight from 'src/components/login/LoginLight.vue'
  import Tap from 'tap.js'
  import VueCookie from 'vue-cookie'

  const fetchCurrentPoint = store => store.dispatch('GET_POINT_CURRENT', { params: {}, })

  export default {
    components: {
      AlertGDPR,
      AppFooter,
      AppHeader,
      Consume,
      Conversation,
      DepositTappay,
      LoginLight,
    },
    data () {
      return {
        showControlBar: false,
        doc: {}, 
        globalTapevent: {},
        isDepositActive: false,
        showAlertGDPR: false,
      }
    },
    computed: {
      currUser () { 
        return get(this.$store, 'state.profile.id') 
      },
      isBackstage () {
        return this.$route.path.match(/\/(admin|editor|guesteditor|member)$/)
      },
      isAboutPage () {
        return /\/about/.test(this.$route.fullPath)
      },
      isEmbed () {
        return /\/embed\//.test(this.$route.fullPath)
      },
      isLoginPage () {
        return /\/login/.test(this.$route.fullPath)
      },
      isCommentPage () {
        return this.$route.path === '/comment'
      },
      isTappayNeeded () {
        return get(this.$store, 'state.isTappayRequired', false)
      },
      useragent () { 
        return get(this.$store, 'state.useragent') 
      },
      memberCenter () {
        return get(filter(ROLE_MAP, { key: get(this.$store, 'state.profile.role',), }), [ 0, 'route', ], 'member')
      },
    },
    mounted () {
      this.doc = document
      this.$store.dispatch('UPDATE_CLIENT_SIDE')
      this.launchLogger()
      this.sendPageview()
      this.showAlertGDPR = !this.getGDPRCookie() && !this.isCommentPage
    },
    methods: {
      openControlBar () {
        if (!this.isBackstage) {
          this.$router.push(`/${this.memberCenter}`)
        }
        this.showControlBar = true
      },
      closeControlBar () {
        this.showControlBar = false
      },
      fetchCurrentPoint () {
        fetchCurrentPoint(this.$store)
      },
      getFirstLoginCookie () {
        return VueCookie.get('readr-first-login')
      },
      getGDPRCookie () {
        return VueCookie.get('gdpr-accept-cookie')
      },
      launchLogger () { 
        this.globalTapevent = new Tap(this.doc) 
        this.doc.addEventListener('tap', (event) => { 
          const checkAlink = isAlink(event.target)
          const checkABTest = isABTest(event.target)
          logTrace({ 
            category: 'whole-site', 
            description: 'ele clicked', 
            eventType: 'click', 
            sub: this.currUser, 
            target: event.target, 
            useragent: this.useragent,
            isAlink: checkAlink,
            isABTest: checkABTest,
          })
        }) 
      },
      sendPageview () { 
        logTrace(Object.assign({
          category: this.$route.fullPath,
          description: 'pageview',
          eventType: 'pageview',
          sub: this.currUser,
          target: {},
          useragent: this.useragent,
          referrer: document.referrer,
        }, this.$route.query)) 
      },       
    },
    watch: { 
      '$route.fullPath': function () { 
        if (!process.browser) { return }
        this.sendPageview()
      }, 
    }, 
  }
</script>

<style lang="stylus">
#app
  padding 0 0 34px 0

a
  text-decoration none

button
  cursor pointer
  &:disabled
    cursor not-allowed
.view
  width 100%
  min-height 100vh
  margin 0 auto
  position relative
  background-color #fff
  padding-top 40px
  overflow-x hidden
  &.main
    background-color #e6e6e6
  &.locked
    width 100%
    height 100vh
    overflow hidden

.embed
  min-height 100vh
  background-color #11b8c9
  .view
    min-height 0

.locked
  width 100%
  height 100vh
  overflow hidden

.main-container
  width 90%
  max-width 90%
  margin 0 auto
  overflow hidden

.main-panel
  width 100%
  padding 20px 5%
  border 2px solid #d8ca21
  background #fff

.datepicker__input
  padding-left 10px
  width 100%
  height 25px
  color #808080
  border 1px solid #808080

.fade-enter-active, .fade-leave-active
  transition all .2s ease

.fade-enter, .fade-leave-active
  opacity 0

.backstage
  width 100%
  &-container
    display flex
    flex-direction column
    width 100%
    min-height calc(100vh - 40px)
    padding-top 30px
  &__controlBar
    margin-top 40px
  &__records
    flex 1
    display flex
    flex-direction column
    background-color #fff
  &__panel
    position relative
    flex 1
    display flex
    flex-direction column
    padding 20px 5%
    background-color #fff
    border 2px solid #d8ca21
  &__tab
    flex 1
    display flex
    flex-direction column
    .tab__content
      flex 1
  // &__panel
  //   padding 20px 5%
  //   margin-top 20px
  //   border 2px solid #d8ca21
  //   background #fff

@media (min-width 768px)
  .view
    padding-top 50px
    background-color #e6e6e6
    

</style>
