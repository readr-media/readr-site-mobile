<template> 
  <div class="item" @click="checkoutDetail"> 
    <div class="item__timestamp"><span v-text="datetime"></span></div> 
    <div class="item__deduction"> 
      <span class="value" v-text="0 - deduction > 0 ? `+${0 - deduction}` : 0 - deduction"></span> 
      <span class="unit" v-text="$t('point.UNIT')"></span> 
    </div> 
    <div class="item__rest"> 
      <span class="value" :class="{ negative: isBalanceNegative, }" v-text="balance"></span> 
      <span class="unit" v-text="$t('point.UNIT')"></span> 
    </div> 
  </div> 
</template> 
<script> 
  import moment from 'moment' 
  import { get, } from 'lodash' 

  export default { 
    name: 'PointRecordItem', 
    computed: { 
      balance () { 
        return get(this.record, 'balance', 0) 
      }, 
      datetime () { 
        return moment(get(this.record, 'createdAt')).format('YYYY-MM-DD') 
      }, 
      deduction () { 
        return get(this.record, 'points', 0) 
      }, 
      isBalanceNegative () { 
        // return this.balance < 0 
        return false
      }, 
    }, 
    methods: {
      checkoutDetail () {
        this.$emit('showDetail', Object.assign({ detailType: 'point', }, this.record))
      },
    }, 
    mounted () {}, 
    props: { 
      record: { 
        type: Object, 
      }, 
    }, 
  } 
</script> 
