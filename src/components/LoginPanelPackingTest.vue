<template>
  <div class="login-panel closed-beta">
    <div class="login-panel__left">
      <div class="container">
        <img src="/public/icons/readr-logo.png" alt="">
        <h2>歡迎來到<span class="highlight"> READr</span></h2>
        <h3>在這裡，新聞產製將嘗試由</h3>
        <h2><span class="highlight">R</span>eporter、</h2>
        <h2><span class="highlight">E</span>ngineer、</h2>
        <h2><span class="highlight">A</span>udience、</h2>
        <h2><span class="highlight">D</span>esigner，</h2>
        <h3>一起共同完成，</h3>
        <h3>讓新聞內容更加完善，</h3>
        <h3>將以往封閉的新聞編輯室邁向開放的可能，</h3>
        <h3>最重要的就是你的參與。</h3>
        <RecoverPassword v-if="isGoingRecoverPwd"></RecoverPassword>
        <Login v-else-if="isLoginTabAcitve" @goRecoverPwd="goRecoverPwd"></Login>
        <h2><span class="highlight">目前尚在封測期間，暫不開放註冊</span></h2>
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
    display flex
    flex-direction column
    justify-content center
    align-items center
    background-color #444746
    width 100%
    height 100%
    padding 25px 20px 40px
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
        color #fff
        text-align center
        img
          width 60px
          height auto
        h2
          font-weight 400
          font-size .9375rem
          &:last-child
            margin-bottom 0
        h3
          font-weight 400
          font-size .8125rem
        .highlight
          color #ddcf21
    &__left
      > .title
        > span
          cursor pointer

</style>
