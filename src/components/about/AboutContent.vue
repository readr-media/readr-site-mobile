<template>
  <div class="about">
    <div class="about__close" @click="clickClose">
      <img src="/public/icons/shutdown.jpg" alt="">
    </div>
    <section class="about__welcome">
      <div class="content">
        <img src="/public/icons/join.png" alt="">
        <div>
          <p v-text="$t('ABOUT.WELCOME.PARAGRAPH_1')"></p>
          <h1 v-text="$t('ABOUT.WELCOME.PARAGRAPH_2')"></h1>
          <p v-text="$t('ABOUT.WELCOME.PARAGRAPH_3')"></p>
          <p v-text="$t('ABOUT.WELCOME.PARAGRAPH_4')"></p>
        </div>
      </div>
    </section>
    <section class="about__what-readr about--grid-line">
      <div class="content">
        <img class="title" src="/public/icons/about-title-1.png" alt="">
        <p v-text="$t('ABOUT.WHAT_READR.PARAGRAPH_1')"></p>
        <p v-text="$t('ABOUT.WHAT_READR.PARAGRAPH_2')"></p>
        <div class="text-with-img">
          <div>
            <ul>
              <li v-text="$t('ABOUT.WHAT_READR.PARAGRAPH_3')"></li>
              <li v-text="$t('ABOUT.WHAT_READR.PARAGRAPH_4')"></li>
              <li v-text="$t('ABOUT.WHAT_READR.PARAGRAPH_5')"></li>
              <li v-text="$t('ABOUT.WHAT_READR.PARAGRAPH_6')"></li>
            </ul>
          </div>
          <img src="/public/icons/about-flow.png" alt="">
          <p v-text="$t('ABOUT.WHAT_READR.PARAGRAPH_7')"></p>
        </div>
      </div>
    </section>
    <section class="about__what-guest-editor">
      <div class="content">
        <img class="title" src="/public/icons/about-title-2.png" alt="">
        <p v-text="$t('ABOUT.WHAT_GUEST_EDITOR.PARAGRAPH_1')"></p>
      </div>
    </section>
    <section class="about__how-member about--grid-line">
      <div class="content">
        <img class="title" src="/public/icons/about-title-3.png" alt="">
        <p v-text="$t('ABOUT.HOW_MEMBER.PARAGRAPH_1')"></p>
        <p v-text="$t('ABOUT.HOW_MEMBER.PARAGRAPH_2')"></p>
        <router-link class="to-about-points" to="points" v-text="$t('ABOUT.TO_ABOUT_POINTS')" append></router-link>
      </div>
    </section>
    <section class="about__info">
      <div class="content">
        <p><strong v-text="$t('ABOUT.COMPANY_NAME')"></strong></p>
        <p v-text="$t('ABOUT.COMPANY_ADDRESS')"></p>
        <p v-text="$t('ABOUT.PHONE_NUMBER')"></p>
      </div>
    </section>
  </div>
</template>
<script>
export default {
  name: 'AboutContent',
  methods: {
    clickClose () {
      this.$emit('clickClose')
    },
  },
}
</script>
<style lang="stylus" scoped>
  .about
    padding-top 0 !important
    position fixed
    top 0
    left 0
    right 0
    z-index 1000
    width 100%
    height 100vh
    background-color #11b8c9
    overflow-x hidden
    overflow-y scroll
    -webkit-overflow-scrolling touch
    &__close
      position absolute
      top 0
      right 0
      width 50px
      cursor pointer
      z-index 1
      img 
        width 100%
    &__transparent
      position relative
      z-index 1
      // height 65vh
    &__welcome, &__how-member
      color #fff
      .content
        p
          font-weight 300
    &__welcome
      width 100%
      padding 25px 0
      margin 0 auto
      background-color #11b8c9
      z-index -1
      .content
        display flex
        flex-direction column-reverse
        align-items center
      img
        width 126px
        height auto
        margin 20px 0 0 0
    &__what-readr
      position relative
      z-index 1
      padding 120px 0
      background-color #fff
      clip-path polygon(0% 80px, 0% calc(100% - 80px), 100% 100%, 100% 0%)
      &.about--grid-line
        background-image url(/public/icons/about-grid-white.png)
        background-repeat repeat
        background-size 15px 15px
      .title
        position absolute
        top -100px
        right 5%
        width 132px
        height 114px
      .content
        > div
          margin-top 1em
    &__what-guest-editor
      position relative
      z-index 1
      padding 0
      background-color #d3d3d3
      &:before
        content ''
        position absolute
        top -80px
        left 0
        right 0
        width 100%
        height 80px
        background-color #d3d3d3
        clip-path polygon(0% 0, 100% 78px, 100% 100%, 0% 100%)
      &:after
        content ''
        position absolute
        left 0
        right 0
        bottom -80px
        width 100%
        height 80px
        background-color #d3d3d3
        clip-path polygon(0% 0, 100% 0, 100% calc(100% - 78px), 0% 100%)
      .title
        width 50%
        margin 0 0 9px 0
      .content
        padding-left 10%
    &__how-member
      padding 80px 0 85px 0
      background-color #444746
      clip-path polygon(0% 80px, 0% 100%, 100% 100%, 100% 0%)
      &.about--grid-line
        background-image url(/public/icons/about-grid-black.png)
        background-repeat repeat
        background-size 15px 15px
      .content
        display flex
        flex-direction column
        align-items flex-end
      .title
        width 80%
        margin 0 0 34px 0
    &__info
      padding 15px
      
    .about__info
      .content
        p
          color #fff
          text-align center
          font-weight 300
          & + p
            margin-top .5em
    
    .content
      position relative
      width 100%
      margin 0 auto
      padding 0 15px
      text-align justify
      line-height 1.67
      letter-spacing 1px
      font-size 11px
      h1
        font-size 15px
        font-weight 400
      p
        margin 0
        & + p
          margin-top 1em
      .text-with-img
        display flex
        flex-direction column
        align-items flex-start
        ul
          list-style-type none
          padding 0 0 0 35px
          li
            position relative
            margin-top 1.5em
            &:before
              content ''
              position absolute
              top 0
              left -35px
              width 17px
              height 20px
              background-size auto 20px
              background-repeat no-repeat
              background-position 50% 50%
          li:nth-of-type(1)
            &:before
              background-image url(/public/icons/about-list-first.png)
          li:nth-of-type(2)
            &:before
              background-image url(/public/icons/about-list-second.png)
          li:nth-of-type(3)
            &:before
              background-image url(/public/icons/about-list-third.png)
          li:nth-of-type(4)
            &:before
              background-image url(/public/icons/about-list-fourth.png)
        img
          margin 1.5em 0
          width calc(100% + 16px + 16px)
          position relative
          left -16px

  .to-about-points
    width 100%
    height 30px
    background-color #ddcf21
    color #454746
    display flex
    justify-content center
    align-items center
    margin 16px 0
    letter-spacing .5px
</style>
