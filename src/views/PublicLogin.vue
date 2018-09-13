<template>
  <div class="login-page">
    <template v-if="registrationActive">
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
  import AppHeader from '../components/header/AppHeader.vue'
  import { get, } from 'lodash'
  
  export default {
    components: {
      'app-header': AppHeader,
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
  display flex
  flex-direction column
  width 100%
  margin auto
  padding 0
  background-color #fff
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