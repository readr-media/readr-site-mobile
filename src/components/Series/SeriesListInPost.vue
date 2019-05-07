<template>
  <div class="series-in-post">
    <ListItem
      v-for="item in series"
      :key="item.id"
      :description="item.ogDescription || item.description"
      :href="`/series/${item.slug}`"
      :image="item.ogImage ||item.heroImage || ' '"
      :target="'_blank'"
      :title="item.title" />
  </div>
</template>
<script>
import ListItem from '../ListItem/ListItem.vue'

export default {
  name: 'SeriesListInPost',
  props: {
    series: {
      type: Array,
      default: () => [],
    },
  },
  components: {
    ListItem,
  },
}
</script>
<style lang="stylus" scoped>

</style>
