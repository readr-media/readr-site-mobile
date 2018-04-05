<template>
  <div class="login-page">
    <!--LoginPanel v-if="isClientSide && !isLoggedIn"></LoginPanel-->
    <LoginPanelPackingTest v-if="isClientSide && !isLoggedIn"></LoginPanelPackingTest>
  </div>
</template>
<script>
  import _ from 'lodash'
  import { SECTIONS_DEFAULT, } from '../constants'
  // import LoginPanel from '../components/LoginPanel.vue'
  import LoginPanelPackingTest from '../components/LoginPanelPackingTest.vue'
  import AppHeader from '../components/AppHeader.vue'
  import AppAsideNav from '../components/AppAsideNav.vue'
  
  export default {
    components: {
      'app-header': AppHeader,
      // LoginPanel,
      LoginPanelPackingTest,
      AppAsideNav,
    },
    computed: {
      isLoggedIn () {
        return _.get(this.$store, [ 'state', 'isLoggedIn', ], false)
      },
      sections () {
        return SECTIONS_DEFAULT
      },
    },
    data () {
      return {
        isClientSide: false,
      }
    },
    name: 'login-page',
    methods: {},
    mounted () {
      this.isClientSide = true
      this.isLoggedIn && this.$router.push('/')
    },
    watch: {
      isLoggedIn: function () {
        // this.isLoggedIn && location.replace('/')
      },
    },
  }
</script>
<style lang="stylus" scoped>
.login-page
  width 100%
  height 100vh
  background-color #fff
  // &__container
  margin auto
  padding 0
  display flex
  &__aside
    width 75px
    height 100%
    position sticky
    // position fixed
    top 60px
  &__main
    margin-left 93.5px
    width 950px
</style>