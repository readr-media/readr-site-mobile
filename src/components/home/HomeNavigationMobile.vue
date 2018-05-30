<template>
  <section class="homeNavigationMobile">
    <nav>
      <div
        v-if="reports.length !== 0"
        class="homeNavigationMobile__item"
        :class="{ active: active === 'report' }"
        @click="$_homeNavigationMobile_changePanel('report')">
        <span v-text="$t('HOME_NAV.REPORT')"></span>
      </div>
      <!-- <div
        v-if="video && videoLink"
        class="homeNavigationMobile__item"
        :class="{ active: active === 'video' }"
        @click="$_homeNavigationMobile_changePanel('video')">
        <span v-text="$t('homeNavigation.WORDING_HOME_NAV_VIDEO')"></span>
      </div> -->
      <div
        v-if="memos.length !== 0"
        class="homeNavigationMobile__item"
        :class="{ active: active === 'memo' }"
        @click="$_homeNavigationMobile_changePanel('memo')">
        <span v-text="$t('HOME_NAV.MEMO')"></span>
      </div>
    </nav>
    <div class="homeNavigationMobile__content">
      <template v-if="active === 'report'">
        <ReportBlock v-for="r in reports" :key="r.id" :report="r"></ReportBlock>
      </template>
      <!-- <template v-if="active === 'video' && videoLink">
        <div class="homeNavigationMobile__video">
          <iframe :src="videoLink" frameborder="0" allowfullscreen></iframe>
        </div>
      </template> -->
      <template v-if="active === 'memo'">
        <MemoFigure v-for="m in memos" :key="m.id" :memo="m"></MemoFigure>
      </template>
    </div>
  </section>
</template>
<script>
  import { currentYPosition, elmYPosition, } from 'kc-scroll'
  import { get, } from 'lodash'
  import { getReportUrl, } from 'src/util/comm'
  import CommentCount from '../../components/comment/CommentCount.vue'
  import ReportBlock from '../../components/ReportBlock.vue'
  import MemoFigure from '../../components/projects/MemoFigure.vue'

  export default {
    name: 'HomeNavigationMobile',
    components: {
      CommentCount,
      MemoFigure,
      ReportBlock,
    },
    props: {
      memos: {
        type: Array,
        required: true,
      },
      reports: {
        type: Array,
        required: true,
      },
      video: {
        required: true,
      },
    },
    data () {
      return {
        active: 'report',
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
      window.addEventListener('scroll', this.$_homeNavigationMobile_handleScroll)
    },
    beforeDestroy () {
      window.removeEventListener('scroll', this.$_homeNavigationMobile_handleScroll)
    },
    methods: {
      $_homeNavigationMobile_changePanel (active) {
        this.active === active ? this.active = undefined : this.active = active
      },
      $_homeNavigationMobile_handleScroll () {
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
      },
      get,
      projectUrl (slug) {
        if (slug) {
          return getReportUrl(slug)
        }
        return '/'
      },
    },
  }
</script>
<style lang="stylus" scoped>
  .homeNavigationMobile
    margin-top 20px
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
