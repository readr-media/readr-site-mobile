<template>
  <ol class="list">
    <ListItem
      v-for="(item, i) in items"
      :key="i"
      class="list__list-item"
      :item="item"
    />
  </ol>
</template>

<script>
import ListItem from './ListItem.vue'

export default {
  components: {
    ListItem
  },
  props: {
    items: {
      type: Array,
      default: () => []
    }
  }
}
</script>

<style lang="stylus" scoped>
.list
  list-style none
  margin 0
  padding 0
  display flex
  flex-wrap wrap
  position relative
  top -16px
  left -10px
  width calc(100% + 10px)
  &__list-item
    margin 16px 0 0 10px
</style>
