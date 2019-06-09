<template>
  <section
    :class="{ empty: notification.length < 1 }"
    class="account-notice"
  >
    <div>
      <template v-if="notification.length > 0">
        <button
          class="read"
          @click="readAll"
        >
          全部標為已讀
        </button>
        <NotificationList :items="notification" />
      </template>
      <template v-else>
        <p>尚未有任何通知</p>
      </template>
    </div>
  </section>
</template>
<script>
import NotificationList from 'src/components/notification/NotificationList.vue'

export default {
  name: 'AccountNotice',
  components: {
    NotificationList
  },
  props: {
    notification: {
      type: Array,
      default: () => []
    }
  },
  methods: {
    readAll () {
      // this.$store.dispatch('DataNotification/UPDATE_NOTIFICATION_STATUS', { params, })
    }
  }
}
</script>
<style lang="stylus" scoped>
.account-notice
  &.empty
    > div
      margin-top 40px
  > div
    display flex
    flex-direction column
  .read
    align-self flex-end
    color #12b8c8
    text-align right
</style>
