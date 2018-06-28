<template>
  <div class="checkbox__container" @click="toggle">
    <div class="checkbox" :class="{ checked: isChecked, }"></div>
    <div class="checkbox--text">
      <slot></slot>
    </div>
  </div>
</template>
<script>
  export default {
    name: 'SettingCheckbox',
    data () {
      return {
        isChecked: false,
      }
    },
    methods: {
      toggle () {
        this.isChecked = !this.isChecked
      },
    },
    mounted () {
      this.isChecked = this.value || false
    },
    props: {
      value: {
        type: Boolean,
      },
    },
    watch: {
      isChecked () {
        this.$emit('update:value', this.isChecked)
      },
    },
  }
</script>
<style lang="stylus" scoped>
  .checkbox
    margin-right 5px
    display flex
    align-items center
    height 20px
    &:before
      content ''
      height 10px
      width 10px
      border 1px solid #000      
    &.checked
      &:before
        background-color #000
    &--text
      flex 1
      overflow auto
    &__container
      cursor pointer
      display flex
      align-items flex-start
      
</style>