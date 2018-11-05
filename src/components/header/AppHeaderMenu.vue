<template>
  <div :class="[ 'menu-container', { 'menu-container--open': isMenuOpen } ]">
    <div class="menu-container__dimmed" @click="closeMenu"></div>
    <section :class="[ 'menu-container__menu', { 'menu-container__menu--open': isMenuOpen } ]">
      <AppHeaderMenuList :icon="memberIcon">
        <ul class="list">
          <li class="list__list-item">
            <a @click="memberActionTo('/login')" v-text="memberIsLoggedIn ? $t('MENU.MEMBER.LOGOUT') : $t('MENU.MEMBER.LOGIN')"></a>
            <a v-show="!memberIsLoggedIn" @click="memberActionTo('/login/register')" v-text="$t('MENU.MEMBER.REGISTER')"></a>
          </li>
          <li v-show="memberIsLoggedIn" class="list__list-item">
            <a @click="memberActionTo(`/${memberRole}/profile-edit`)" v-text="$t('MENU.MEMBER.PROFILE_EDIT')"></a>
          </li>
          <li v-show="memberIsLoggedIn" class="list__list-item">
            <a @click="memberActionTo(`/${memberRole}/records/following`)" v-text="$t('MENU.MEMBER.FOLLOWING')"></a>
          </li>
          <li v-show="memberIsLoggedIn" class="list__list-item">
            <a @click="memberActionTo(`/${memberRole}/records/point-manager`)" v-text="$t('MENU.MEMBER.POINT_MANAGER')"></a>
          </li>
        </ul>
      </AppHeaderMenuList>
      <AppHeaderMenuList :icon="'/public/icons/menu-eyes.svg'">
        <ul class="list">
          <li class="list__list-item">
            <router-link to="/series-list" @click.native="closeMenu" v-text="$t('MENU.SERIES_LIST')"></router-link>
          </li>
          <li class="list__list-item">
            <router-link to="/editors" @click.native="closeMenu" v-text="$t('MENU.EDITORS')"></router-link>
          </li>
        </ul>
      </AppHeaderMenuList>
      <AppHeaderMenuList :icon="'/public/icons/menu-info.svg'">
        <ul class="list">
          <li class="list__list-item">
            <router-link to="/about" @click.native="closeMenu" v-text="$t('MENU.ABOUT')"></router-link>
          </li>
          <li class="list__list-item">
            <router-link :to="`/profile/${ANNOUNCEMENT_ACCOUNT_ID}`" @click.native="closeMenu" v-text="$t('MENU.ANNOUNCEMENT')"></router-link>
          </li>
          <li class="list__list-item">
            <a :href="`https://${MM_SITE_DOMAIN}`" target="_blank" rel="noopener" @click="closeMenu" v-text="$t('MENU.MM')"></a>
          </li>
        </ul>
      </AppHeaderMenuList>
      <AppHeaderMenuList :icon="'/public/icons/menu-plus.svg'">
        <div class="social-links">
          <img class="social-links__icon" src="/public/icons/menu-fb.svg" alt="" @click="linkTo(URL_FB_FANPAGE)">
          <img class="social-links__icon" src="/public/icons/menu-ig.svg" alt="" @click="linkTo(URL_IG)">
          <img class="social-links__icon" src="/public/icons/menu-twitter.svg" alt="" @click="linkTo(URL_TWITTER)">
        </div>
      </AppHeaderMenuList>
    </section>
  </div>
</template>

<script>
import { get, filter, } from 'lodash'
import AppHeaderMenuList from 'src/components/header/AppHeaderMenuList.vue'
import { removeToken, redirectToLogin, } from 'src/util/services'
import { getFullUrl, } from 'src/util/comm'
import { ROLE_MAP, MM_SITE_DOMAIN, ANNOUNCEMENT_ACCOUNT_ID, URL_FB_FANPAGE, URL_TWITTER, URL_IG, } from 'src/constants'

const logout = (store) => {
  return store.dispatch('LOGOUT', {})
}

export default {
  props: {
    isMenuOpen: {
      type: Boolean,
      default: false,
    },
  },
  components: {
    AppHeaderMenuList,
  },
  data () {
    return {
      MM_SITE_DOMAIN,
      ANNOUNCEMENT_ACCOUNT_ID,
      URL_FB_FANPAGE,
      URL_TWITTER,
      URL_IG,
    }
  },
  computed: {
    memberIsLoggedIn () {
      return this.$store.state.isLoggedIn
    },
    memberIconUrl () {
      return get(this.$store.state, [ 'profile', 'profileImage', ]) || '/public/icons/menu-member.svg'
    },
    memberIcon () {
      return this.memberIsLoggedIn ? getFullUrl(this.memberIconUrl) : '/public/icons/menu-member.svg'
    },
    memberRole () {
      return get(filter(ROLE_MAP, { key: get(this.$store, 'state.profile.role',), }), [ 0, 'route', ], 'member')
    },
  },
  methods: {
    closeMenu () {
      this.$emit('update:isMenuOpen', false)
    },
    memberActionTo (path) {
      if (path === '/login/register') {
        location && location.replace(path)
        return
      }

      if (!this.memberIsLoggedIn) {
        redirectToLogin(path === '/login' ? this.$route.fullPath : path)
        return
      }

      if (path === '/login') {
        this.memberActionLogout()
      } else {
        /* use location.replace rather than this.$router.push
        *  to navigate member's route params(e.g. `/${this.memberRole}/profile-edit`) correctly
        *  since we only check member's route params in beforeMount()
        */
        location && location.replace(path)
      }
      this.closeMenu()
    },
    memberActionRedirectToLogin () {
      redirectToLogin(this.$route.fullPath)
    },
    memberActionLogout () {
      logout(this.$store).then(() => {
        const domain = get(this.$store, 'state.setting.DOMAIN')
        return removeToken(domain).then(() => {
          this.memberActionRedirectToLogin()
        })
      })
    },
    linkTo (url) {
      const openWindow = window.open(url)
      openWindow.opener = null
      this.closeMenu()
    },
  },
}
</script>

<style lang="stylus" scoped>
.menu-container
  position fixed
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
  &--open
    visibility visible
    opacity 1
  &__dimmed
    position absolute
    top 0
    left 0
    bottom 0
    right 0
    width 100%
    height 100%
    background-color rgba(0, 0, 0, .6)
  &__menu
    position absolute
    top 0
    right -78%
    width 78%
    height 100%
    background-color #ddcf21
    transition right 0.35s ease-out
    display flex
    flex-direction column
    justify-content center
    &--open
      right 0
      
.list
  list-style none
  margin 0
  padding 0
  &__list-item
    text-align center
    font-size 15px
    & + &
      margin 8px 0 0 0
    a
      display inline-block
      color black
      cursor pointer
      &:not(:first-child)
        border-left 1px solid black
        margin 0 0 0 10px
        padding 0 0 0 10px

.social-links
  position relative
  left 2px
  &__icon
    height 20px
    & + &
      margin 0 0 0 20px
</style>

