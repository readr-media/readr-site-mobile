<template>
  <footer
    :class="$route.name"
    class="footer"
  >
    <div class="footer__top app-content-area">
      <ul class="footer__links-list links-list">
        <li class="links-list__list-item">
          <router-link
            class="link"
            to="/about"
          >
            關於我們
          </router-link>
        </li>
        <!-- <li class="links-list__list-item">
          <router-link
            class="link"
            to="/agreement"
          >
            隱私政策
          </router-link>
        </li> -->
        <!-- <li class="links-list__list-item">
          <router-link
            class="link"
            to="/agreement"
          >
            服務條款
          </router-link>
        </li> -->
        <!-- <li class="links-list__list-item">
          <router-link
            class="link"
            to="/agreement"
          >
            版權所有
          </router-link>
        </li> -->
        <li class="links-list__list-item">
          <a
            class="link"
            href="mailto:readr@readr.tw"
          >
            聯絡我們
          </a>
        </li>
      </ul>
    </div>
    <div class="footer__bottom app-content-area">
      <ul class="footer__links-icon-list links-icon-list">
        <li class="links-icon-list__list-item">
          <a
            :href="URL_FB_FANPAGE"
            target="_blank"
            rel="noopener"
          >
            <img
              v-lazy="'/public/2.0/icons/fb.png'"
              alt=""
            >
          </a>
        </li>
        <li class="links-icon-list__list-item">
          <a
            :href="URL_TWITTER"
            target="_blank"
            rel="noopener"
          >
            <img
              v-lazy="'/public/2.0/icons/twitter.png'"
              alt=""
            >
          </a>
        </li>
        <li class="links-icon-list__list-item">
          <a
            :href="URL_IG"
            target="_blank"
            rel="noopener"
          >
            <img
              v-lazy="'/public/2.0/icons/ig.png'"
              alt=""
            >
          </a>
        </li>
        <li class="links-icon-list__list-item">
          <a
            :href="URL_MM"
            target="_blank"
            rel="noopener"
          >
            <img
              v-lazy="'/public/2.0/icons/mm.png'"
              alt=""
            >
          </a>
        </li>
      </ul>
    </div>
  </footer>
</template>

<script>
import {
  URL_FB_FANPAGE,
  URL_TWITTER,
  URL_IG,
  URL_MM
} from 'src/constants'

export default {
  data () {
    return {
      URL_FB_FANPAGE,
      URL_TWITTER,
      URL_IG,
      URL_MM
    }
  }
}
</script>

<style lang="stylus" scoped>
.footer
  padding 1em 0
  background-color #fff
  &__bottom
    margin .5em auto 0

.link
  font-size 12px
  font-weight 500
  color black

.links-list
  list-style none
  margin 0
  padding 0
  display flex
  // flex-wrap wrap
  justify-content center
  &__list-item
    width calc(100% / 3)
    height 20px
    display flex
    justify-content center
    align-items center
    border-left 1px solid #979797
    margin .4em 0
    &:nth-child(3n)
      border-right 1px solid #979797
    &:nth-last-child(1)
      border-right 1px solid #979797

.links-icon-list
  list-style none
  margin 0
  padding 0
  display flex
  justify-content center
  &__list-item
    & + &
      margin 0 0 0 20px
    img
      width 30px
      height 30px

@media (min-width: 768px)
  .footer
    &.home
      > div
        width calc(80% - 40px) !important
        max-width 1000px
</style>
