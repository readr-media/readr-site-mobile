<template>
  <div class="notification-message">
    <template v-if="get(item, 'event_type') === 'comment_comment'">
      <span class="notification-message--commenter" v-text="get(item, 'nickname')"></span>
      <span class="notification-message--action" v-text="$t('NOTIFICATION.REPLY_AS_WELL')"></span>
      <span class="notification-message--owner" v-text="get(item, 'object_name')"></span>
      <span class="notification-message--string" v-text="$t('NOTIFICATION.WHOS')"></span>
      <span class="notification-message--post-type" v-text="$t(`NOTIFICATION.POST_TYPE.${get(item, 'post_type')}`)"></span>    
    </template>
    <template v-else-if="get(item, 'event_type') === 'comment_reply'">
      <span class="notification-message--commenter" v-text="get(item, 'nickname')"></span>
      <span class="notification-message--action" v-text="$t('NOTIFICATION.REPLY_TO_YOU')"></span>
      <span class="notification-message--string" v-text="$t('NOTIFICATION.AT')"></span>
      <span class="notification-message--owner" v-text="get(item, 'object_name')"></span>
      <span class="notification-message--post-type" v-text="$t(`NOTIFICATION.POST_TYPE.${get(item, 'post_type')}`)"></span>    
      <span class="notification-message--string" v-text="$t('NOTIFICATION.WHOS_COMMENT')"></span>
    </template>
    <template v-else-if="get(item, 'event_type') === 'comment_reply_author'">
      <span class="notification-message--owner" v-text="get(item, 'object_name')"></span>
      <span class="notification-message--action" v-text="$t('NOTIFICATION.REPLY_TO_YOU')"></span>
      <span class="notification-message--string" v-text="$t('NOTIFICATION.AT_WHOS')"></span>
      <span class="notification-message--post-type" v-text="$t(`NOTIFICATION.POST_TYPE.${get(item, 'post_type')}`)"></span>    
      <span class="notification-message--string" v-text="$t('NOTIFICATION.WHOS_COMMENT')"></span>
    </template>
    <template v-else-if="get(item, 'event_type') === 'follow_member_reply' || get(item, 'event_type') === 'follow_post_reply'">
      <span class="notification-message--commenter" v-text="get(item, 'nickname')"></span>
      <span class="notification-message--action" v-text="$t('NOTIFICATION.REPLY')"></span>
      <span class="notification-message--owner" v-text="get(item, 'object_name')"></span>
      <span class="notification-message--string" v-text="$t('NOTIFICATION.WHOS')"></span>
      <span class="notification-message--post-type" v-text="$t(`NOTIFICATION.POST_TYPE.${get(item, 'post_type')}`)"></span>    
    </template>
    <template v-else-if="get(item, 'event_type') === 'follow_project_reply'">
      <span class="notification-message--commenter" v-text="get(item, 'nickname')"></span>
      <span class="notification-message--action" v-text="$t('NOTIFICATION.REPLY')"></span>
      <span class="notification-message--owner" v-text="get(item, 'object_name')"></span>
    </template>
    <template v-else-if="get(item, 'event_type') === 'follow_memo_reply'">
      <span class="notification-message--commenter" v-text="get(item, 'nickname')"></span>
      <span class="notification-message--action" v-text="$t('NOTIFICATION.REPLY')"></span>
      <span class="notification-message--owner" v-text="get(item, 'object_name')"></span>
      <span class="notification-message--string" v-text="$t('NOTIFICATION.WHOS')"></span>
      <span class="notification-message--string" v-text="$t('NOTIFICATION.MEMO')"></span>
    </template>
    <template v-else-if="get(item, 'event_type') === 'follow_project_post'">
      <span class="notification-message--commenter" v-text="get(item, 'nickname')"></span>
      <span class="notification-message--string" v-text="$t('NOTIFICATION.AT')"></span>
      <span class="notification-message--owner" v-text="get(item, 'object_name')"></span>
      <span class="notification-message--action" v-text="$t('NOTIFICATION.PUBLISH')"></span>
      <span class="notification-message--post-type" v-text="$t(`NOTIFICATION.POST_TYPE.${get(item, 'post_type')}`)"></span>    
    </template>
    <template v-else-if="get(item, 'event_type') === 'post_reply'"> 
      <span class="comment--commenter" v-text="get(item, 'nickname')"></span> 
      <span class="comment--string" v-text="$t('NOTIFICATION.GIVE_FEEDBACK_TO_YOUR_PUBLISH')"></span>    
      <span class="comment--post-type" v-text="$t(`NOTIFICATION.POST_TYPE.${get(item, 'post_type')}`)"></span>   
    </template>
  </div>
</template>
<script>
  import { get, } from 'lodash'
  // const debug = require('debug')('CLIENT:NotificationMessage')
  export default {
    name: 'NotificationMessage',
    methods: {
      get,
    },
    props: {
      item: {
        type: Object,
        default: {},
      },
    },
  }
</script>
<style lang="stylus" scoped>
  .notification-message
    white-space nowrap
    overflow hidden
    text-overflow ellipsis
    &--commenter, &--owner, &--post-type
      font-weight bold
</style>