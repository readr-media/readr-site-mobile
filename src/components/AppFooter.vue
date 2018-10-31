<template>
  <footer ref="footer" class="footer">
    <router-link to="/" class="footer__item">
      <p v-text="$t('SECTIONS.CHIEF_EDITOR_TALK')"></p>
    </router-link>
    <router-link to="/series-list" class="footer__item">
      <p v-text="$t('SECTIONS.PROJECTS')"></p>
    </router-link>
    <router-link to="/editors" class="footer__item">
      <p v-text="$t('SECTIONS.CHIEF_EDITOR_LIST')"></p>
    </router-link>
    <router-link to="/about" class="footer__item">
      <p v-text="$t('SECTIONS.ABOUT')"></p>
    </router-link>
    <router-link :to="`/profile/${ANNOUNCEMENT_ACCOUNT_ID}`" class="footer__item">
      <img class="announcement-icon" src="/public/icons/announcement.png" alt="">
    </router-link>
  </footer>
</template>
<script>
  import { ANNOUNCEMENT_ACCOUNT_ID, } from 'src/constants'

  export default {
    name: 'AppFooter',
    data () {
      return {
        ANNOUNCEMENT_ACCOUNT_ID,
      }
    },
    mounted () {
      window.addEventListener('touchmove', this.$_footer_touchHandler)
    },
    methods: {
      $_footer_touchHandler (e, showDirection = 'up') {
        const currentClientY = e.touches[0].clientY
        const endClientY = window.touchClientY || currentClientY
        const shouldShowFooter = showDirection === 'up' ? currentClientY > endClientY : currentClientY <= endClientY
        if (shouldShowFooter) {
          document.querySelector('footer').classList.add('active')
        } else {
          document.querySelector('footer').classList.remove('active')
        }
        window.touchClientY = currentClientY
      },
    },
  }
</script>
<style lang="stylus" scoped>
  .footer
    position fixed
    bottom 0
    left 0
    right 0
    z-index 999
    width 100%
    height 35px
    background-color #fff
    border-top 1px solid #d3d3d3
    visibility hidden
    display flex
    &.active
      visibility visible
    &__item
      flex 1 1 auto
      display flex
      justify-content center
      align-items center
      position relative
      width 25%
      height 100%
      color black
      border-left 1px solid #d3d3d3
      font-size 13px
      img
        width 20px
        height auto

  .router-link-exact-active
    background-color #ddcf21
</style>