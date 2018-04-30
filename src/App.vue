<template>
  <div id="app">
    <app-header v-if="!isLogin" :sections="sections" @openControlBar="$_app_openControlBar"></app-header>
    <transition name="fade" mode="out-in">
      <router-view class="view" :openControlBar="openControlBar" @closeControlBar="$_app_closeControlBar"></router-view>
    </transition>
    <app-footer v-if="!isLogin"></app-footer>
  </div>
</template>

<script>
  import { SECTIONS_DEFAULT, } from './constants'
  import { get, } from 'lodash' 
  import { logTrace, } from 'src/util/services'   
  import AppFooter from './components/AppFooter.vue'
  import AppHeader from './components/header/AppHeader.vue'
  import Tap from 'tap.js'
  export default {
    components: {
      AppFooter,
      AppHeader,
    },
    data () {
      return {
        openControlBar: false,
        doc: {}, 
        globalTapevent: {}, 
      }
    },
    computed: {
      currUser () { 
        return get(this.$store, 'state.profile.id') 
      }, 
      isLogin () {
        return get(this.$route, [ 'fullPath', ]).split('/')[1] === 'login'
      },
      sections () {
        return SECTIONS_DEFAULT
      },
      useragent () { 
        return get(this.$store, 'state.useragent') 
      }, 
    },
    mounted () {
      this.$store.dispatch('UPDATE_CLIENT_SIDE')
      this.doc = document
      this.$_app_launchLogger()
    },
    methods: {
      $_app_closeControlBar () {
        this.openControlBar = false
      },
      $_app_openControlBar () {
        this.openControlBar = true
      },
      $_app_launchLogger () { 
        this.globalTapevent = new Tap(this.doc) 
        this.doc.addEventListener('tap', (event) => { 
          logTrace({ 
            category: 'whole-site', 
            description: 'ele clicked', 
            eventType: 'click', 
            sub: this.currUser, 
            target: event.target, 
            useragent: this.useragent, 
          }) 
        }) 
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
