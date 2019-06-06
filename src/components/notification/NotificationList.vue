<template>
  <div class="notification-list" />
</template>
<script>
export default {
  name: 'NotificationList',
  props: {
    items: {
      type: Array,
      default: () => []
    }
  }
}
</script>
