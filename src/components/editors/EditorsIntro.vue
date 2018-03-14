<template>
  <li class="editors-intro-main">
    <figure class="editors-intro-main__profile">
      <img class="editors-intro-main__thumbnail" :src="editor.profileImage || '/public/icons/exclamation.png'" alt="">
      <figcaption class="editors-intro-main__meta-container">
        <img class="editors-intro-main__follow-icon" v-if="editorIsNotCurrentUser" :src="isFollow ? '/public/icons/star-blue.png' : '/public/icons/star-line-blue.png'" alt="follow" @click="toogleFollow">
      </figcaption>
    </figure>
    <div class="editors-intro-main__info">
      <p class="editors-intro-main__nickname" v-text="editor.nickname"></p>
      <p class="editors-intro-main__description" v-text="trimDescription ? descritpionTrim : editor.description"></p>
    </div>
  </li>
</template>

<script>
const publishAction = (store, data) => {
  return store.dispatch('PUBLISH_ACTION', {
    params: data
  })
}
const updateStoreFollowingByResource = (store, { action, resource, resourceId, userId }) => {
  store.dispatch('UPDATE_FOLLOWING_BY_RESOURCE', {
    params: {
      action: action,
      resource: resource,
      resourceId: resourceId,
      userId: userId
    }
  })
}

export default {
  props: {
    editor: {
      type: Object,
      require: true
    },
    trimDescription: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    isFollow () {
      return this.$store.state.isLoggedIn && this.editorFollowers.indexOf(this.$store.state.profile.id) !== -1
    },
    editorFollowers () {
      if (this.$store.state.isLoggedIn) {
        const editorFollowersData = _.find(this.$store.state.followingByResource['member'], { resourceid: `${this.editor.id}` })
        return editorFollowersData ? editorFollowersData.follower : []
      } else {
        return []
      }
    },
    editorIsNotCurrentUser () {
      return !this.$store.state.isLoggedIn || this.$store.state.profile.id !== this.editor.id
    },
    descritpionTrim () {
      const limit = 30
      if (this.editor.description) {
        return this.editor.description.length > limit ? this.editor.description.slice(0, limit) + ' ...' : this.editor.description
      } else {
        return ''
      }
    }
  },
  methods: {
    toogleFollow () {
      if (!this.$store.state.isLoggedIn) {
        alert('please login first')
      } else {
        if (!this.isFollow) {
          publishAction(this.$store, {
            action: 'follow',
            resource: 'member',
            subject: this.$store.state.profile.id,
            object: `${this.editor.id}`
          })
          updateStoreFollowingByResource(this.$store, {
            action: 'follow',
            resource: 'member',
            resourceId: this.editor.id,
            userId: this.$store.state.profile.id
          })
        } else {
          publishAction(this.$store, {
            action: 'unfollow',
            resource: 'member',
            subject: this.$store.state.profile.id,
            object: `${this.editor.id}`
          })
          updateStoreFollowingByResource(this.$store, {
            action: 'unfollow',
            resource: 'member',
            resourceId: this.editor.id,
            userId: this.$store.state.profile.id
          })
        }
      }
    }
  }
}
</script>

<style lang="stylus" scoped>
.editors-intro-main
  display flex
  align-items flex-start
  margin-bottom 15px
  
  &__profile
    display flex
    flex-direction column
    margin 0
  &__thumbnail
    r = 50px
    width r
    height r
    border-radius r
  &__meta-container
    display flex
    justify-content center
    align-items center
    margin-top 5px
  &__follow-icon
    cursor pointer
    width 25px
    height 25px
  &__description
    font-size 14px
    font-weight 300
    text-align justify
    line-height 1.5
    margin 3px 0 0 0
  &__info
    margin-left 5px
  &__nickname
    margin 0
    font-size 15px
</style>

