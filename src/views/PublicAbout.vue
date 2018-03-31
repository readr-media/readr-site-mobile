<template>
  <section class="about">
    <Invite></Invite>
    <div class="about__content" v-html="aboutContent"></div>
  </section>
</template>
<script>
  import { ABOUT_CONTENT, } from '../constants/about'
  import Invite from '../components/invitation/Invite.vue'

  export default {
    name: 'PublicAbout',
    data () {
      return {
        aboutContent: ABOUT_CONTENT,
      }
    },
    components: {
      Invite,
    },
  }
</script>
<style lang="stylus" scoped>
  .about
    &__content
      padding 25px 20px
      text-align justify
      >>> h3:first-child
        margin-top 0
      >>> p
        margin 1.5em 0
        font-size .9375rem
        line-height 1.5
      >>> p:last-child
        margin-bottom 0
      
</style>