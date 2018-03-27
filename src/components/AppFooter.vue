<template>
  <footer ref="footer" class="footer">
    <router-link to="/" class="footer__item" :class="{ active: currentPath === '' }">
      <img src="/public/icons/posts.png" alt="">
    </router-link>
    <router-link to="/" class="footer__item">
      <img src="/public/icons/hot-posts.png" alt="">
    </router-link>
    <!-- <router-link to="/videos" class="footer__item" :class="{ active: currentPath === 'videos' }">
      <img src="/public/icons/videos.png" alt="">
    </router-link> -->
    <router-link to="/editors" class="footer__item" :class="{ active: currentPath === 'editors' }">
      <img src="/public/icons/editors.png" alt="">
    </router-link>
    <router-link to="/projects" class="footer__item" :class="{ active: currentPath === 'projects' }">
      <img src="/public/icons/projects.png" alt="">
    </router-link>
  </footer>
</template>
<script>
  import { get, } from 'lodash'

  export default {
    name: 'AppFooter',
    computed: {
      currentPath () {
        return get(this.$route, [ 'fullPath', ]).split('/')[1]
      },
    },
    mounted () {
      window.addEventListener('touchmove', this.$_footer_touchHandler)
      
    },
    methods: {
      $_footer_touchHandler (e) {
        const currentClientY = e.touches[0].clientY
        const endClientY = window.touchClientY || currentClientY
        if (currentClientY <= endClientY) {
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
    &.active
      visibility visible
    &__item
      display inline-block
      position relative
      width 25%
      height 100%
      &.active
        background-color #ddcf21
      img
        position absolute
        top 50%
        left 50%
        transform translate(-50%, -50%)
        width 30px
        height auto
</style>