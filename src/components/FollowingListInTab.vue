<template>
  <section class="followingListInTab">
    <nav class="followingListInTab__nav">
      <div
        :class="{ active: resource === 'member' }"
        @click="$_followingListInTab_handleResource('member')">
        <span v-text="$t('FOLLOWING.GUEST_EDITOR')"></span>
      </div>
      <div
        :class="{ active: resource === 'post' && resourceType === 'review' }"
        @click="$_followingListInTab_handleResource('review')">
        <span v-text="`${$t('FOLLOWING.FOLLOW')}${$t('FOLLOWING.REVIEW')}`"></span>
      </div>
      <div
        :class="{ active: resource === 'post' && resourceType === 'news' }"
        @click="$_followingListInTab_handleResource('news')">
        <span v-text="`${$t('FOLLOWING.FOLLOW')}${$t('FOLLOWING.NEWS')}`"></span>
      </div>
      <div
        :class="{ active: resource === 'project' }"
        @click="$_followingListInTab_handleResource('project')">
        <span v-text="`${$t('FOLLOWING.FOLLOW')}${$t('FOLLOWING.PROJECT')}`"></span>
      </div>
    </nav>
    <!-- <pagination-nav></pagination-nav> -->
    <div class="followingListInTab__list">
      <div v-for="follow in followingByUser" :key="follow.id" class="followingListInTab__item" :class="resource">
        <div class="followingListInTab__img">
          <div v-if="resource === 'member'" class="followingListInTab__img-member" :style="{ backgroundImage: `url(${$_followingListInTab_getImage(follow)})` }"></div>
          <template v-if="!isProfilePage">
            <button @click="$_followingListInTab_unfollow(follow.id)"><img src="/public/icons/star-grey.png"></button>
          </template>
          <template v-else-if="isProfilePage && isLoggedIn">
            <button @click="$_followingListInTab_toggleFollow(follow.id, $_followingListInTab_isFollow(follow.id))"><img :src="$_followingListInTab_isFollow(follow.id) ? '/public/icons/star-grey.png' : '/public/icons/star-line-grey.png'"></button>
          </template>
        </div>
        <div class="followingListInTab__content" :class="resource">
          <h2 v-if="resource === 'member'" v-text="follow.nickname"></h2>
          <h2 v-if="resource !== 'member'" v-text="follow.title"></h2>
          <p v-if="$_followingListInTab_getDescription(follow)" v-text="$_followingListInTab_getDescription(follow)"></p>
        </div>
        <div v-if="resource === 'project'" class="followingListInTab__og" :style="{ backgroundImage: `url(${$_followingListInTab_getImage(follow)})` }"></div>
      </div>
      <span v-if="followingByUser.length === 0" v-text="`${$t('FOLLOWING.NO_RECORD')}${alertText}`"></span>
    </div>
  </section>
