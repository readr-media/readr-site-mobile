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
      <div
        v-if="video && videoLink"
        class="homeNavigationMobile__item"
        :class="{ active: active === 'video' }"
        @click="$_homeNavigationMobile_changePanel('video')">
        <span v-text="$t('homeNavigation.WORDING_HOME_NAV_VIDEO')"></span>
      </div>
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
      <template v-if="active === 'video' && videoLink">
        <div class="homeNavigationMobile__video">
          <iframe :src="videoLink" frameborder="0" allowfullscreen></iframe>
        </div>
      </template>
      <template v-if="active === 'projectsDone'">
        <div v-for="p in projectsDone" :key="p.id" class="homeNavigationMobile__project">
          <div class="homeNavigationMobile__project-content">
            <a class="homeNavigationMobile__project-img" href=""><img :src="get(p, [ 'ogImage' ])" :alt="get(p, [ 'title' ])"></a>
            <div class="homeNavigationMobile__project-info">
              <h2><a href="" v-text="get(p, [ 'title' ])"></a></h2>
              <div>
                <div
                  class="homeNavigationMobile__project-info-comment"
                  @click="$_homeNavigationMobile_renderComment(get(p, [ 'id' ]))">
                  <img src="/public/icons/comment-blue.png">
                  <CommentCount class="homeNavigationMobile__project-info-comment-count"></CommentCount>
                </div>
                <div class="homeNavigationMobile__project-info-views">
                  <img src="/public/icons/view-blue.png">
                  <span></span>
                </div>
              </div>
            </div>
          </div>
          <div class="homeNavigationMobile__project-comment hidden" :class="`project-${get(p, [ 'id' ])}`"></div>
        </div>
      </template>
    </div>
  </section>
</template>
<script>
  import { SITE_DOMAIN_DEV, } from '../../../src/constants'
  import { get, } from 'lodash'
  import { renderComment, } from '../../../src/util/talk'
  import CommentCount from '../../components/comment/CommentCount.vue'

  export default {
    name: 'HomeNavigationMobile',
    components: {
      CommentCount,
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
    },
    methods: {
      $_homeNavigationMobile_changePanel (active) {
        this.active === active ? this.active = undefined : this.active = active
      },
      $_homeNavigationMobile_renderComment (id) {
        document.querySelector(`.homeNavigationMobile__project-comment.project-${id}`).classList.toggle('hidden')
        const rendered = document.querySelector(`.homeNavigationMobile__project-comment.project-${id} iframe`)
        if (window.Coral && !rendered) {
          renderComment(this.$el, `.homeNavigationMobile__project-comment.project-${id} > .comment`, `${location.protocol}//${SITE_DOMAIN_DEV}/post/${id}`)
        }
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
    &__project
      padding 15px
      background-color #fff
      border-bottom 1px solid #d3d3d3
      &:last-of-type
        border-bottom none
      &-content
        display flex
      &-img
        position relative
        display block
        width 50%
        font-size 0
        &::before
          content ''
          position absolute
          top 0
          left 0
          bottom 0
          right 0
          width 100%
          padding-top 66.66%
        img
          width 100%
          height 100%
          object-fit cover
          object-position 50% 50%
      &-info
        display flex
        flex-direction column
        justify-content space-between
        width 50%
        padding 2px 0 0 10px
        h2
          margin 0
          font-size .9375rem
          line-height 1.5
          a
            display block
            max-width 100%
            max-height calc(.9375rem * 3)
            color #000
            vertical-align top
            text-align justify
            text-overflow ellipsis
            overflow hidden
        > div
          display flex
        &-comment, &-views
          img
            width 25px
            height 25px
        &-comment
          &-count
            position relative
            right 3px
            bottom -3px
            color #11b8c9
        &-views
          margin-left 35px
      &-comment
        &.hidden
          display none

        
        
</style>
