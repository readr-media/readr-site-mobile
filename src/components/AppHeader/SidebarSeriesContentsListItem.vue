<template>
  <li class="list-item-wrapper">
    <SideBadge
      v-if="shouldShowSideBadge"
      class="list-item-wrapper__side-badge"
    />
    <LinkItem
      :href="url"
      class="list-item"
      @click.native="SET_SHOW_SIDEBAR(false)"
    >
      <div class="list-item__img-wrapper img-wrapper">
        <img
          :key="image"
          v-lazy="image"
          alt=""
        >
      </div>
      <div class="list-item__content-wrapper content-wrapper">
        <h2>
          {{ title }}
        </h2>
        <p class="content-wrapper__date">
          {{ date }}
        </p>
        <p class="content-wrapper__description">
          {{ description }}
        </p>
      </div>
    </LinkItem>
  </li>
</template>

<script>
import { mapMutations } from 'vuex'
import _ from 'lodash'
import dayjs from 'dayjs'

import { createPost } from 'src/util/post'

import LinkItem from 'src/components/common/LinkItem.vue'
import SideBadge from '@readr-ui/side-badge/src/readr-ui-side-badge.vue'

export default {
  components: {
    LinkItem,
    SideBadge
  },
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
    },
    url () {
      return _.get(this.post, 'processed.url', '')
    },
    shouldShowSideBadge () {
      const date = _.get(this.post, 'publishedAt', '')
      if (date) {
        const today = dayjs()
        const currentDate = dayjs(date)
        return today.diff(currentDate, 'day') <= 7
      }
      return false
    }
  },
  methods: {
    ...mapMutations({
      SET_SHOW_SIDEBAR: 'UIAppHeader/SET_SHOW_SIDEBAR'
    })
  }
}
</script>

<style lang="stylus" scoped>
.list-item-wrapper
  position relative
  &__side-badge
    position absolute
    transform scale(.6)
    left -15px
    top -15px

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
  h2
    margin 0
    font-weight 400
    line-height 1.3
    color black
    word-wrap break-word
    word-break break-all
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
  .list-item-wrapper
    &__side-badge
      transform none
      top 0

  .list-item
    display flex

  .img-wrapper
    img
      width 200px
      height 112px

  .content-wrapper
    margin 0 0 0 20px
    p
      margin 14px 0 0 0
      font-size 16px
    &__date
      display none
    &__description
      display block
</style>
