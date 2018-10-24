<template>
  <section class="tag-nav">
    <div v-if="!shouldTagShowAction" class="tag-nav__hashtag">#</div>
    <ul :class="[ 'tag-nav__list', { 'tag-nav__list--expanded': shouldTagShowAction } ]">
      <TagItem
        :class="[ 'tag-nav__tag-item', { 'tag-nav__tag-item--expanded': shouldTagShowAction } ]"
        v-for="tag in tags"
        :key="tag.id"
        :tag="tag"
        :shouldShowAction="shouldTagShowAction"
      />
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
    shouldTagShowAction: {
      type: Boolean,
      default: false, // false in most cases, e.g. TagNav at the bottom of a post
    },
  },
  components: {
    TagItem,
  },
}
</script>

<style lang="stylus" scoped>
.tag-nav
  display flex
  &__hashtag
    font-size 24px
    font-weight 600
    margin 0 5px 0 0
    padding 4px 0 0 0
    color #11b8c9
    line-height 1
  &__list
    list-style none
    margin 0
    padding 0
    display flex
    flex-wrap wrap
    width calc(100% - 25px)
    &--expanded
      width 100%
  &__tag-item
    display flex !important
    margin 2.5px
    max-width 100%
    width auto !important
    &--expanded
      width 100% !important
</style>
