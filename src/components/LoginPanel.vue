<template>
  <div class="login-panel">
    <div class="login-panel__left">
      <div class="title">
        <span class="login" v-text="$t('login.WORDING_LOGIN')"
          :class="{ active: isLoginTabAcitve && !isGoingRecoverPwd }"
          @click="tabChoose('login')"></span>
        <span class="register" v-text="$t('login.WORDING_REGISTER')"
          :class="{ active: !isLoginTabAcitve && !isGoingRecoverPwd }"
          @click="tabChoose('register')"></span>
        <span class="forgot"
          v-if="isGoingRecoverPwd"
          v-text="$t('login.WORDING_FORGET_PASSWORD')"
          :class="{ active: isGoingRecoverPwd }"
          @click="tabChoose('recoverpwd')"></span>
      </div>
      <div class="container">
        <RecoverPassword v-if="isGoingRecoverPwd"></RecoverPassword>
        <Login v-else-if="isLoginTabAcitve" @goRecoverPwd="goRecoverPwd"></Login>
        <Register v-else></Register>
      </div>
    </div>
    <div class="login-panel__right">
      <div class="title">
        <span class="login-community active" v-text="''"></span>
      </div>
      <div class="container">
        <FacebookLogin :type="isLoginTabAcitve ? 'login' : 'register'"></FacebookLogin>
        <GooglePlusLogin :type="isLoginTabAcitve ? 'login' : 'register'"></GooglePlusLogin>
      </div>
    </div>
  </div>
</template>
<script>
  import FacebookLogin from 'src/components/login/FacebookLogin.vue'
  import GooglePlusLogin from 'src/components/login/GooglePlusLogin.vue'
  import Login from 'src/components/login/Login.vue'
  import RecoverPassword from 'src/components/login/RecoverPassword.vue'
  import Register from 'src/components/register/Register.vue'

  const debug = require('debug')('CLIENT:LoginPanel')
  const getDisposableToken = (store) => {
    return store.dispatch('DISPOSABLE_TOKEN', {
      type: 'register',
    })
  }

  export default {
    components: {
      FacebookLogin,
      GooglePlusLogin,
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
    name: 'LoginPanel',
    methods: {
      goRecoverPwd () {
        this.isGoingRecoverPwd = true
      },
      tabChoose (targ) {
        switch (targ) {
          case 'login':
            this.isLoginTabAcitve = true
            this.isGoingRecoverPwd = false
            break
          case 'register':
            this.isLoginTabAcitve = false
            this.isGoingRecoverPwd = false
            break
          case 'recoverpwd':
            this.isLoginTabAcitve = false
            this.isGoingRecoverPwd = false
            break
        }
      },
    },
    mounted () {
      debug('LoginPanel mounted.')
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
    height 100vh
    padding 80px 10px 40px
    margin 0
    display flex
    flex-direction column
    justify-content center
    align-items center
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