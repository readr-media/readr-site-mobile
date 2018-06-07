<template>
  <a :href="reportUrl" target="_blank" class="reportBlock">
    <div class="reportBlock__content">
      <div class="reportBlock__img"><img :src="get(report, 'heroImage') || '/public/icons/readr-logo.png'" :alt="get(report, 'title')"></div>
      <div class="reportBlock__info">
        <h3 v-if="report.project.title" v-text="report.project.title"></h3>
        <h2 v-text="get(report, 'title')"></h2>
        <p v-text="get(report, 'description')"></p>
        <div>
          <div class="reportBlock__info-comment">
            <img src="/public/icons/comment-quote.png">
            <CommentCount class="reportBlock__info-comment-count"></CommentCount>
          </div>
          <div class="reportBlock__info-views">
            <img src="/public/icons/view-blue.png">
            <span v-text="report.views || 0"></span>
          </div>
          <!-- <div v-if="isLoggedIn" class="follow-icon" @click="toogleFollow($event)">
            <img class="follow-icon__thumbnail" :src="isFollow ? '/public/icons/star-blue.png' : '/public/icons/star-line-blue.png'" alt="follow">
            <span class="follow-icon__hint" v-text="$t('FOLLOWING.FOLLOW')"></span>
          </div> -->
        </div>
      </div>
    </div>
    <CommentContainer :class="`reportBlock__comment hidden report-${get(report, [ 'id' ])}`" v-if="showComment" :asset="reportUrl"></CommentContainer> 
  </a>
</template>
<script>
  import { get, } from 'lodash'
  import { getReportUrl, } from 'src/util/comm'
  import CommentCount from 'src/components/comment/CommentCount.vue'
  import CommentContainer from 'src/components/comment/CommentContainer.vue' 
  
  export default {
    name: 'ReportBlock',
    components: {
      CommentCount,
      CommentContainer,
    },
    data () { 
      return { 
        showComment: false,
        resource: 'report',
      } 
    },
    props: {
      report: {
        type: Object,
        required: true,
      },
    },
    computed: {
      reportUrl () {
        if (this.report.slug) {
          return getReportUrl(this.report.slug)
        }
        return '/'
      },
      isLoggedIn () {
        return this.$store.state.isLoggedIn
      },
      isFollow () {
        // return this.$store.state.isLoggedIn && this.postFollowers.indexOf(this.$store.state.profile.id) !== -1
        return false
      },
    },
    methods: {
      $_reportBlock_renderComment (id) {
        if (event) event.preventDefault()
        document.querySelector(`.reportBlock__comment.report-${id}`).classList.toggle('hidden')
        !this.showComment && (this.showComment = true) 
      },
      toogleFollow (event) {
        if (event) event.preventDefault()
        // if (!this.$store.state.isLoggedIn) {
        //   alert('please login first')
        // } else {
        //   if (!this.isFollow) {
        //     publishAction(this.$store, {
        //       action: 'follow',
        //       resource: this.resource,
        //       subject: this.$store.state.profile.id,
        //       object: this.postId,
        //     })
        //     updateStoreFollowingByResource(this.$store, {
        //       action: 'follow',
        //       resource: this.resource,
        //       resourceId: this.postId,
        //       userId: this.$store.state.profile.id,
        //     })
        //   } else {
        //     publishAction(this.$store, {
        //       action: 'unfollow',
        //       resource: this.resource,
        //       subject: this.$store.state.profile.id,
        //       object: this.postId,
        //     })
        //     updateStoreFollowingByResource(this.$store, {
        //       action: 'unfollow',
        //       resource: this.resource,
        //       resourceId: this.postId,
        //       userId: this.$store.state.profile.id,
        //     })
        //   }
        // }
      },
      get,
    },
  }
</script>
<style lang="stylus" scoped>
  .reportBlock
    display block
    color black
    padding 9.5px 14.5px
    background-color #fff
    border-bottom 1px solid #d3d3d3
    &:first-of-type
      border-top 3px solid #ddcf21
    &:last-of-type
      border-bottom none
    &__content
      display flex
    &__img
      position relative
      display block
      width 70px
      margin 0 10px 0 0
      font-size 0
      &::before
        content ''
        display block
        padding-top 100%
        height 0
      img
        position absolute
        top 0
        width 100%
        height 100%
        object-fit cover
        object-position 50% 50%
    &__info
      flex 1
      display flex
      flex-direction column
      justify-content space-between
      padding 2px 0 0 0
      h2
        margin 0 0 5px
        font-size .8125rem
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
      h3
        margin 0 0 3px
        color #808080
        font-size .625rem
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
        color #11b8c9
        span
          position relative
          top 3px
          left -3px
    &__comment
      &.hidden
        display none

  .follow-icon
    cursor pointer
    margin 0 0 0 25px
    &__thumbnail
      width 25px
      height 25px
      margin-left 4.5px
      cursor pointer
    &__hint
      position relative
      // right 5px
      bottom 2px
      font-size 14px
      -webkit-font-smoothing antialiased
      -moz-font-smoothing antialiased
      color #11b8c9
      font-weight 600

  @media (min-width 768px)
    .reportBlock
      &:first-of-type
        border-top none
      &:last-of-type
        margin-bottom 20px
      &__img
        width 50%
        &::before
          padding-top 56.25%
      &__info
        padding 0 0 0 15px
        h2
          font-size 1.125rem
        p
          display block
          margin 0
          max-height 4.21875rem
          font-size .9375rem
          text-overflow ellipsis
          line-height 1.5
          overflow hidden
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