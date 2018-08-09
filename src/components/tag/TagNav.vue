<template>
  <section class="tag-nav">
    <ul class="tag-nav__list">
      <TagItem class="tag-nav__tag-item" v-for="tag in tags" :key="tag.id" :tag="tag"/>
    </ul>
  </section>
</template>

<script>
import TagItem from './TagItem.vue'

export default {
  name: 'TagNav',
  props: {
    tags: {
      default: () => [],
    },
  },
  components: {
    TagItem,
  },
}
</script>

<style lang="stylus" scoped>
.tag-nav
  &__list
    list-style none
    margin 0
    padding 0
  &__tag-item
    display flex !important
    & + &
      margin 10px 0 0 0
</style>
