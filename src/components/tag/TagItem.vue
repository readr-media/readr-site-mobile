<template>
  <li class="tag-item">
    <div :class="[ 'tag-item__tag', { 'tag-item__tag--less-border-radius': showRelatedsList }, 'tag' ]">
      <router-link
        :to="`/tag/${tag.id}`"
        :class="[ 'tag__header', { 'tag__header--less-border-radius': showRelatedsList }, { 'tag__header--smaller': !shouldShowAction } ]"
      >
        <span :class="[ 'tag__text', { 'tag__text--smaller': !shouldShowAction } ]" v-text="tag.text"></span>
        <span v-if="shouldShowAction" class="tag__action tag-action">
          <img
            :src="isFollowed ? '/public/icons/star-blue.png' : '/public/icons/star-line-blue.png'"
            @click.prevent="clickFollow"
          >
          <span
            v-if="shouldShowActionTooltip"
            :class="[ 'tag-action__tooltip', { 'tag-action__tooltip--toogled': showActionTooltip } ]"
            v-text="isFollowed ? $t('FOLLOWING.FOLLOW_TAG') : $t('FOLLOWING.UNFOLLOW_TAG') "
          >
          </span>
        </span>
      </router-link>
      <ul v-if="showRelatedsList" class="tag__relateds-list">
        <div class="tag__category" v-text="$t('TAG_NAV_ASIDE.CATEGORY.PROJECT')"></div>
        <TagItemRelatedsListItem
          v-for="(item, i) in relatedListItems"
          :data="item"
          :key="i"
          class="tag__relateds-list-item"
        />
      </ul>
    </div>
    <!-- TODO: add trending-rank -->
    <p v-if="shouldShowTrendingRank" class="tag-item__trending-rank"></p>
  </li>
</template>

<script>
import TagItemRelatedsListItem from './TagItemRelatedsListItem.vue'
import { get, take, } from 'lodash'
import { mapState, } from 'vuex'

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
  name: 'TagItem',
  props: {
    tag: {
      type: Object,
      required: true,
    },
    shouldShowTrendingRank: {
      type: Boolean,
      default: false,
    },
    shouldShowRelatedsList: {
      type: Boolean,
      default: false,
    },
    // if shouldShowAction is false, TagItem will be smaller
    shouldShowAction: {
      type: Boolean,
      default: true,
    },
    shouldShowActionTooltip: {
      type: Boolean,
      default: false,
    },
  },
  components: {
    TagItemRelatedsListItem,
  },
  data () {
    return {
      showActionTooltip: false,
      relatedListName: 'taggedReports',
      relatedListItemLimit: 3,
    }
  },
  computed: {
    ...mapState({
      userId: state => state.profile.id,
      tagsFollowingByUser: state => get(state.followingByUserStats, 'tag', {}),
    }),
    isFollowed () {
      return get(this.tagsFollowingByUser, this.tag.id, false)
    },
    isLoggedIn () {
      return this.$store.state.isLoggedIn
    },
    isRelatedListExist () {
      return this.relatedListName in this.tag && this.tag[this.relatedListName] !== null
    },
    relatedListItems () {
      return take(get(this.tag, this.relatedListName, []), this.relatedListItemLimit)
    },
    isMouseover () {
      return get(this.$store.state, [ 'tagsIsMouseover', this.tag.id, ], this.isMouseoverLocal)
    },
    showRelatedsList () {
      return this.shouldShowRelatedsList && this.isRelatedListExist
    },
  },
  methods: {
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
          resource: 'tag',
          subject: this.$store.state.profile.id,
          object: this.tag.id,
        })
      } else {
        publishAction(this.$store, {
          action: 'follow',
          resource: 'tag',
          subject: this.$store.state.profile.id,
          object: this.tag.id,
        })
      }
      toogleFollowingByUserStat(this.$store, { resource: 'tag', targetId: this.tag.id, })
      this.toogleFollowTooltip()
    },
    toogleFollowTooltip () {
      this.showActionTooltip = true
      if (this._timer) {
        clearTimeout(this._timer)
      }
      this._timer = setTimeout(() => {
        this.showActionTooltip = false
      }, 1000)
    },
  },
}
</script>

<style lang="stylus" scoped>
.tag-item
  display inline-flex
  align-items flex-start
  width 100%
  &__tag
    line-height 1.5rem
    border 1px solid #11b8c9
    border-radius 20px
    user-select none
    background-color white
    flex 1 1 auto
    &--less-border-radius
      border-radius 8px
  &__trending-rank
    width 22.5px
    min-width 22.5px
    height 24px
    line-height 24px
    font-size 9px
    text-align center
    margin 0 0 0 6px

.tag
  width 100%
  position relative
  &__header
    padding 5px 15.2px 5px 13.5px
    display flex
    justify-content space-between
    align-items center
    border-radius 20px
    background-color white
    color black
    width 100%
    &--less-border-radius
      border-radius 8px
    &--smaller
      padding 0 13.5px
  &__text
    font-size 15px
    font-weight 700
    white-space nowrap
    overflow hidden
    text-overflow ellipsis
    display inline-block
    width 100%
    &--smaller
      font-size 13px
  &__action
    margin-left 5px
    > img
      position relative
      top 3px
      width calc(25px + 15.2px)
      height 25px
      padding-left 15.2px
      border-left 1px solid #d3d3d3
      cursor pointer
  &__relateds-list
    list-style none
    margin 0
    padding 9px 8px 9px 13.5px
    border-top 1px solid #11b8c9
    position relative
    &:before
      content ''
      position absolute
      top 0
      left 30px
      width 0
      height 0
      border-style solid
      border-width 10px 4px 0 4px
      border-color #11b8c9 transparent transparent transparent
    &:after
      content ''
      position absolute
      top -1px
      left 30.5px
      width 0
      height 0
      border-style solid
      border-width 9px 3px 0 3px
      border-color white transparent transparent transparent
  &__relateds-list-item
    & + &
      border-top 1px solid #d3d3d3
  &__category
    position absolute
    top 0
    left -16px
    width 15px
    padding .6em 0 .3em
    color #000
    font-size 11px
    line-height 20px
    letter-spacing .3em
    writing-mode vertical-rl
    background-color #ddcf21
    user-select none
    cursor default
    display flex
    justify-content center
    align-items center

.tag-action
  &__tooltip
    pointer-events none
    padding 1px 2px
    position absolute
    top calc(50% - 75px / 2)
    left calc(50% - 170px / 2)
    width 170px
    height 75px
    font-size 15px
    color #444746
    background-color white
    z-index 100
    display flex
    justify-content center
    align-items center
    opacity 0
    transition opacity .25s
    box-shadow 0.5px 0.5px 1px 0 rgba(0, 0, 0, 0.5)
    // &:before
    //   position absolute
    //   top 2.5px
    //   left -10px
    //   content ''
    //   width 0
    //   height 0
    //   border-style solid
    //   border-width 7px 10px 7px 0
    //   border-color transparent #d3d3d3 transparent transparent
    // &:after
    //   position absolute
    //   top 3.5px
    //   left -9px
    //   content ''
    //   width 0
    //   height 0
    //   border-style solid
    //   border-width 6px 9px 6px 0
    //   border-color transparent white transparent transparent
    &--toogled
      opacity 1
</style>


