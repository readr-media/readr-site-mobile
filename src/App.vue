<template>
  <div id="app">
    <app-header v-if="!isLoginPage && !isCommentPage" @openControlBar="openControlBarHandler"></app-header>
    <transition name="fade" mode="out-in">
      <router-view class="view" :openControlBar="openControlBar" @closeControlBar="closeControlBar"></router-view>
    </transition>
    <app-footer v-if="!isLoginPage && !isBackstage && !isCommentPage"></app-footer>
    <Consume></Consume>
    <AlertGDPR v-if="showAlertGDPR" @closeAlertGDPR="showAlertGDPR = false" />
  </div>
</template>

<script>
  import { get, } from 'lodash' 
  import { isAlinkDescendant, logTrace, } from 'src/util/services'
  import AlertGDPR from 'src/components/AlertGDPR.vue'
  import AppFooter from './components/AppFooter.vue'
  import AppHeader from './components/header/AppHeader.vue'
  import Consume from 'src/components/point/Consume.vue' 
  import Tap from 'tap.js'
  import VueCookie from 'vue-cookie'

  export default {
    components: {
      AlertGDPR,
      AppFooter,
      AppHeader,
      Consume,
    },
    data () {
      return {
        openControlBar: false,
        doc: {}, 
        globalTapevent: {},
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
      isLoginPage () {
        return /\/login/.test(this.$route.fullPath)
      },
      isCommentPage () {
        return this.$route.path === '/comment'
      },
      useragent () { 
        return get(this.$store, 'state.useragent') 
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
      closeControlBar () {
        this.openControlBar = false
      },
      getGDPRCookie () {
        return VueCookie.get('gdpr-accept-cookie')
      },
      launchLogger () { 
        this.globalTapevent = new Tap(this.doc) 
        this.doc.addEventListener('tap', (event) => { 
          const { isAlink, } = isAlinkDescendant(event.target) 
          isAlink && logTrace({ 
            category: 'whole-site', 
            description: 'ele clicked', 
            eventType: 'click', 
            sub: this.currUser, 
            target: event.target, 
            useragent: this.useragent, 
          }) 
        }) 
      },
      openControlBarHandler () {
        this.openControlBar = true
      },
      sendPageview () { 
        logTrace({ 
          category: this.$route.fullPath, 
          description: 'pageview', 
          eventType: 'pageview', 
          sub: this.currUser, 
          target: {}, 
          useragent: this.useragent, 
        }) 
      },       
    },
    watch: { 
      '$route.fullPath': function () { 
        process.browser && this.sendPageview() 
      }, 
    }, 
  }
</script>

<style lang="stylus">
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
