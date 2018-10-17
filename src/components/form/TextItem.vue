<template>
  <div class="text-item" :class="{ alert: flag, }">
    <input ref="input"
      v-model="currValue"
      :style="{
          width,
          height,
          borderLeft: border,
          borderTop: border,
          borderBottom: border,
          borderRight: !flag ? border : undefined,
          margin,
          padding,
          fontSize,
          backgroundColor,
          color,
        }"
      :disabled="disabled"
      :type="type"
      :placeholder="placeHolder"
      @keyup="keyup">
    <span class="text-item__alert" @click="doFucus"
      :style="{
        height,
        backgroundColor,
        borderRight: border,   
        borderTop: border,
        borderBottom: border,             
      }"></span>
    <span class="text-item__msg" v-text="msg" :class="{ long: isTooLong, bottom: alertPosition && alertPosition === 'bottom', }"></span>
  </div>
</template>
<script>
  import validator from 'validator'
  export default {
    data () {
      return {
        currValue: '',
        flag: false,
        isTooLong: false,
        msg: '',
        show: false,
      }
    },
    name: 'TextItem',
    methods: {
      doFucus () {
        this.$refs['input'].focus()
      },
      keyup () {
        this.$emit('update:alert', {
          flag: false,
        })
        this.show = false
      },
    },
    mounted () {
      this.currValue = this.value
    },
    props: [
        'alert',
        'alertPosition',
        'type',
        'placeHolder',
        'disabled',
        'initValue',
        'width',
        'height',
        'border',
        'margin',
        'padding',
        'fontSize',
        'backgroundColor',
        'color',
      ],
    watch: {
      alert: function () {
        this.flag = this.alert.flag
        this.msg = this.alert.msg
        const len = this.msg ? this.msg.length : 0
        this.isTooLong = len > 10
      },
      initValue: function () {
        this.$refs['input'].value = this.initValue
      },
      currValue: function () {
        this.$emit('update:value', validator.trim(this.currValue || '') || undefined)
      },
    },
  }
</script>
<style lang="stylus" scoped>
  // input-width = calc(100% - 20px)
  input-width-alert = calc(100% - 20px - 35px - 1.5px)
  .text-item
    position relative
    &.admin
      height 14px
      width 100%
      &.alert
        height 24px
        > input
          height 24px
          padding-left 5px
        .text-item__alert
          height 24px
          background-size 14px 14px
        .text-item__msg
          font-size 0.9375rem
          line-height 1.25rem

      > input
        border-bottom 1px solid #d3d3d3
        height 16px
        padding 0
        color #000
        font-size 0.9375rem
        &:disabled
          border-bottom none
    &.alert
      position relative
      margin calc(10px - 1.5px) 0
      > input
        border-top 1.5px solid #ddcf21
        border-bottom 1.5px solid #ddcf21
        border-left 1.5px solid #ddcf21
        height 35px
        width calc(100% - 35px)
        &:focus ~ .text-item__msg
          display block
      .text-item__alert
        border-top 1.5px solid #ddcf21
        border-bottom 1.5px solid #ddcf21
        border-right 1.5px solid #ddcf21
        background-image url(/public/icons/exclamation.png)
        background-position center center
        background-size 22px 22px
        background-repeat no-repeat
        display inline-block
    > input
      border none
      width 100%
      height 35px
      font-size 1.125rem
      padding 0 10px
      vertical-align top
      background-color #ffffff
      outline none
      font-weight 100
      line-height 35px
      border-top-right-radius 0
      border-bottom-right-radius 0
      &::-webkit-input-placeholder
        color #bdbdbd
        font-weight 100
    &__alert
      background-color #fff
      display inline-block
      height 35px
      width 35px
      display none
    &__msg
      background-color #ddcf21
      padding 10px
      position absolute
      width 100%
      white-space nowrap
      min-height 30px
      left 0
      top 45px
      z-index 20
      font-size 0.75rem
      line-height normal
      text-align jusitfy
      color #000
      font-weight normal
      box-shadow 1px 1px 1px rgba(0, 0, 0, 0.4)
      border-radius 5px
      display none
      &.long
        white-space normal
      &::after
        content ''
        border-width 0 5px 10px 5px 
        border-color transparent transparent #ddcf21 transparent
        border-style solid
        position absolute
        left 50%
        top -10px
        transform translateX(-50%)
        display block
      &.bottom
        right 0
        left auto
        top 100%
        &::before, &::after
          content none
</style>