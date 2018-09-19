<template>
  <div class="point-manager"> 
    <div class="point-manager__infobar" :class="{ top: isTop, }"> 
      <div class="point-manager__infobar--current"> 
        <div>
          <span class="prefix" v-text="$t('point.WORDING_POINTS_AVAILABLE') + '：'"></span> 
          <span class="value" :class="{ negative: isPointsNegative, }" v-text="currentPoints"></span> 
          <span class="postfix" v-text="$t('point.UNIT')"></span>         
        </div>
        <!--Deposit class="deposit"><span v-text="$t('point.DEPOSIT.GO')"></span></Deposit-->
        <!--DepositTappay class="deposit" v-if="isTappayNeeded" :active.sync="isDepositActive" @fetchCurrentPoint="fetchCurrentPoint">
          <span v-text="$t('point.DEPOSIT.GO')"></span>
        </DepositTappay--> 
      </div> 
      <!--div class="point-manager__infobar--switcher"> 
        <div class="point-record" :class="isActive(0)" @click="check(0)"><span class="radio"></span><span v-text="$t('point.POINT_RECORD')"></span></div> 
        <div class="pay-record" :class="isActive(1)" @click="check(1)"><span class="radio"></span><span v-text="$t('point.PAYMENT_RECORD')"></span></div> 
      </div--> 
    </div> 
    <div class="point-manager__point-records"> 
      <PointRecord></PointRecord>
      <!--PointRecord v-if="activeIndex === 0"></PointRecord> 
      <PaymentRecord v-if="activeIndex === 1"></PaymentRecord--> 
    </div> 
  </div> 
</template>
<script>
  // import Deposit from 'src/components/point/Deposit.vue'
  import DepositTappay from 'src/components/point/DepositTappay.vue' 
  import PaymentRecord from 'src/components/point/PaymentRecord.vue'
  import PointRecord from 'src/components/point/PointRecord.vue'
  import { currentYPosition, elmYPosition, } from 'kc-scroll'
  import { get, } from 'lodash'
  const fetchCurrPoints = store => store.dispatch('GET_POINT_CURRENT', { params: {}, }) 
  const loadTappaySDK = store => store.dispatch('LOAD_TAPPAY_SDK')
  const debug = require('debug')('CLIENT:PointManager')
  export default {
    name: 'PointManager',
    components: {
      // Deposit,
      DepositTappay,
      PaymentRecord,
      PointRecord,
    },
    computed: { 
      currentPoints () { 
        return get(this.$store, 'state.personalPoints.points', 0) 
      }, 
      isPointsNegative () { 
        return this.currentPoints < 0 
      }, 
      isTappayNeeded () { 
        return get(this.$store, 'state.isTappayRequired', false) 
      },       
    }, 
    data () { 
      return { 
        // activeIndex: 0, 
        isTop: false,
        isDepositActive: false,
      } 
    },    
    methods: {
      // check (index) { 
      //   this.activeIndex = index 
      // }, 
      fetchCurrentPoint () {
        fetchCurrPoints(this.$store).then()
      },  
      // isActive (index) { 
      //   return [ this.activeIndex === index ? 'active' : '', ] 
      // },     
    },
    mounted () {
      fetchCurrPoints(this.$store).then(() => loadTappaySDK(this.$store))
      window.addEventListener('scroll', () => {
        const current_top_y = currentYPosition()
        const info_bar_top_Y = elmYPosition('.point-manager__infobar')
        if (current_top_y + 40 > info_bar_top_Y) {
          this.isTop = true
        } else {
          this.isTop = false
        }
      })
    },
    watch: {
      isTappayNeeded () { 
        debug('Mutation detected: isTappayNeeded', this.isTappayNeeded) 
      }, 
    },
  }
</script>
<style lang="stylus" scoped>
  .point-manager
    padding-top 50px
    position relative
    &__infobar
      display flex
      justify-content space-between
      font-size 0.75rem
      // margin-bottom 10px
      position absolute
      top 0
      left 0
      width 100%
      height 50px
      &.top
        position fixed
        top 40px
        background-color rgba(250, 250, 250, 0.9)
        padding 20px
        // height 70px
      &--current
        > div:not(:first-child)
          margin-top 5px
        .value
          color #11b8c9
          font-weight 500
        .postfix
          margin-left 5px
        .deposit
          display block
          padding-left 20px
          background-size contain
          background-position left center
          background-repeat no-repeat
          background-image url(/public/icons/encourage.png)
          span
            background-color #ddcf22
            box-shadow 0 0 5px rgba(0, 0, 0, 0.2)
            color #fff
            display block
            border-radius 2px
            padding 0px 5px
            width 40px
            text-align center

      &--switcher
        display flex
        flex-direction column
        > div
          margin-left 10px 
          display flex 
          align-items center      
          &:not(:first-child)   
            margin-top 5px
          .radio 
            content '' 
            width 13px 
            height 13px 
            border-radius 50% 
            border 1px solid #808080 
            margin-right 3px 
            display flex 
            justify-content center 
            align-items center 
          &.active 
            .radio 
              &::before 
                content '' 
                width 5px 
                height 5px 
                border-radius 50% 
                background-color #808080 
                display block         
</style>