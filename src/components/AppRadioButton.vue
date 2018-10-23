<template>
  <label :class="[ 'radio-container', { 'radio-container--checked': checked } ]">
    {{ optionText }}
    <input type="radio" name="radio" :checked="checked" @click="pickRadio">
    <span :class="[ 'radio-container__checkmark', 'checkmark', { 'checkmark--checked': checked } ]">
      <span :class="[ 'checkmark__inner-dot', { 'checkmark__inner-dot--checked': checked } ]"></span>
    </span>
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
  cursor pointer
  font-size 12px
  user-select none
  color #808080
  -webkit-font-smoothing antialiased
  display flex
  align-items center
  flex-direction row-reverse
  width max-content
  input
    position absolute
    opacity 0
    cursor pointer

.checkmark
  position relative
  height 10px
  width 10px
  background-color white
  border-radius 50%
  box-shadow 0 1px 2px 0 rgba(0, 0, 0, 0.5), 1px 1px 4px 0 rgba(129, 129, 129, 0.5)
  margin 0 5px 1px 0
  display inline-flex
  justify-content center
  align-items center
  &--checked
    background-color #808080
  &__inner-dot
    display none
    width 5px
    height 5px
    border-radius 50%
    background-color white
    &--checked
      display block
</style>


