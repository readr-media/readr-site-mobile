<template>
  <li class="list-item">
    <a :href="url" target="_blank" class="list-item__link">
      <figure class="figure">
        <img class="figure__img" :src="heroImage" alt="">
        <figcaption class="figure__figcaption">
          <p class="figure__figcaption-title" v-text="title"></p>
        </figcaption>
      </figure>
    </a>
  </li>
</template>

<script>
import { get, } from 'lodash'
import { getReportUrl, } from 'src/util/comm'

export default {
  props: {
    data: {
      type: Object,
      required: true,
    },
  },
  computed: {
    title () {
      return get(this.data, 'title', '')
    },
    heroImage () {
      return get(this.data, 'heroImage', '')
    },
    url () {
      return getReportUrl(get(this.data, 'slug', ''))
    },
  },
}
</script>

<style lang="stylus" scoped>
.list-item
  padding 8.5px 0 10px 0
  &:first-of-type
    padding 6px 0 10px 0
  &__link
    color black

.figure
  display flex
  flex-direction row-reverse
  justify-content space-between
  margin 0
  &__figcaption
    font-size 13px
    padding 0 21.5px 0 0
  &__img
    width 100px
    min-width 100px
    height 52.5px
    min-height 52.5px
    object-fit cover
  &__figcaption-title
    line-height 1.5
    margin 0
</style>
