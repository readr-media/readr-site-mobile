<template>
  <div class="notification" tabIndex="0" @click="toggle" @focusout="focusout">
    <div class="notification__light" :class="{ on: isBoxActive }" v-if="notReadYetCount !== 0"><span v-text="notReadYetCount"></span></div>
    <div class="notification__light bell" v-else></div>
    <NotificationDropbox class="notification__dropbox"
      @updateNotification="updateNotification"
      :class="{ hide: !isBoxActive }"
      :notificationItems="notificationItems"
      :notReadYetCount="notReadYetCount"
      :isBoxActive.sync="isBoxActive"></NotificationDropbox>
  </div>
</template>
<script>
  import NotificationDropbox from 'src/components/header/NotificationDropbox.vue'
  import { filter, get, map, throttle, } from 'lodash'
  const debug = require('debug')('CLIENT:Notification')
  const fetchNotification = (store, { id, }) => {
    debug('Go get it!')
    store.dispatch('GET_NOTIFICATION', { id, })
  }
  export default {
    name: 'Notification',
    components: {
      NotificationDropbox,
    },
    computed: {
      currPath () {
        return get(this.$route, 'fullPath')
      },      
      currUser () {
        return get(this.$store, 'state.profile.id')
      },
      notificationItems () {
        return map(get(this.$store, 'state.notification', []), n => (JSON.parse(n)))
      },
      notReadYetCount () {
        return filter(this.notificationItems, { read: false, }).length || 0
      },
    },
    data () {
      return {
        isBoxActive: false,
      }
    },
    methods: {
      focusout () {
        this.isBoxActive = false
      },
      toggle () {
        this.isBoxActive = !this.isBoxActive
        if (!this.isBoxActive) {
          this.updateNotification()
        }
      },
      updateNotification () {
        debug('Got event updateNotification.')
        throttle(() => Promise.all([
          fetchNotification(this.$store, { id: this.currUser, }),
        ]), 100, { leading: false, })()
      },      
    },
    beforeMount () {
      Promise.all([
        fetchNotification(this.$store, { id: this.currUser, }),
      ])
    },
    mounted () {
      this.$el.ondragstart = function () { return false }
      this.$el.onselectstart = function () { return false }
    },
    watch: { 
      currPath () { 
        debug('Mutation detected: currPath.')
        this.updateNotification() 
      }, 
    }, 
  }
</script>
<style lang="stylus" scoped>
  .notification
    outline none
    &__light
      background-color #d0021b
      width 18px
      height 18px
      border-radius 50%
      color #fff
      font-size 0.625rem
      display flex
      justify-content center
      align-items center
      position relative
      &:after
        width 2px
        height 33px
        position absolute
        top 18px
        background-color #d0021b
        display block
        z-index 2
      &.on
        &:after
          content ''
      &.bell
        background-color transparent
        background-image url(/public/icons/bell.png)
        background-position center center
        background-size contain
        background-repeat no-repeat
        height 20px
        &:after
          content none
    &__dropbox
      position fixed
      top 40px
      padding-top 20px
      left 0
      width 100vw
      height calc(100vh - 40px)
      &.hide
        display none

</style>