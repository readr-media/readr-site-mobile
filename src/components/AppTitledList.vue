<template>
  <section class="app-titled-list">
    <div class="app-titled-list__title">
      <div class="plus"></div>
      <h1 v-text="listTitle"></h1>
    </div>
    <slot></slot>
  </section>
</template>

<script>
export default {
  props: {
    listTitle: {
      type: String,
      required: true,
    },
  },
}
</script>

<style lang="stylus" scoped>
.app-titled-list
  background-color white
  padding 0 20px
  &__title
    display flex
    align-items center
    padding 0
    .plus
      length = 15px
      display inline-block
      width length
      height length
      position relative
      margin-right 5px
      // CSS based plus sign
      &::before
        content ''
        width length
        height 4px
        background-color #ddcf21
        position absolute
        top 0
        bottom 0
        left 0
        right 0
        margin auto
      &::after
        content ''
        width 4px
        height length
        background-color #ddcf21
        position absolute
        top 0
        bottom 0
        left 0
        right 0
        margin auto
    h1
      display inline
      font-size .9375rem
      font-weight 600
      line-height 1
      margin 0
</style>
