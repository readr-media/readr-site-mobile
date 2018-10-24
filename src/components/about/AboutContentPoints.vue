<template>
  <section class="about-points">
    <div class="about-points__close" @click="clickClose">
      <img src="/public/icons/shutdown.jpg" alt="">
    </div>
    <section class="about-points__content content">
      <img class="content__title" src="/public/about-points/title.png" alt="">
      <ol class="content__articles-list articles-list">
        <li
          class="articles-list__list-item list-item"
          v-for="(content, index) in pointsIntroContent"
          :key="index"
        >
          <div class="list-item__title">
            <img :src="`/public/about-points/q${index + 1}.png`" alt="">
            <h1 v-text="TITLES[index]"></h1>
          </div>
          <div class="list-item__content" v-html="content"></div>
        </li>
      </ol>
    </section>
    <footer class="about-points__footer" v-html="FOOTER_MESSAGE"></footer>
  </section>
</template>

<script>
import { get, filter, } from 'lodash'
import { ROLE_MAP, } from 'src/constants'
import { createPointsIntroContent, TITLES, FOOTER_MESSAGE, } from 'src/constants/pointsIntro'

export default {
  data () {
    return {
      TITLES,
      FOOTER_MESSAGE,
    }
  },
  computed: {
    memberCenter () {
      return get(filter(ROLE_MAP, { key: get(this.$store, 'state.profile.role',), }), [ 0, 'route', ], 'member')
    },
    pointsIntroContent () {
      return createPointsIntroContent(this.memberCenter)
    },
  },
  methods: {
    clickClose () {
      this.$emit('clickClose')
    },
  },
}
</script>

<style lang="stylus" scoped>
.about-points
  position fixed
  top 0
  left 0
  z-index 1000
  width 100%
  height 100vh
  background-color white
  overflow-x hidden
  overflow-y auto
  &__close
    position absolute
    top 0
    right 0
    z-index 10
    width 50px
    cursor pointer
    img 
      width 100%
  &__footer
    height 55px
    background-color #444746
    display flex
    justify-content center
    align-items center
    padding 0 30px
    line-height 1.4
    & >>> p
      margin 0
      color white
      font-size 15px
      font-weight 600
      a
        color #ddcf21

.content
  padding 42px 5px
  &__title
    width 100%
  &__articles-list
    margin 11px 0 0 0
    padding 0 10px
    list-style none

.articles-list
  &__list-item
    & + &
      margin 20px 0 0 0

.list-item
  &__title
    display flex
    align-items flex-end
    img
      width 38px
    h1
      font-size 15px
      font-weight 600
      margin 0 0 0 10px
      color #444746
  &__content
    margin 10px 0 0 0
    color #444746
    & >>> h2
      font-size 11px
      font-weight normal
      letter-spacing .5px
      margin 25px 0
      color white
      span
        display inline-block
        padding 5px
        background-color #11b8c9
    & >>> p
      font-size 11px
      line-height 1.5
      letter-spacing .5px
      text-align justify
      margin 5px 0
      &.more-margin
        margin 25px 0
      &.bold
        font-weight 600
      a
        color #11b8c9
        text-decoration underline
      .lock-icon
        height 11.5px
        margin 0 5px
      .donate-icon
        height 20px
        margin 0 5px
        position relative
        top 3px
</style>

