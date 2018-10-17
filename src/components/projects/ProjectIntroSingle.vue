<template>
  <div class="project-single-intro">
    <div class="project-single-intro__container">
      <div class="project-single-intro__heroimg">
        <img :src="getFullUrl(get(project, 'heroImage'))">
      </div>
      <div class="follow" @click="clickFollow">
        <img class="follow__icon" :src="isFollowed ? '/public/icons/star-blue.png' : '/public/icons/star-line-blue.png'" alt="">
        <span class="follow__hint" v-text="`${$t('FOLLOWING.FOLLOW')}${$t('FOLLOWING.PROJECT')}`"></span>
      </div>
      <div class="project-single-intro__title">
        <span v-text="title"></span>
      </div>
      <div class="project-single-intro__desc">
        <span v-text="desc"></span>
      </div>
    </div>
    <div class="project-single-intro__comment">
      <AppArticleNav
        :showFollow="false"
        :resource="'project'"
        :postId="project.id"
        :commentCount="project.commentAmount || 0"
      />
    </div>
  </div>
</template>
<script>
import AppArticleNav from 'src/components/AppArticleNav.vue'
import { get, } from 'lodash'
import { getFullUrl, } from 'src/util/comm'
import { mapState, } from 'vuex'
// const debug = require('debug')('CLIENT:ProjectIntroSingle')

const publishAction = (store, data) => store.dispatch('FOLLOW', { params: data, })
const switchOn = (store, message) => store.dispatch('LOGIN_ASK_TOGGLE', { active: true, message, type: 'GO_LOGIN', })
const toogleFollowingByUserStat = (store, { resource, resourceType = '', targetId, }) => {
  return store.commit('TOOGLE_FOLLOWING_BY_USER_STAT', {
    params: {
      resource,
      resourceType,
      targetId,
    },
  })
}

export default {
  name: 'ProjectIntroSingle',
  components: {
    AppArticleNav,
  },
  computed: {
    ...mapState({
      projectFollowingByUser: state => get(state.followingByUserStats, [ 'project', ], {}),
    }),
    project () {
      return get(this.$store, 'state.publicProjectSingle', {})
    },
    desc () {
      return get(this.project, 'description', '')
    },
    title () {
      return get(this.project, 'title')
    },
    isLoggedIn () {
      return this.$store.state.isLoggedIn
    },
    isFollowed () {
      return this.$store.state.isLoggedIn && get(this.projectFollowingByUser, this.project.id, false)
    },
  },
  methods: {
    get,
    getFullUrl,
    // TODO: Refactor following to a component like ButtonFollow.vue
    clickFollow () {
      if (this.isLoggedIn) {
        this.toogleFollow()
      } else {
        switchOn(this.$store, this.$t('POST_CONTENT.HINT.FOLLOW_WITH_LOGIN'))
      }
    },
    toogleFollow () {
      if (this.isFollowed) {
        publishAction(this.$store, {
          action: 'unfollow',
          resource: 'project',
          subject: this.$store.state.profile.id,
          object: this.project.id,
        })
      } else {
        publishAction(this.$store, {
          action: 'follow',
          resource: 'project',
          subject: this.$store.state.profile.id,
          object: this.project.id,
        })
      }

      toogleFollowingByUserStat(this.$store, { resource: 'project', targetId: this.project.id, })
    },
  },
  mounted () {},
  props: {
    projSlug: {
      type: String,
    },
  },
}
</script>
<style lang="stylus" scoped>
.project-single-intro
  width 100%
  // min-height 205px
  margin-bottom 10px
  position relative
  background-color #fff
  &__container
    background-position center left
    background-size cover
    background-repeat no-repeat
    padding 0 0 20px
    width 100%
    height 100%
    font-size 0.9375rem
    line-height 1.5625rem
    font-weight normal
    position relative
    > div:not(:first-child)
      margin-top 10px
      padding 0 15px
    > div:not(:last-child)
      margin-bottom 10px
    > div:first-child
      margin-bottom 20px      
    > div
      position relative
      z-index 1
    &::before
      background-image linear-gradient(45deg, rgba(255,255,255,1) 0%,rgba(255,255,255,1) 28%,rgba(255,255,255,0) 100%);
      content ''
      display block
      position absolute
      width 100%
      height 100%
      top 0
      left 0
  &__heroimg
    width 100%
    display block
    margin-bottom 25px
    img
      width 100%
      vertical-align middle
  &__title
    font-size 1.25rem
    font-weight 600
    line-height normal
  &__comment
    padding 0 15px

.follow
  margin 0
  &__icon
    d = 25px
    width d
    height d
    cursor pointer
  &__hint
    font-size 14px
    color #11b8c9
    margin 0 0 0 5px
    position relative
    bottom 2px
</style>