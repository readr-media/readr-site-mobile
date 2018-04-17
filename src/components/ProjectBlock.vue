<template>
  <a :href="projectUrl" target="_blank" class="projectBlock">
    <div class="projectBlock__content">
      <div class="projectBlock__img"><img :src="get(project, [ 'heroImage' ])" :alt="get(project, [ 'title' ])"></div>
      <div class="projectBlock__info">
        <h2 v-text="get(project, [ 'title' ])"></h2>
        <p v-text="get(project, [ 'description' ])"></p>
        <div>
          <div
            class="projectBlock__info-comment"
            @click="$_projectBlock_renderComment(get(project, [ 'id' ]), $event)">
            <img src="/public/icons/comment-blue.png">
            <CommentCount class="projectBlock__info-comment-count"></CommentCount>
          </div>
          <div class="projectBlock__info-views">
            <img src="/public/icons/view-blue.png">
            <span></span>
          </div>
        </div>
      </div>
    </div>
    <div class="projectBlock__comment hidden" :class="`project-${get(project, [ 'id' ])}`">
      <div class="comment"></div>
    </div>
  </a>
</template>
<script>
  import { get, } from 'lodash'
  import { renderComment, } from '../../src/util/talk'
  import { getProjectUrl, } from 'src/util/comm'
  import CommentCount from '../components/comment/CommentCount.vue'
  
  export default {
    name: 'ProjectBlock',
    components: {
      CommentCount,
    },
    props: {
      project: {
        type: Object,
        required: true,
      },
    },
    computed: {
      projectUrl () {
        if (this.project.slug) {
          return getProjectUrl(this.project.slug)
        }
        return '/'
      },
    },
    methods: {
      $_projectBlock_renderComment (id, event) {
        if (event) event.preventDefault()
        document.querySelector(`.projectBlock__comment.project-${id}`).classList.toggle('hidden')
        const rendered = document.querySelector(`.projectBlock__comment.project-${id} iframe`)
        if (window.Coral && !rendered) {
          renderComment(this.$el, `.projectBlock__comment.project-${id} > .comment`, `/post/${id}`, this.$store.state.setting.TALK_SERVER)
        }
      },
      get,
    },
  }
</script>
<style lang="stylus" scoped>
  .projectBlock
    display block
    color black
    padding 15px
    background-color #fff
    border-bottom 1px solid #d3d3d3
    &:last-of-type
      border-bottom none
    &__content
      display flex
    &__img
      position relative
      display block
      width 50%
      font-size 0
      &::before
        content ''
        display block
        padding-top 66.66%
        height 0
      img
        position absolute
        top 0
        width 100%
        height 100%
        object-fit cover
        object-position 50% 50%
    &__info
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
      p
        display none
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
    &__comment
      &.hidden
        display none

  @media (min-width 768px)
    .projectBlock
      &:last-of-type
        margin-bottom 20px
      &__img
        &::before
          padding-top 56.25%
      &__info
        padding 0 0 0 15px
        h2
          font-size 1.125rem
        p
          display block
          margin 0
          font-size .9375rem
          line-height 1.5
          a
            display block
            max-width 100%
            max-height calc(.9375rem * 4.5)
            color #000
            vertical-align top
            text-align justify
            text-overflow ellipsis
            overflow hidden
</style>