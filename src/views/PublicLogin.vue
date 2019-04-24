<template>
  <div class="login-page">
    <template v-if="registrationActive">
      <router-link to="/"><img src="/public/icons/logowithoutreadr.png"></router-link>
      <div class="message" v-html="$t('login.WELCOME')"></div>
      <LoginPanel v-if="isClientSide && !isLoggedIn"></LoginPanel>
    </template>
    <template v-else>
      <LoginPanelPackingTest v-if="isClientSide && !isLoggedIn"></LoginPanelPackingTest>
    </template>
  </div>
</template>
<script>
  import LoginPanel from '../components/LoginPanel.vue'
  import LoginPanelPackingTest from '../components/LoginPanelPackingTest.vue'
  // import AppHeader from '../components/header/AppHeader.vue'
  import { get, } from 'lodash'
  import { loadRecaptcha, loadGapiSDK, loadFbSDK, } from 'src/util/comm'
  
  export default {
    components: {
      // 'app-header': AppHeader,
      LoginPanel,
      LoginPanelPackingTest,
    },
    computed: {
      isLoggedIn () {
        return get(this.$store, 'state.isLoggedIn', false)
      },
      registrationActive () { 
        return get(this.$store, 'state.setting.REGISTRATION_ACTIVE', false) 
      },      
    },
    data () {
      return {
        isClientSide: false,
      }
    },
    name: 'Login',
    methods: {},
    mounted () {
      this.isClientSide = true
      if (this.isLoggedIn) {
        this.$router.push('/')
      } else {
        Promise.all([
          loadRecaptcha(this.$store),
          loadGapiSDK(this.$store),
          loadFbSDK(this.$store),       
        ])
      }
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
  display flex
  flex-direction column
  justify-content center
  align-items center
  width 100%
  min-height 100vh
  padding 40px 0
  background-color #444746
  > a
    font-size 0
    img
      width 50px
  > .message
    margin-top .5em
    color #ffffff
    font-size .9375rem
    font-weight 300
    font-style normal
    font-stretch normal
    line-height normal
    letter-spacing 1px
    text-align center
    & >>> .title
      margin-top 0
      margin-bottom 20px
    & >>> .big
      font-size .9375rem
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