<template> 
  <div class="payment-record"> 
    <template v-for="item in records"> 
      <PaymentRecordItem class="payment-record-item" :record="item" @showDetail="checkoutDetail"></PaymentRecordItem> 
    </template> 
    <RecordDetail :showup.sync="showDetail" :detail="currDetail"></RecordDetail>    
  </div> 
</template> 
<script> 
  import PaymentRecordItem from 'src/components/point/PaymentRecordItem.vue' 
  import RecordDetail from 'src/components/point/RecordDetail.vue'
  import { get, } from 'lodash' 
 
  const fetchPointRecords = (store) => store.dispatch('GET_POINT_HISTORIES', { params: {}, }) 
 
  export default { 
    name: 'PaymentRecord', 
    components: { 
      PaymentRecordItem, 
      RecordDetail,
    }, 
    computed: { 
      records () { 
        return get(this.$store, 'state.pointHistories') 
      },       
    }, 
    data () {
      return {
        currDetail: {},
        showDetail: false,
      }
    },
    methods: {
      checkoutDetail (detail) {
        this.currDetail = detail
        this.showDetail = true
      },
    }, 
    mounted () { 
      fetchPointRecords(this.$store) 
    }, 
  } 
</script> 