<template>
  <div class="header">
    <img class="header__logo" src="/public/icons/logo-mobile.png" alt="">
    <SearchTool class="header__search"></SearchTool>
    <div v-if="isClientSide" class="header__status" >
      <div v-if="isLoggedIn" class="header__status-item header--nickname" @click="goMemberCenter" v-text="userNickname"></div>
      <a v-if="!isLoggedIn" class="header__status-item" href="/login" v-text="wording.WORDING_HEADER_LOGIN"></a>
      <div v-else-if="isLoggedIn" class="header__status-item" @click="logout" v-text="wording.WORDING_HEADER_LOGOUT"></div>
    </div>
    <button class="header__hamburger" @click="toggleMenu"><img src="/public/icons/menu.png"></button>
    <section ref="headerMenu" class="header__menu">
      <ul>
        <li><a><img src="/public/icons/fb.png" alt=""></a></li>
        <li><a><img src="/public/icons/github.png" alt=""></a></li>
        <li><a><img src="/public/icons/info.png" alt=""></a></li>
        <li><a><img src="/public/icons/mirrormedia.png" alt=""></a></li>
      </ul>
      <div class="header__menu-curtain" @click="toggleMenu"></div>
    </section>
  </div>
</template>
<script>
  import _ from 'lodash'
  import { WORDING_HEADER_LOGIN, WORDING_HEADER_LOGOUT, WORIDNG_HEADER_MEMBER_CENTRE, } from '../constants'
  import { ROLE_MAP, } from '../constants'
  import { removeToken, } from '../util/services'
  import SearchTool from 'src/components/search/SearchTool.vue'

  const checkLoginStatus = (store) => {
    return store.dispatch('CHECK_LOGIN_STATUS', {})
  }
  const getProfile = (store) => {
    return store.dispatch('GET_PROFILE', {})
  }
  const logout = (store) => {
    return store.dispatch('LOGOUT', {})
  }

  export default {
    components: {
      SearchTool,
    },
    computed: {
      currUrl () {
        return _.get(this.$router, [ 'fullpath', ])
      },
      currentUser () {
        return _.get(this.$store, [ 'state', 'profile', ], {})
      },
      isLoggedIn () {
        return _.get(this.$store, [ 'state', 'isLoggedIn', ])
      },
      userNickname () {
        return this.isLoggedIn && _.get(this.currentUser, [ 'nickname', ], _.get(this.currentUser, [ 'name', ], this.wording.WORIDNG_HEADER_MEMBER_CENTRE))
      },
    },
    data () {
      return {
        isClientSide: false,
        wording: {
          WORDING_HEADER_LOGIN,
          WORDING_HEADER_LOGOUT,
          WORIDNG_HEADER_MEMBER_CENTRE,
        },
      }
    },
    name: 'AppHeader',
    methods: {
      goMemberCenter () {
        const memberCenter = _.get(_.filter(ROLE_MAP, { key: _.get(this.$store, [ 'state', 'profile', 'role', ]), }), [ 0, 'route', ], 'member')
        location && location.replace(`/${memberCenter}`)
      },
      logout () {
        logout(this.$store).then(() => {
          return removeToken().then(() => {
            location && location.replace('/')
          })
        })
      },
      toggleMenu () {
        this.$refs.headerMenu.classList.toggle('open')
      },
    },
    mounted () {
      this.isClientSide = true
    },
    beforeMount () {
      checkLoginStatus(this.$store).then(() => {
        if (this.isLoggedIn) {
          return getProfile(this.$store)
        }
        return
      })
    },
    props: [ 'sections', ],
  }
</script>
<style lang="stylus" scoped>
  .header
    display flex
    justify-content flex-end
    align-items center
    position fixed
    top 0
    left 0
    right 0
    z-index 999
    width 100%
    height 40px
    padding 5px 15px 5px 75px
    background-color #444746
    &__logo
      position absolute
      top 8px
      left 15px
      width 50px
      height auto
    &__status
      display flex
      align-items center
      &-item
        position relative
        height 15px
        padding 0 10px
        color #fff
        font-size 12px
        font-weight 300
        line-height 15px
        border-left 1px solid #fff
        &.header--nickname
          padding 0 34px 0 10px
          color #ddcf21 
          &::before
            content ''
            position absolute
            bottom 0
            right 10px
            width 14px
            height 15px
            background-color transparent
            background-image url(/public/icons/account.png)
            background-position center center
            background-repeat no-repeat
            background-size contain
    &__hamburger
      width 30px
      height 30px
      padding 0
      background transparent
      border none
      outline none
      img
        width 100%
    &__menu
      position absolute
      top 0
      left 0
      right 0
      bottom 0
      z-index 10
      width 100%
      height 100vh
      margin 0
      opacity 0
      visibility hidden
      transition opacity 0.35s ease-out
      &.open
        visibility visible
        opacity 1
        ul
          right 0
      ul
        position relative
        right -100%
        z-index 10
        width 60%
        height 100%
        margin 0 0 0 40%
        padding 0
        background-color #ddcf21
        transition right 0.35s ease-out
        li
          position relative
          width 100%
          height 25%
          border-bottom 1px solid #fff
          list-style-type none
          &:last-of-type
            border-bottom none
          img
            position absolute
            top 50%
            left 50%
            transform translate(-50%, -50%)
            width 50px
            height 50px
      &-curtain
        position absolute
        top 0
        left 0
        bottom 0
        right 0
        width 100%
        height 100%
        background-color rgba(0, 0, 0, .6)
    
</style>