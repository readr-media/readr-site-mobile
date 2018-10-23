<template>
  <label class="radio-container">
    {{ optionText }}
    <input type="radio" name="radio" :checked="checked" @click="pickRadio">
    <span class="radio-container__checkmark"></span>
  </label>
</template>

<script>
export default {
  props: {
    optionText: {
      type: String,
      required: true,
    },
    checked: {
      type: Boolean,
      default: false,
    },
  },
  methods: {
    pickRadio () {
      this.$emit('radioPicked')
    },
  },
}
</script>

<style lang="stylus" scoped>
.radio-container
  display block
  position relative
  padding-left 15px
  cursor pointer
  font-size 12px
  user-select none
  color #808080
  -webkit-font-smoothing antialiased
  input
    position absolute
    opacity 0
    cursor pointer
    &:checked
      & ~ .radio-container__checkmark
        background-color #808080
        &:after
          display block
  &:hover
    input
      & ~ .radio-container__checkmark
        background-color #ccc
      &:checked
        & ~ .radio-container__checkmark
          background-color #808080
          &:after
            display block
  &__checkmark
    position absolute
    top 0
    left 0
    height 10px
    width 10px
    background-color white
    border-radius 50%
    box-shadow 0 1px 2px 0 rgba(0, 0, 0, 0.5), 1px 1px 4px 0 rgba(129, 129, 129, 0.5)
    &:after
      content ""
      position absolute
      display none
      top 2.5px
      left 3px
      width 5px
      height 5px
      border-radius 50%
      background white
</style>


