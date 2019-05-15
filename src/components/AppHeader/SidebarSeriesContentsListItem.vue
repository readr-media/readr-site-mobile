<template>
  <li class="list-item-wrapper">
    <router-link
      :to="`/post/${id}`"
      class="list-item"
    >
      <div class="list-item__img-wrapper img-wrapper">
        <img
          :key="image"
          v-lazy="image"
          alt=""
        >
      </div>
      <div class="list-item__content-wrapper content-wrapper">
        <h1>
          {{ title }}
        </h1>
        <p class="content-wrapper__date">
          {{ date }}
        </p>
        <p class="content-wrapper__description">
          {{ description }}
        </p>
      </div>
    </router-link>
  </li>
</template>

<script>
import _ from 'lodash'
import dayjs from 'dayjs'

import { createPost } from 'src/util/post'

export default {
  props: {
    item: {
      type: Object,
      default: () => {},
      required: true
    }
  },
  computed: {
    post () {
      return createPost(this.item)
    },
    id () {
      return _.get(this.post, 'id', '')
    },
    image () {
      return _.get(this.post, [ 'processed', 'ogImgUrl' ], '')
    },
    title () {
      return _.get(this.item, 'ogTitle', '') || _.get(this.item, 'title', '')
    },
    date () {
      return dayjs(_.get(this.post, 'publishedAt', '')).format('YYYY/MM/DD')
    },
    description () {
      return _.get(this.post, 'ogDescription', '')
    }
  }
}
</script>

<style lang="stylus" scoped>
.list-item
  display flex

.img-wrapper
  img
    width 150px
    height 84px
    object-fit cover
    background-color black

.content-wrapper
  margin 0 0 0 14px
  h1
    margin 0
    font-size 12px
    font-weight 400
    line-height 1.3
    color black
  p
    margin 10px 0 0 0
    font-size 12px
    line-height 1.3
    color black
  &__date
    color #4a4a4a !important
  &__description
    display none

@media (min-width: 768px)
  .list-item
    display flex

  .img-wrapper
    img
      width 200px
      height 112px

  .content-wrapper
    margin 0 0 0 20px
    h1
      font-size 24px
    p
      margin 14px 0 0 0
      font-size 16px
    &__date
      display none
    &__description
      display block
</style>
