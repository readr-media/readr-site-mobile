<template>
  <section class="homeNavigationMobile">
    <nav>
      <router-link class="homeNavigationMobile__item-container" to="/reports">
        <div class="homeNavigationMobile__item">
          <span class="homeNavigationMobile__title-sub" v-text="$t('SECTIONS.PROJECTS')"></span>
          <div class="indicator-icon">
            <div class="indicator-icon__vertical-line"></div>
            <div class="indicator-icon__horizontal-line"></div>
            <div class="indicator-icon__dot"></div>
          </div>
          <span class="homeNavigationMobile__title-main" v-text="$t('HOME_NAV.REPORT')"></span>
        </div>
      </router-link>
      <router-link class="homeNavigationMobile__item-container" to="/memos">
        <div class="homeNavigationMobile__item">
          <span class="homeNavigationMobile__title-sub" v-text="$t('SECTIONS.PROJECTS')"></span>
          <div class="indicator-icon">
            <div class="indicator-icon__vertical-line"></div>
            <div class="indicator-icon__horizontal-line"></div>
            <div class="indicator-icon__dot"></div>
          </div>
          <span class="homeNavigationMobile__title-main" v-text="$t('HOME_NAV.MEMO')"></span>
        </div>
      </router-link>
    </nav>
  </section>
</template>

<script>
  export default {
    name: 'HomeNavigationMobile',
  }
</script>

<style lang="stylus" scoped>
  .homeNavigationMobile
    margin-top 20px
    margin-bottom 10px
    nav
      display flex
      background-color #fff
    &__title-sub
      font-size 12px
      color #808080
    &__title-main
      font-size 15px
      font-weight 600
      color #000000
    &__item-container
      flex 1
      position relative
      padding 5px 0
      height 30px
      display flex
      justify-content center
      align-items center
      & + &
        .homeNavigationMobile__item
          border-left solid .5px #d3d3d3
      // disable seperator if item is after .router-link-exact-active
      .router-link-exact-active + & 
        .homeNavigationMobile__item
          border-left none
    &__item
      width 100%
      position relative
      text-align center
      color black
      display flex
      justify-content center
      align-items center
      span
        display block
        // width 100%
        height 15px
        margin 0
        font-size .9375rem
        line-height 1
    &__progress
      display flex
      border-bottom 1px solid #d3d3d3
      color black
      &:last-of-type
        border-bottom none
      &-title
        flex 1
        padding 10px
        font-size .9375rem
        line-height 20px
        white-space nowrap
        text-overflow ellipsis
        overflow hidden
        background-color #fff
      &-percentage, &-donate
        width 40px
        height 40px
        background-color #11b8c9
      &-percentage
        color #fff
        font-size .9375rem
        text-align center
        line-height 40px
        border-right 1px solid #fff
      &-donate
        position relative
        border-left 1px solid #fff
        img
          position absolute
          top 50%
          left 50%
          transform translate(-50%, -50%)
          width 20px
          height auto
    &__content
      margin-top 10px
    &__video
      position relative
      width 100%
      padding-top 56.25%
      iframe
        position absolute
        top 0
        left 0
        right 0
        width 100%
        height 100%

  .router-link-exact-active
    background-color #ddcf21
    &::before
      content ''
      position absolute
      bottom -10px
      width 0
      height 0
      transform translateX(-50%)
      border-style solid
      border-width 0 7.5px 13px 7.5px
      border-color transparent transparent #ddcf21 transparent
    &::after
      content ''
      position absolute
      bottom -13px
      width 0
      height 0
      transform translateX(-50%)
      border-style solid
      border-width 0 6px 10.4px 6px
      border-color transparent transparent #fff transparent

  .indicator-icon
    display flex
    justify-content center
    align-items center
    margin 0 5px
    &__vertical-line
      height 10px
      border-left 1px solid #808080
    &__horizontal-line
      width 10px
      border-bottom 1px solid #808080
    &__dot
      r = 5px
      width r
      height r
      border-radius r
      background-color #808080

  @media (min-width 768px)
    .homeNavigationMobile
      margin-bottom 0
      nav
        position absolute
        top 0
        left 25px
        flex-direction column
      &__item
        display flex
        justify-content center
        align-items center
        width 30px
        height auto
        &.active
          &::before
            content none
          &::after
            content none
        &:last-of-type
          span
            border-bottom none
        span
          display inline
          width auto
          height 90px
          margin 0
          padding 0 10px
          border-right none
          border-bottom 1px solid #d3d3d3
          writing-mode vertical-lr
      &__content
        margin 0
        border-left 3px solid #ddcf21
      &__progress
        &:last-of-type
          margin-bottom 20px
      &__video
        margin-bottom 20px
        
</style>
