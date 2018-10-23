<template>
  <nav class="radios">
    <AppRadioButton
      v-for="option in options"
      :key="option.key"
      class="radios__option"
      :optionText="option.text"
      :checked="picked === option.key"
      @radioPicked="pickRadio(option.key)"
    />
  </nav>
</template>

<script>
import AppRadioButton from 'src/components/AppRadioButton.vue'

export default {
  props: {
    picked: {
      type: String,
      required: true,
    },
  },
  components: {
    AppRadioButton,
  },
  data () {
    return {
      options: [
        {
          text: '客座評論',
          key: 'posts',
        },
        {
          text: '熱門關鍵字',
          key: 'tags',
        },
      ],
    }
  },
  methods: {
    pickRadio (value) {
      this.$emit('update:picked', value)
    },
  },
}
</script>

<style lang="stylus" scoped>
.radios
  display flex
  justify-content flex-end
  align-items center
  padding 0 15.5px 0 0
  &__option
    font-size 15px !important
    &.radio-container--checked
      color black !important
    & >>> .checkmark--checked
      background-color white !important
    & >>> .checkmark__inner-dot
      width 7px !important
      height 7px !important
    & >>> .checkmark__inner-dot--checked
      background-color #ddcf21 !important
    & + &
      margin 0 0 0 10px
</style>

