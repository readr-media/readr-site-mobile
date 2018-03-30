<template>
  <div id="app">
    <app-header v-if="!isLogin" :sections="sections" @openManagePanel="$_app_openManagePanel"></app-header>
    <transition name="fade" mode="out-in">
      <router-view class="view" :openManagePanel="openManagePanel"></router-view>
    </transition>
    <app-footer></app-footer>
  </div>
</template>

<script>
  import { SECTIONS_DEFAULT, } from './constants'
  import { get, } from 'lodash'
  import AppFooter from './components/AppFooter.vue'
  import AppHeader from './components/AppHeader.vue'
  export default {
    components: {
      AppFooter,
      AppHeader,
    },
    data () {
      return {
        openManagePanel: '',
      }
    },
    computed: {
      isLogin () {
        return get(this.$route, [ 'fullPath', ]).split('/')[1] === 'login'
      },
      sections () {
        return SECTIONS_DEFAULT
      },
    },
    methods: {
      $_app_openManagePanel (panel) {
        this.openManagePanel = panel
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
  // max-width 800px
  width 100%
  margin 0 auto
  position relative
  background-color #fff
  padding-top 40px
  overflow-x hidden
  &.locked
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
  &__record
    flex 1
    display flex
    flex-direction column
    background-color #fff
  &__tab
    flex 1
    display flex
    flex-direction column
    .tab__content
      flex 1
  &__panel
    padding 20px 5%
    margin-top 20px
    border 2px solid #d8ca21
    background #fff

@media (min-width 768px)
  .view
    background-color #e6e6e6

@media (min-width 950px)
  .main-container
    width 950px
    max-width 950px
    margin 22px auto 0
  .main-panel
    padding 35px calc((100% - 800px) / 2) 40px
</style>
