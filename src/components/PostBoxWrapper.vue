<template>
  <div class="post-box-wrapper">
    <div class="post-box-wrapper__main" :class="{ off: showPostBox }">
      <slot class="main"></slot>
    </div>
    <div class="post-box-wrapper__aside" :class="{ on: showPostBox }">
      <div class="post-box-wrapper__aside__content">
        <div class="btn go-back" :class="{ show: showPostBox }" @click="close"><span>Go Back</span></div>
        <slot name="postContent" class=""></slot>
      </div>
    </div>
  </div>
</template>
<script>
  // import pathToRegexp from 'path-to-regexp'

  export default {
    name: 'PostBoxWrapper',
    data() {
      return {}
    },
    methods: {
      close () {
        // pathToRegexp('/post/:postId').test(this.$route.path) ? this.$emit('closeLightBox') : this.$emit('update:showLightBox', false)
        this.hadRouteBeenNavigate ? this.$router.back() : this.$router.push('/')
      },      
    },
    mounted () {},
    props: {
      showPostBox: {
        type: Boolean,
        default: false,
      },
      hadRouteBeenNavigate: {
        type: Boolean,
        required: true,
      },
    },
  }
</script>
<style lang="stylus" scoped>
  .post-box-wrapper
    position relative
    width 100vw
    overflow hidden
    > div
      transition left 0.25s ease-out
    &__main
      width 100vw
      position relative
      left 0
      top 0
      &.off
        position absolute
        left -100vw
    &__aside
      width 100vw
      min-height 100vh
      position absolute
      left 100vw
      top 0
      &.on
        left 0
        position relative
      &__content
        position relative
        left 0
        top 0
        min-height 100vh
        background-color #fff 
        padding-top 35px    
        .btn
          display none
          position fixed
          top 40px
          left 0
          padding 0 10px
          height 35px
          width 100%
          background-color #11b8c9
          box-shadow 0 0 15px #00000059
          color #fff
          font-size 1.125rem
          &.show
            display flex
            justify-content flex-end
            align-items center
</style>