<template>
  <div class="point-manager"> 
    <div class="point-manager__infobar"> 
      <div class="point-manager__infobar--current"> 
        <span class="prefix" v-text="$t('point.WORDING_POINTS_AVAILABLE') + '：'"></span> 
        <span class="value" :class="{ negative: isPointsNegative, }" v-text="currentPoints"></span> 
        <span class="postfix" v-text="$t('point.UNIT')"></span> 
      </div> 
      <div class="point-manager__infobar--switcher"> 
        <div class="point-record" :class="isActive(0)" @click="check(0)"><span class="radio"></span><span v-text="$t('point.POINT_RECORD')"></span></div> 
        <div class="pay-record" :class="isActive(1)" @click="check(1)"><span class="radio"></span><span v-text="$t('point.PAYMENT_RECORD')"></span></div> 
      </div> 
    </div> 
    <div class="point-manager__point-records"> 
      <PointRecord v-if="activeIndex === 0"></PointRecord> 
      <PaymentRecord v-if="activeIndex === 1"></PaymentRecord> 
    </div> 
  </div> 
</template>
<script>
  import PaymentRecord from 'src/components/point/PaymentRecord.vue'
  import PointRecord from 'src/components/point/PointRecord.vue'
  import { get, } from 'lodash'
  const fetchCurrPoints = store => store.dispatch('GET_POINT_CURRENT', { params: {}, }) 
  
  export default {
    name: 'PointManager',
    components: {
      PaymentRecord,
      PointRecord,
    },
    computed: { 
      isPointsNegative () { 
        return this.currentPoints < 0 
      }, 
      currentPoints () { 
        return get(this.$store, 'state.personalPoints.points', 0) 
      }, 
    }, 
    data () { 
      return { 
        activeIndex: 0, 
      } 
    },    
    methods: {
      check (index) { 
        this.activeIndex = index 
      }, 
      isActive (index) { 
        return [ this.activeIndex === index ? 'active' : '', ] 
      },       
    },
    mounted () {
      fetchCurrPoints(this.$store) 
    },
  }
</script>
<style lang="stylus" scoped>
  .point-manager
    &__infobar
      display flex
      justify-content space-between
      font-size 0.75rem
      margin-bottom 10px
      &--current
        .value
          color #11b8c9
          font-weight 500
        .postfix
          margin-left 5px
      &--switcher
        display flex
        > div
          margin-left 10px 
          display flex 
          align-items center         
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