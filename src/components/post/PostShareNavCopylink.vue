<template>
  <div class="wrapper">
    <img class="wrapper__icon" src="/public/icons/copylink-blue.png" alt="" @click="toggleTooltip">
    <div
      :class="[ 'wrapper__tooltip', { 'wrapper__tooltip--toggled': showActionTooltip } ]"
      v-text="$t('COPY_LINK')"
    >
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      showActionTooltip: false,
    }
  },
  methods: {
    setTooltipTimer () {
      this.showActionTooltip = true
      if (this._timer) {
        clearTimeout(this._timer)
      }
      this._timer = setTimeout(() => {
        this.showActionTooltip = false
      }, 1000)
    },
    toggleTooltip (e) {
      this.setTooltipTimer()
      this.$emit('toggle', e)
    },
  },
}
</script>

<style lang="stylus" scoped>
.wrapper
  &__icon
    d = 100%
    width d
    height d
  &__tooltip
    font-size 15px
    width 120px
    height 40px
    border-radius 5px
    background-color rgba(128, 128, 128, 1)
    color white
    z-index 1000
    position fixed
    top calc((100vh - 40px) / 2)
    left calc((100vw - 120px) / 2)
    display flex
    justify-content center
    align-items center
    opacity 0
    transition opacity .15s
    &--toggled
      opacity 1
</style>