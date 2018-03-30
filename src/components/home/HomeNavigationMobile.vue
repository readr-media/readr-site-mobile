<template>
  <section class="homeNavigationMobile">
    <nav>
      <div
        v-if="projectsInProgress.length !== 0"
        class="homeNavigationMobile__item"
        :class="{ active: active === 'projectsInProgress' }"
        @click="$_homeNavigationMobile_changePanel('projectsInProgress')">
        <span v-text="`${$t('homeNavigation.WORDING_HOME_NAV_IN_PROGRESS')}${$t('homeNavigation.WORDING_HOME_NAV_PROJECT')}`"></span>
      </div>
      <!-- <div
        v-if="video && videoLink"
        class="homeNavigationMobile__item"
        :class="{ active: active === 'video' }"
        @click="$_homeNavigationMobile_changePanel('video')">
        <span v-text="$t('homeNavigation.WORDING_HOME_NAV_VIDEO')"></span>
      </div> -->
      <div
        v-if="projectsDone.length !== 0"
        class="homeNavigationMobile__item"
        :class="{ active: active === 'projectsDone' }"
        @click="$_homeNavigationMobile_changePanel('projectsDone')">
        <span v-text="$t('homeNavigation.WORDING_HOME_NAV_PROJECT')"></span>
      </div>
    </nav>
    <div class="homeNavigationMobile__content">
      <template v-if="active === 'projectsInProgress'">
        <div v-for="p in projectsInProgress" :key="p.id" class="homeNavigationMobile__progress">
          <div class="homeNavigationMobile__progress-title" v-text="p.title"></div>
          <div class="homeNavigationMobile__progress-percentage" v-text="`0%`"></div>
          <div class="homeNavigationMobile__progress-donate"><img src="/public/icons/encoruage-white.png" alt=""></div>
        </div>
      </template>
      <!-- <template v-if="active === 'video' && videoLink">
        <div class="homeNavigationMobile__video">
          <iframe :src="videoLink" frameborder="0" allowfullscreen></iframe>
        </div>
      </template> -->
      <template v-if="active === 'projectsDone'">
        <ProjectBlock v-for="p in projectsDone" :key="p.id" :project="p"></ProjectBlock>
      </template>
    </div>
  </section>
</template>
<script>
  import { currentYPosition, elmYPosition, } from 'kc-scroll'
  import { get, } from 'lodash'
  import CommentCount from '../../components/comment/CommentCount.vue'
  import ProjectBlock from '../../components/ProjectBlock.vue'

  export default {
    name: 'HomeNavigationMobile',
    components: {
      CommentCount,
      ProjectBlock,
    },
    props: {
      projectsDone: {
        type: Array,
        required: true,
      },
      projectsInProgress: {
        type: Array,
        required: true,
      },
      video: {
        required: true,
      },
    },
    data () {
      return {
        active: undefined,
      }
    },
    computed: {
      isStream () {
        return get(this.video, [ 'type', ]) === 3
      },
      videoLink () {
        return get(this.video, [ 'link', ])
      },
    },
    mounted () {
      this.isStream ? this.active = 'video' : ''
      window.addEventListener('scroll', () => {
        if (this.active) {
          const headerHeight = document.querySelector(`.header`).offsetHeight
          const contentHeight = document.querySelector(`.homeNavigationMobile__content`).offsetHeight
          switch (this.active) {
            case 'video':
              currentYPosition() + headerHeight + contentHeight / 2 > elmYPosition('.homeNavigationMobile__content') + contentHeight ? this.active = undefined : ''
              break
            default:
              currentYPosition() + headerHeight > elmYPosition('.homeNavigationMobile__content') ? this.active = undefined : ''
          }
        }
      })
    },
    methods: {
      $_homeNavigationMobile_changePanel (active) {
        this.active === active ? this.active = undefined : this.active = active
      },
      get,
    },
  }
</script>
<style lang="stylus" scoped>
  .homeNavigationMobile
    margin-bottom 20px
    nav
      display flex
      background-color #fff
    &__item
      flex 1
      position relative
      height 30px
      text-align center
      &.active
        background-color #ddcf21
        &::before
          content ''
          position absolute
          bottom -10px
          width 0
          height 0
          transform translateX(-50%)
          border-style solid
          border-width 10px 5px 0 5px
          border-color #ddcf21 transparent transparent transparent
      &:last-of-type
        span
          border-right none
      span
        display block
        width 100%
        height 15px
        margin 7.5px 0
        font-size .9375rem
        line-height 1
        border-right 1px solid #d3d3d3
    &__progress
      display flex
      border-bottom 1px solid #d3d3d3
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
        background-color #ddcf21
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

  @media (min-width 768px)
    .homeNavigationMobile
      margin-bottom 0
      nav
        position absolute
        top 80px
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
            top 50%
            right -10px
            bottom auto
            width 0
            height 0
            transform translateY(-50%)
            border-style solid
            border-width 5px 0 5px 10px
            border-color transparent transparent transparent #ddcf21
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
      &__progress
        &:last-of-type
          margin-bottom 20px
      &__video
        margin-bottom 20px
        
</style>
