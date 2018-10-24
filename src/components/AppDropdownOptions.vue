<template>
  <header class="header">
    <h1 class="header__title" v-text="title"></h1>
    <div class="dropdown">
      <div class="dropdown__icon" @click="toogleDropdown" v-click-outside="closeDropdown"></div>
      <div class="dropdown__options options" v-show="isDropdownToogled">
        <AppRadioButton
          v-for="option in options"
          :key="option.key"
          class="options__option"
          :optionText="option.text"
          :checked="picked === option.key"
          @radioPicked="pickRadio(option.key)"
        />
      </div>
    </div>
  </header>
</template>

<script>
import { find, } from 'lodash'
import AppRadioButton from 'src/components/AppRadioButton.vue'

export default {
  props: {
    picked: {
      type: String,
      required: true,
    },

    // options template:
    // [
    //   {
    //     text: '',
    //     key: '',
    //   },
    //   // ...
    // ]
    options: {
      type: Array,
      required: true,
    },
  },
  components: {
    AppRadioButton,
  },
  data () {
    return {
      isDropdownToogled: false,
    }
  },
  computed: {
    title () {
      return find(this.options, [ 'key', this.picked, ]).text
    },
  },
  methods: {
    toogleDropdown () {
      this.isDropdownToogled = !this.isDropdownToogled
    },
    closeDropdown () {
      this.isDropdownToogled = false
    },
    pickRadio (value) {
      this.$emit('update:picked', value)
      this.closeDropdown()
    },
  },
  directives: {
    'click-outside': {
      bind (el, binding, vnode) {
        el.clickOutsideEvent = function (event) {
          // here I check that click was outside the el and his childrens
          if (!(el == event.target || el.contains(event.target))) {
            // and if it did, call method provided in attribute value
            vnode.context[binding.expression](event)
          }
        }
        document.body.addEventListener('click', el.clickOutsideEvent)
      },
      unbind (el) {
        document.body.removeEventListener('click', el.clickOutsideEvent)
      },
    },
  },
}
</script>

<style lang="stylus" scoped>
.header
  display flex
  align-items center
  &__title
    font-size 18px
    font-weight 600
    margin 0

.dropdown
  position relative
  margin 0 0 0 5px
  &__icon
    width 0
    height 0
    border-style solid
    border-width 7.5px 5px 0 5px
    border-color black transparent transparent transparent
    cursor pointer
  &__options
    position absolute
    top 20px
    left calc(-105px / 2 + 5px)
    width 105px
    height 89.5px
    background-color #ffffff
    box-shadow 0 1px 2px 0 rgba(0, 0, 0, 0.5), 1px 1px 4px 0 rgba(129, 129, 129, 0.5)
    z-index 10

.options
  padding 6.5px 8px
  display flex
  flex-direction column
  justify-content center
  &__option
    & + &
      margin 6px 0 0 0
</style>

