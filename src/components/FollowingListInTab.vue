<template>
  <section class="followingListInTab">
    <nav class="followingListInTab__nav">
      <div
        :class="[ currentResource === 'member' ? 'active' : '' ]"
        @click="$_followingListInTab_resourceHandler('member')">
        <span v-text="$t('follow.WORDING_FOLLOW_LIST_GUEST_EDITOR')"></span>
      </div>
      <div
        :class="[ currentResource === 'review' ? 'active' : '' ]"
        @click="$_followingListInTab_resourceHandler('review')">
        <span v-text="`${$t('follow.WORDING_FOLLOW_LIST_FOLLOW')}${$t('follow.WORDING_FOLLOW_LIST_REVIEW')}`"></span>
      </div>
      <div
        :class="[ currentResource === 'news' ? 'active' : '' ]"
        @click="$_followingListInTab_resourceHandler('news')">
        <span v-text="`${$t('follow.WORDING_FOLLOW_LIST_FOLLOW')}${$t('follow.WORDING_FOLLOW_LIST_NEWS')}`"></span>
      </div>
      <div
        :class="[ currentResource === 'project' ? 'active' : '' ]"
        @click="$_followingListInTab_resourceHandler('project')">
        <span v-text="`${$t('follow.WORDING_FOLLOW_LIST_FOLLOW')}${$t('follow.WORDING_FOLLOW_LIST_PROJECT')}`"></span>
      </div>
    </nav>
    <!-- <pagination-nav></pagination-nav> -->
    <div class="followingListInTab__list">
      <div v-for="follow in followingByUser" :key="follow.id" class="followingListInTab__item" :class="currentResource">
        <div class="followingListInTab__img">
          <div v-if="currentResource === 'member'" class="followingListInTab__img-member" :style="{ backgroundImage: `url(${follow.profileImage})` }"></div>
          <button @click="$_followingListInTab_unfollow(follow.id)"><img src="/public/icons/star-grey.png"></button>
        </div>
        <div class="followingListInTab__content" :class="currentResource">
          <h2 v-if="currentResource === 'member'" v-text="follow.nickname"></h2>
          <h2 v-if="currentResource !== 'member'" v-text="follow.title"></h2>
          <p v-if="$_followingListInTab_getDescription(follow)" v-text="$_followingListInTab_getDescription(follow)"></p>
        </div>
        <div v-if="currentResource === 'project'" class="followingListInTab__og"></div>
      </div>
    </div>
  </section>
</template>
<script>
  import _ from 'lodash'
  import PaginationNav from './PaginationNav.vue'

  export default {
    name: 'FollowingListInTab',
    components: {
      'pagination-nav': PaginationNav,
    },
    props: {
      currentResource: {
        type: String,
        required: true,
      },
      followingByUser: {
        type: Array,
        required: true,
      },
    },
    methods: {
      $_followingListInTab_getDescription (follow) {
        switch (this.currentResource) {
          case 'member': {
            return _.get(follow, [ 'description', ])
          }
          case 'post': {
            const parser = new DOMParser()
            const html = parser.parseFromString(follow.content, 'text/html')
            const origin = Array.from(html.querySelectorAll('p'))
              .filter((node) => {
                return node.innerHTML !== '<br>'
              })
              .map((node) => {
                return node.innerHTML.replace(/<[^>]*>/g, "")
              })
              .join('')
            return origin
          }
          default:
            return ''
        }
      },
      $_followingListInTab_resourceHandler (resource) {
        this.$emit('changeResource', resource)
      },
      $_followingListInTab_unfollow (id) {
        this.$emit('unfollow', this.currentResource, id)
      },
    },
  }
</script>
<style lang="stylus" scoped>

.followingListInTab
  width 100%
  min-height 100%
  margin 0 auto
  &__nav
    div
      display inline-block
      height 15px
      padding 0
      margin 0 5px
      color #a8a8a8
      font-size .8125rem
      background transparent
      border none
      outline none
      &.active
        color #000
        &::before
          content ''
          width 0
          height 0
          margin-right 3px
          font-size 0
          line-height 0
          vertical-align super
          border-style solid
          border-width 6px 0 6px 10px
          border-color transparent transparent transparent #ddcf21
        span
          border-bottom 1px solid #000
  &__list
    margin-top 25px
  &__item
    display flex
    align-items flex-start
    margin-bottom 15px
    &:last-of-type
      margin-bottom 0
    &.review
      .followingListInTab__img
        width 25px
        height 25px
        text-align left
      .followingListInTab__content
        h2
          height 25px
          line-height 25px
  &__img
    width 45px
    text-align center
    > div
      width 45px
      height 45px
      background-position center
      background-size cover
      background-repeat no-repeat
      border 1px solid #979797
      border-radius 50%
    > button
      width 25px
      height 25px
      padding 0
      
      text-align center
      background transparent
      border none
      outline none
      img 
        width 100%
    &-member
      margin-bottom 10px
  &__content
    flex 1
    margin-left 10px
    h2
      display inline-block
      margin 0
      font-size .9375rem
      line-height 20px
    p
      margin-top 2px
      margin-bottom 0
      font-size .875rem
      text-align justify
      line-height 1.4
  &__og
    width 175px
    height 92px
    margin-left 15px

</style>