</template>
<script>
  import { filter, find, get, } from 'lodash'
  import PaginationNav from './PaginationNav.vue'

  const getFollowing = (store, { subject = get(store, 'state.profile.id'), resource = 'member', resourceType = '', } = {}) => {
    return store.dispatch('GET_FOLLOWING_BY_USER', {
      subject: subject,
      resource: resource,
      resource_type: resourceType,
    })
  }

  const publishAction = (store, { action, resource = 'member', object, }) => {
    return store.dispatch('FOLLOW', {
      params: {
        action: action,
        resource: resource,
        subject: get(store, 'state.profile.id'),
        object: object,
      },
    })
  }

  const updateStoreFollowingByUser = (store, { action, resource = 'member', object, item, }) => {
    return store.dispatch('UPDATE_FOLLOWING_BY_USER', {
      params: {
        action: action,
        resource: resource,
        resourceId: object,
        userId: get(store, 'state.profile.id'),
        item: item,
      },
    })
  }

  export default {
    name: 'FollowingListInTab',
    components: {
      'pagination-nav': PaginationNav,
    },
    data () {
      return {
        resource: 'member',
        resourceType: '',
      }
    },
    computed: {
      alertText () {
        switch (this.resource) {
          case 'member':
            return this.$t('FOLLOWING.GUEST_EDITOR')
          case 'post':
            if (this.resourceType === 'review') {
              return this.$t('FOLLOWING.REVIEW')
            }
            return this.$t('FOLLOWING.NEWS')
          case 'project':
            return this.$t('FOLLOWING.PROJECT')
        }
      },
      isLoggedIn () {
        return this.$store.state.isLoggedIn
      },
      isProfilePage () {
        return get(this.$route, 'fullPath', '').split('/')[1] === 'profile'
      },
      followingByUser () {
        if (this.isProfilePage) {
          if (this.resource === 'member') {
            return filter(get(this.$store, [ 'state', 'followingByUser', get(this.$route, 'params.id'), ], []), o => o.id !== get(this.$store, 'state.profile.id'))
          }
          return get(this.$store, [ 'state', 'followingByUser', get(this.$route, 'params.id'), ], [])
        }
        return get(this.$store, [ 'state', 'followingByUser', get(this.$store, 'state.profile.id'), ], [])
      },
    },
    beforeMount () {
      if (this.isProfilePage) {
        Promise.all([ getFollowing(this.$store), getFollowing(this.$store, { subject: Number(get(this.$route, 'params.id')), }), ])
      } else {
        getFollowing(this.$store)
      }
    },
    methods: {
      $_followingListInTab_getDescription (follow) {
        switch (this.resource) {
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
            return get(follow, [ 'description', ])
        }
      },
      $_followingListInTab_getImage (follow) {
        let image
        switch (this.resource) {
          case 'member':
            image = get(follow, [ 'profileImage', ]) || `/public/icons/exclamation.png`
            break
          default:
            image = get(follow, [ 'heroImage', ])
        }
        if (image) {
          return image
        }
        return ' '
      },
      $_followingListInTab_handleResource (type) {
        switch (type) {
          case 'review':
            this.resource = 'post'
            this.resourceType = 'review'
            if (this.isProfilePage) {
              return Promise.all([
                getFollowing(this.$store, { resource: this.resource, resourceType: this.resourceType, }),
                getFollowing(this.$store, { subject: Number(get(this.$route, 'params.id')), resource: this.resource, resourceType: this.resourceType, }),
              ])
            } else {
              return getFollowing(this.$store, { resource: this.resource, resourceType: this.resourceType, })
            }
          case 'news':
            this.resource = 'post'
            this.resourceType = 'news'
            if (this.isProfilePage) {
              return Promise.all([
                getFollowing(this.$store, { resource: this.resource, resourceType: this.resourceType, }),
                getFollowing(this.$store, { subject: Number(get(this.$route, 'params.id')), resource: this.resource, resourceType: this.resourceType, }),
              ])
            } else {
              return getFollowing(this.$store, { resource: this.resource, resourceType: this.resourceType, })
            }
          default:
            this.resource = type
            this.resourceType = ''
            if (this.isProfilePage) {
              return Promise.all([
                getFollowing(this.$store, { resource: this.resource, }),
                getFollowing(this.$store, { subject: Number(get(this.$route, 'params.id')), resource: this.resource, }),
              ])
            } else {
              return getFollowing(this.$store, { resource: this.resource, })
            }
        }
      },
      $_followingListInTab_isFollow (id) {
        return find(get(this.$store, [ 'state', 'followingByUser', get(this.$store, 'state.profile.id'), ]), { id: id, })
      },
      $_followingListInTab_toggleFollow (id, isFollow) {
        if (isFollow) {
          publishAction(this.$store, { action: 'unfollow', resource: this.resource, object: id, })
          .then(() => {
            updateStoreFollowingByUser(this.$store, { action: 'unfollow', resource: this.resource, object: id, })
          })
        } else {
          const item = find(this.followingByUser, { id: id, })
          publishAction(this.$store, { action: 'follow', resource: this.resource, object: id, })
          .then(() => {
            updateStoreFollowingByUser(this.$store, { action: 'follow', resource: this.resource, object: id, item: item, })
          })
        }
      },
      $_followingListInTab_unfollow (id) {
        publishAction(this.$store, { action: 'unfollow', resource: this.resource, object: id, })
        .then(() => {
          updateStoreFollowingByUser(this.$store, { action: 'unfollow', resource: this.resource, object: id, })
        })
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
    
  &__img
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
      max-height calc(.8125rem * 2.6)
      margin 0
      padding-top 4px
      font-size .8125rem
      line-height 1.3
      overflow hidden
      text-overflow ellipsis
    p
      max-height 48px
      margin-top 5px
      margin-bottom 0
      font-size 12px
      text-align justify
      line-height 16px
      overflow hidden
      text-overflow ellipsis
      word-break break-all
    &.project
      display flex
      height 100px
      flex-direction column
      justify-content space-between

  &__og
    width 100px
    height 100px
    margin-left 15px
    background-size cover
    background-position center center

</style>
