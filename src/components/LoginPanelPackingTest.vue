<template>
  <div class="login-panel">
    <div class="login-panel__left">
      <div class="container">
        <RecoverPassword v-if="isGoingRecoverPwd"></RecoverPassword>
        <Login v-else-if="isLoginTabAcitve" @goRecoverPwd="goRecoverPwd"></Login>
        <Register v-else></Register>
      </div>
    </div>
    <div class="login-panel__right">
    </div>
  </div>
</template>
<script>
  import Login from 'src/components/login/Login.vue'
  import RecoverPassword from 'src/components/login/RecoverPassword.vue'
  import Register from 'src/components/register/Register.vue'

  const debug = require('debug')('CLIENT:LoginPanelPackingTest')
  const getDisposableToken = (store) => {
    return store.dispatch('DISPOSABLE_TOKEN', {
      type: 'register',
    })
  }

  export default {
    components: {
      Login,
      RecoverPassword,
      Register,
    },
    data () {
      return {
        isLoginTabAcitve: true,
        isGoingRecoverPwd: false,
      }
    },
    name: 'LoginPanelPackingTest',
    methods: {
      goRecoverPwd () {
        this.isGoingRecoverPwd = true
      },
    },
    mounted () {
      debug('Login Panel mounted.')
    },
    beforeMount () {
      Promise.all([
        getDisposableToken(this.$store),
      ])
    },
  }
</script>
<style lang="stylus" scoped>
  .login-panel
    background-color #d8d8d8
    width 100%
    height 100%
    padding 80px 10px 40px
    margin 0
    > div
      width 100%
      // overflow hidden
      vertical-align top
      position relative
      margin 0 auto
      
      &:last-child
      > .title
        color #fff
        margin 0 auto 15px
        font-size 15px
        font-weight 600
        
        > span
          &.active
            color #000
        > span
          margin 0 10px 0 0
      > .container
        width 100%
        margin 0 auto
    &__left
      > .title
        > span
          cursor pointer
  @media (min-width 950px)
    .login-panel
      max-width 950px
    
</style>