<template>
  <section ref="controlBar" class="controlBar">
    <div v-if="isClientSide" class="controlBar__menu">
      <div v-if="$can('addPost')" class="controlBar__menu-item">
        <div class="controlBar__menu-item-title" v-text="$t('CONTROL_BAR.REVIEW')"></div>
        <div class="controlBar__menu-item-box">
          <button @click="$_controlBar_clickHandler('addReview')" v-text="$t('CONTROL_BAR.ADD_DIRECTLY')"></button>
          <button @click="$_controlBar_clickHandler('editReview')" v-text="$t('CONTROL_BAR.EDIT_DRAFT')"></button>
        </div>
      </div>
      <div v-if="$can('addPost')" class="controlBar__menu-item">
        <div class="controlBar__menu-item-title" v-text="$t('CONTROL_BAR.NEWS')"></div>
        <div class="controlBar__menu-item-box">
          <button @click="$_controlBar_clickHandler('addNews')" v-text="$t('CONTROL_BAR.ADD_DIRECTLY')"></button>
          <button @click="$_controlBar_clickHandler('editNews')" v-text="$t('CONTROL_BAR.EDIT_DRAFT')"></button>
        </div>
      </div>
      <div class="controlBar__menu-item">
        <div class="controlBar__menu-item-title" v-text="$t('CONTROL_BAR.MANAGE')"></div>
        <div class="controlBar__menu-item-box">
          <button @click="$_controlBar_openPanel($event, 'records')" v-text="$t('CONTROL_BAR.RECORD')"></button>
          <button v-if="$can('editOtherPost')" @click="$_controlBar_openPanel($event, 'posts')" v-text="$t('CONTROL_BAR.POST')"></button>
        </div>
        <div class="controlBar__menu-item-box">
          <!-- <button @click="$_controlBar_openPanel($event, 'videos')" v-text="$t('CONTROL_BAR.VIDEO')"></button> -->
          <button v-if="$can('editTag')" @click="$_controlBar_openPanel($event, 'tags')" v-text="$t('CONTROL_BAR.TAG')"></button>
        </div>
      </div>
      <div v-if="$can('memberManage')" class="controlBar__menu-item">
        <div class="controlBar__menu-item-title" v-text="$t('CONTROL_BAR.ACCOUNT')"></div>
        <div class="controlBar__menu-item-box">
          <button v-text="$t('CONTROL_BAR.ADD_DIRECTLY')"></button>
          <button @click="$_controlBar_openPanel($event, 'accounts')" v-text="$t('CONTROL_BAR.ACCOUNT_LIST')"></button>
        </div>
      </div>
      <button @click="$_controlBar_clickHandler('editProfile')" v-text="$t('CONTROL_BAR.EDIT_PROFILE')"></button>
    </div>
    <button @click="$_controlBar_close"><img src="/public/icons/close-black.png" alt=""></button>
  </section>
</template>
<script>
  import { get, } from 'lodash'
  import ControlBarButton from './ControlBarButton.vue'
  import ControlBarButtonBox from './ControlBarButtonBox.vue'

  export default {
    name: 'TheControlBar',
    components: {
      'control-bar-button': ControlBarButton,
      'control-bar-button-box': ControlBarButtonBox,
    },
    data () {
      return {
        activePanel: 'record',
        amountBtn: 0,
        viewport: 0,
      }
    },
    computed: {
      isClientSide () {
        return get(this.$store, [ 'state', 'isClientSide', ], false)
      },
      wordingBtnNews () {
        return this.viewport <= 767 ? this.$t('control_bar.WORDING_CONTROLBAR_NEWS') : this.$t('control_bar.WORDING_CONTROLBAR_ADD_NEWS')
      },
      wordingBtnReview () {
        return this.viewport <= 767 ? this.$t('control_bar.WORDING_CONTROLBAR_REVIEW') : this.$t('control_bar.WORDING_CONTROLBAR_ADD_REVIEW')
      },
    },
    mounted () {
      this.$_controlBar_getViewport()
      window.addEventListener('resize', this.$_controlBar_getViewport)
    },
    destroyed () {
      window.removeEventListener('resize', this.$_controlBar_getViewport)
    },
    methods: {
      $_controlBar_btnAmountHandler (isMounted) {
        if (isMounted) {
          this.amountBtn += 1
        } else {
          this.amountBtn -= 1
        }
      },
      $_controlBar_clickHandler (eventName) {
        this.$emit(eventName)
        this.$emit('closeControlBar')
      },
      $_controlBar_close () {
        this.$emit('closeControlBar')
      },
      $_controlBar_getViewport () {
        this.viewport = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth
      },
      $_controlBar_openPanel (event, panel) {
        this.activePanel = panel
        this.$emit('openPanel', panel)
        this.$emit('closeControlBar')
      },
      // $_controlBar_toggleBtnBox (e) {
      //   if (this.viewport < 950 && includes(e.target.parentNode.classList, 'active')) {
      //     e.target.parentNode.classList.remove('active')
      //   } else {
      //     e.target.parentNode.classList.add('active')
      //   }
      // },
    },
  }
</script>
<style lang="stylus" scoped>
.controlBar
  display flex
  flex-direction column
  justify-content center
  align-items center
  position fixed
  top 0
  right -100%
  bottom 0
  z-index 1000
  width 100%
  height 100vh
  margin 0
  background-color #ddcf21
  visibility hidden
  transition right 0.35s ease-out
  &.open
    right 0
    visibility visible
  > button
    display flex
    justify-content center
    align-items center
    position absolute
    top 10px
    right 10px
    width 35px
    height 35px
    padding 0
    border 1px solid #000
    background-color transparent
    outline none
    img
      width 20px
      height 20px
  &__menu
    width calc(100% - 40px)
    text-align center
    button
      padding 20px 0
      font-size 1.125rem
      background-color transparent
      border none
      outline none
    &-item
      &:last-of-type
        padding-bottom 10px
        border-bottom 1px solid #fff
      &-title
        position relative
        margin 10px 0
        color #fff
        font-size 1.25rem
        font-weight 300
        text-align center
        &:before
          content ''
          position absolute
          top 50%
          left 0
          transform translate(0, -50%)
          width calc(50% - 36px)
          height 1px
          background-color #fff
        &:after
          content ''
          position absolute
          top 50%
          right 0
          transform translate(0, -50%)
          width calc(50% - 36px)
          height 1px
          background-color #fff
      &-box
        display flex
        flex-wrap wrap
        button
          width 50%
          padding 10px 0
          &:nth-child(odd)
            border-right 1px solid #000
      
</style>
