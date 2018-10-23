<template>
  <div class="list-container">
    <div class="list-container__content content">
      <div class="content__icon icon">
        <img v-if="isClientSide" class="icon__img" :src="icon" alt="">
      </div>
      <slot></slot>
    </div>
  </div>
</template>

<script>
import { isClientSide, } from 'src/util/comm'

export default {
  props: {
    icon: {
      type: String,
      required: true,
    },
  },
  computed: {
    isClientSide,
  },
}
</script>

<style lang="stylus" scoped>
.list-container
  width 100%
  border-top 1.5px solid white

.content
  position relative
  top calc(-26px / 2)
  display flex
  flex-direction column
  align-items center
  padding 0 0 13px 0
  &__icon
    width 26px
    background-color #ddcf21
    margin 0 0 13px 0

.icon
  &__img
    width 100%
    border-radius 100%
</style>

