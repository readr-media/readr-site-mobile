<template>
  <div class="record-detail" v-show="showup">
    <div class="record-detail__content">
      <div class="timestamp">
        <div class="title"><span v-text="$t('point.DETAIL.DATETIME')"></span></div>
        <div class="value"><span v-text="datetime"></span></div>
      </div>
      <div class="subject">
        <div class="title"><span v-text="$t('point.DETAIL.SUBJECT')"></span></div>
        <div class="value">
          <template v-if="detailType === 'point'">
            <template v-if="objectType === 'ENCOURAGE' || objectType === 'PARTICIPATE'">
              <span class="object-type" v-text="`${$t(`point.${objectType}`)}${$t(`point.PROJECT`)}`"></span>
              <span class="object-name" v-text="objectName"></span>
            </template>
            <template v-if="objectType === 'CLEARUP' || objectType ==='GIFT'">
              <span class="object-type" v-text="$t(`point.${objectType}`)"></span>
            </template>              
          </template>
          <template v-else>
            <span class="prefix" v-text="$t('point.PAYMENT.PREFIX')"></span> 
            <span class="points-original" v-text="pointOrigin"></span> 
            <span class="infix" v-text="$t('point.PAYMENT.INFIX')"></span>
            <span class="points-deposit" v-text="pointDeposit"></span> 
            <span class="postfix" v-text="$t('point.PAYMENT.POSTFIX')"></span>         
          </template>
        </div>
      </div>
      <div class="deduction" v-if="detailType === 'point'">
        <div class="title"><span v-text="$t('point.DETAIL.DEDUCTION')"></span></div>
        <div class="value">
          <span v-text="deduction"></span>
          <span v-text="$t('point.UNIT')" class="unit"></span>  
        </div>
      </div>
      <div class="rest">
        <div class="title"><span v-text="$t('point.DETAIL.REST')"></span></div>
        <div class="value">
          <span v-text="balance"></span>
          <span v-text="$t('point.UNIT')" class="unit"></span>
        </div>
      </div>
      <div class="confirm"><span v-text="$t('point.DETAIL.CONFIRM')" @click="confirm"></span></div>
    </div>
  </div>
</template>
<script>
  import moment from 'moment'
  import preventScroll from 'prevent-scroll'
  import { get, } from 'lodash'

  export default {
    name: 'RecordDetail',
    computed: {
      balance () { 
        return get(this.detail, 'balance', 0) 
      },       
      datetime () {
        return moment(get(this.detail, 'createdAt')).format('YYYY-MM-DD HH:mm:ss')
      },     
      deduction () { 
        return get(this.detail, 'points', 0) 
      },
      detailType () {
        return get(this.detail, 'detailType')
      },
      objectName () {
        return get(this.detail, 'objectName', '--')
      },
      objectType () {
        switch (get(this.detail, 'objectType', )) {
          case 1:
            return 'ENCOURAGE'
          case 2:
            return 'PARTICIPATE'
          case 3:
            return 'CLEARUP'
          case 4:
            return 'GIFT' 
          default:
            return
        }
      },   
      pointOrigin () { 
        return this.balance - this.pointDeposit 
      }, 
      pointDeposit () { 
        return 0 - get(this.detail, 'points', 0) 
      }, 
    },
    methods: {
      confirm () {
        this.$emit('update:showup', false)
      },
    },
    mounted () {},
    props: {
      detail: {
        type: Object,
      },
      showup: {
        type: Boolean,
      },
    },
    watch: {
      showup () {
        if (this.showup) {
          preventScroll.on()
        } else {
          preventScroll.off()
        }
      },
    },
  }
</script>
<style lang="stylus" scoped>
  .record-detail
    position fixed
    top 0
    left 0
    width 100vw
    height 100vh
    background-color rgba(1, 1, 1, 0.5)
    display flex
    align-items center
    padding-top 50px    
    &__content
      height 50%
      width 100%
      background-color rgba(225, 225, 225, 0.9)
      display flex
      flex-direction column
      justify-content center
      font-size 1rem
      line-height normal
      box-shadow 0 0 3px #e9e9e9
      padding-bottom 50px
      position relative
      > div
        display flex
        padding 5px 20px
        font-size 0.875rem
        .title
          width 50px
          margin-right 5px
        .value
          flex 1
          text-align right
          display block
          font-weight 300
          .unit
            margin-left 5px
        &.confirm
          position absolute
          bottom 10px
          left 0
          width 100%
          height 40px
          justify-content center
          span
            display flex
            background-color #ddcf21
            font-size 0.9375rem
            height 100%
            width 70%
            justify-content center
            align-items center
            border-radius 6px
            box-shadow 0 1px 5px #b9b9b9
      .subject
        .points-deposit, .points-original
          margin 0 2px
        .object-name
          font-weight 500
          &::before
            content '【'
            display inline
          &::after
            content '】'
            display inline
</style>