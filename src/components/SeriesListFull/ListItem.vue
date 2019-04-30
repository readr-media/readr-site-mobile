<template>
  <li class="list-item">
    <router-link
      class="list-item__link link"
      :to="link"
    >
      <div class="link__img-wrapper img-wrapper">
        <img
          v-lazy="img"
          class="img-wrapper__img"
          alt=""
        >
      </div>
      <h1 class="link__title">
        {{ title }}
      </h1>
      <p class="link__date">
        {{ date }}
      </p>
    </router-link>
  </li>
</template>

<script>
import { get, } from 'lodash'
import moment from 'moment'

export default {
  props: {
    item: {
      type: Object,
      default: () => {},
    },
  },
  computed: {
    link () {
      return '/'
    },
    img () {
      return get(this.item, 'heroImage', '')
    },
    title () {
      return get(this.item, 'title', '')
    },
    date () {
      const date = get(this.item, 'updatedAt', '')
      return moment(date).format('YYYY-MM-DD')
    },
  },
}
</script>

<style lang="stylus" scoped>
.list-item
  width 100%

.link
  color black
  &__title
    margin 5px 0
    font-size 12px
    line-height 1.25
    font-weight 400
  &__date
    margin 0
    font-size 10px
    color #4a4a4a

.img-wrapper
  width 100%
  height 0
  padding-bottom 57.24% // 290:166
  background-color black
  position: relative
  &__img
    position: absolute
    top: 0
    left: 0
    width: 100%
    height: 100%
    object-fit cover
</style>
