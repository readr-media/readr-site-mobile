<template>
  <div class="notification-dropbox">
    <div class="notification-dropbox__header">
      <div class="notification-dropbox__header__title"><span v-text="$t('NOTIFICATION.TITLE')"></span></div>
      <div class="notification-dropbox__header__btn">
        <span v-text="$t('NOTIFICATION.READ_ALL')" @click="read(map(notificationItems, (n, i) => `${i}`))"></span>
      </div>    
    </div>
    <div class="notification-dropbox__items">
      <div class="notification-dropbox__item" :class="{ never: !get(item, 'read') }" v-for="(item, index) in notificationItems" @click="read(`${index}`)">
        <div class="notification-dropbox__item__avatar-img">
          <img :src="getImageUrl(get(item, 'profile_image'), 'mobile')" v-if="isClientSide">
        </div>
        <div class="notification-dropbox__item__content">
          <div class="message">
            <NotificationMessage :item="item"></NotificationMessage>
          </div>
          <div class="datetime"><span v-text="dateDiffFromNow(get(item, 'timestamp'))"></span></div>
        </div>
      </div>    
    </div>
  </div>
</template>
<script>
  import { dateDiffFromNow, isClientSide, isDescendant, getImageUrl, } from 'src/util/comm'
  import { get, map, } from 'lodash'
  import NotificationMessage from 'src/components/header/NotificationMessage.vue'
  const debug = require('debug')('CLIENT:NotificationDropbox')
  const updatePubSub = (store, params) => {
    return store.dispatch('UPDATE_NOTIFICATION_STATUS', { params, })
  }  
  export default {
    name: 'NotificationDropbox',
    components: {
      NotificationMessage,
    },
    computed: {
      isClientSide,
    },
    methods: {
      dateDiffFromNow (date) {
        const Y = date.substr(0, 4)
        const M = date.substr(4, 2)
        const D = date.substr(6, 2)
        const h = date.substr(8, 2)
        const m = date.substr(10, 2)
        const s = date.substr(12, 2)
        return dateDiffFromNow(`${Y}-${M}-${D} ${h}:${m}:${s}`)
      },
      get,
      getImageUrl,
      map,
      read (ids) {
        debug('Go into send ack to puc/sub center.')
        updatePubSub(this.$store, {
          ids: [ ...ids, ],
        }).then((res) => {
          debug(res)
          if ([ ...ids, ].length === 1) {
            debug(`/${get(this.notificationItems, [ ids, 'object_type', ])}/${get(this.notificationItems, [ ids, 'object_id', ])}`)
            this.$emit('update:isBoxActive', false)
            switch (get(this.notificationItems, [ ids, 'object_type', ])) {
              case 'project':
                this.$router.push(`/series/${get(this.notificationItems, [ ids, 'object_slug', ])}`)
                break
              case 'memo':
                this.$router.push(`/series/${get(this.notificationItems, [ ids, 'object_slug', ])}/${get(this.notificationItems, [ ids, 'object_id', ])}`)
                break
              case 'report':
                this.$router.push(`/project/${get(this.notificationItems, [ ids, 'object_slug', ])}`)
                break
              case '':
                this.$router.push(get(this.notificationItems, [ ids, 'object_name', ]))
                break
              default:
                this.$router.push(`/${get(this.notificationItems, [ ids, 'object_type', ])}/${get(this.notificationItems, [ ids, 'object_id', ])}`)
            }
          } else {
           this.$emit('updateNotification') 
          }
        })
      },      
    },
    mounted () {
      window.addEventListener('touchmove', (event) => {
        const targ = event.target
        const is_descendant = isDescendant(targ, { parent: this.$el, })
        if (is_descendant && this.isBoxActive) {
          document.body.classList.add('locked')
        } else {
          document.body.classList.remove('locked')    
        }
      })      
    },
    props: {
      isBoxActive: {
        type: Boolean,
        default: false,
      },
      notificationItems: {
        type: Array,
        default: [],
      },
    },    
  }
</script>
<style lang="stylus" scoped>
  .notification-dropbox
    background-color #e6e6e6
    border-top solid 1px #d3d3d3
    border-bottom solid 1px #d3d3d3
    padding-bottom 35px
    overflow auto
    // > div:not(:last-child)
      // border-bottom 1px solid #d3d3d3
    > div
      border-top 1px solid #d3d3d3
    &__header
      height 26px
      width 100%
      display flex
      justify-content space-between
      padding 5px 10px
      background-color #fff
      &__title
        font-size 0.75rem
        font-weight normal
        font-style normal
        font-stretch normal
        line-height normal
        letter-spacing normal
        text-align left
        color #808080
      &__btn
        font-size 0.75rem
        font-weight normal
        font-style normal
        font-stretch normal
        line-height normal
        letter-spacing normal
        text-align left
        color #11b8c9
    &__item
      padding 5px 0
      min-height 50px
      width 100%
      display flex
      background-color #fff
      &.never
        background-color #e6e6e6
      &:not(:last-child)
        border-bottom 1px solid #d3d3d3
      &__avatar-img
        width 40px
        min-height 50px
        margin 0 10px
        img
          width 100%
          height 100%
          object-fit contain
          object-position center
      &__content
        // flex 1
        width calc(100% - 40px)
        min-width 200px
        display flex
        flex-direction column
        justify-content center
        line-height 1.125rem
        padding-right 18px
        .message
          color #444746
          font-weight 300
          font-size 0.75rem
        .datetime
          color #808080
          font-size 0.75rem      

</style>