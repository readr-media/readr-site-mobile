<template>
  <section class="videosList">
    <template v-for="video in videos" >
      <div :key="get(video, [ 'id' ])" class="videosList__item">
        <div class="videosList__item-video">
          <iframe src="https://app.straas.net/mirrormedia.mg/videos/ubfT6jiU" frameborder="0" allowfullscreen></iframe>
        </div>
        <div class="videosList__item-info">
          <h2 v-text="get(video, [ 'title' ])"></h2>
          <div class="videosList__item-icons">
            <div
              class="videosList__item-icons-icon comment"
              @click="$_videosList_renderComment(get(video, [ 'id' ]))">
              <img src="/public/icons/comment-blue.png">
              <comment-count class="videosList__item-icons-icon-count" :commentAmount="12345"></comment-count>
            </div>
            <div class="videosList__item-icons-icon">
              <img src="/public/icons/view-blue.png">
              <span class="videosList__item-icons-icon-count">709</span>
            </div>
          </div>
          <app-share-button class="videosList__share"></app-share-button>
        </div>
        <div :class="`videosList__item-comment hidden video-${get(video, [ 'id' ])}`">
          <div class="comment"></div>
        </div>
      </div>
    </template>
  </section>
</template>

<script>
  import { SITE_DOMAIN_DEV } from '../../../src/constants'
  import { get } from 'lodash'
  import { renderComment } from '../../../src/util/talk'
  import AppShareButton from '../../components/AppShareButton.vue'
  import CommentCount from '../../components/comment/CommentCount.vue'

  export default {
    name: 'VideosList',
    components: {
      AppShareButton,
      CommentCount
    },
    props: {
      videos: {
        type: Array,
        default: function () {
          return []
        }
      }
    },
    methods: {
      $_videosList_renderComment (id) {
        document.querySelector(`.videosList__item-comment.video-${id}`).classList.toggle('hidden')
        const rendered = document.querySelector(`.videosList__item-comment.video-${id} iframe`)
        if (!rendered) {
          renderComment(this.$el, `.videosList__item-comment.video-${id} > .comment`, `${location.protocol}//${SITE_DOMAIN_DEV}/post/${id}`)
        }
      },
      get
    }
  }
</script>

<style lang="stylus" scoped>
  .videosList
    width 100%
    background-color #fff
    &__item
      width 100%
      margin-bottom 10px
      h2
        margin 0 0 10px 0
        font-size 15px
        font-weight normal
      &:last-of-type
        margin-bottom 0
      &-video
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
      &-info
        position relative
        padding 10px 15px
      &-icons
        &-icon
          display inline-block
          width auto
          height 25px
          white-space nowrap
          &:not(:first-of-type)
            margin-left 10px
          &.comment
            cursor pointer
          &-count
            position relative
            top 2px
            left -3px
            color #11b8c9
            font-size 14px
            line-height 1
        img
          width 25px
          height 25px
      &-comment
        &.hidden
          display none
    &__share
      position absolute
      top 50%
      right 15px
      transform translate(0, -50%)
      
</style>


