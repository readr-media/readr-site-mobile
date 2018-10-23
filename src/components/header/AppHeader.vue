<template>
  <header :class="{ 'header--backstage': isBackstage }" class="header">
    <router-link to="/" class="header__logo"><img src="/public/icons/readr-logo-backstage.svg" alt=""></router-link>
    <div v-if="isBackstage" class="header__item header--edit" @click="openControlBar">
      <img src="/public/icons/pen-white.png" alt="">
    </div>
    <SearchTool v-if="!isBackstage" class="header__item header--search"></SearchTool>
    <Notification class="header__item"></Notification>
    <div class="header__item hamburger" @click="toggleMenu">
      <div class="hamburger__bar"></div>
      <div class="hamburger__bar"></div>
      <div class="hamburger__bar"></div>
    </div>
    <AppHeaderMenu class="header__menu" :isMenuOpen.sync="openMenu"/>
  </header>
</template>

<script>
  import Notification from 'src/components/header/Notification.vue'
  import SearchTool from 'src/components/search/SearchTool.vue'
  import AppHeaderMenu from 'src/components/header/AppHeaderMenu.vue'

  export default {
    name: 'AppHeader',
    components: {
      Notification,
      SearchTool,
      AppHeaderMenu,
    },
    data () {
      return {
        openMenu: false,
      }
    },
    computed: {
      isBackstage () {
        const route = this.$route.fullPath.split('/')[1] || ''
        const regex = /^(admin|editor|guesteditor|member)$/
        return route.match(regex)
      },
    },
    methods: {
      openControlBar () {
        this.$emit('openControlBar')
      },
      toggleMenu () {
        this.openMenu = !this.openMenu
      },
      closeMenu () {
        this.openMenu = false
      },
    },
  }
</script>

<style lang="stylus" scoped>
  .header
    display flex
    justify-content flex-end
    align-items center
    position fixed
    left 0
    top 0
    z-index 999
    width 100%
    height 40px
    padding 0 15px 0 75px
    color #fff
    background-color #444746
    a
      color #fff
      cursor pointer
    .header__item
      height 20px
      padding 0 7.5px
      // border-left 1px solid #fff
    &__logo
      position absolute
      top 8px
      left 15px
      width 50px
      height auto
      z-index 2
    &--edit
      img
        width 20px
        height 20px
  .hamburger
    display flex
    flex-direction column
    justify-content space-around
    outline none
    &__bar
      width 20px
      height 2px
      background-color #fff

  @media (min-width 769px)
    .header
      > div:first-of-type
        border-left none
      .header__item.header--edit
        display none
      .header__item.header--search
        padding 0 20px
      .header__item.hamburger
        display none
      .header__menu
        display none
</style>