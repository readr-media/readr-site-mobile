<template> 
  <div class="point-record"> 
    <template v-for="(item, index) in records"> 
      <PointRecordItem class="point-record-item" :record="item" @showDetail="checkoutDetail"></PointRecordItem> 
    </template> 
    <RecordDetail :showup.sync="showDetail" :detail="currDetail"></RecordDetail>
  </div> 
</template> 
<script> 
  import PointRecordItem from 'src/components/point/PointRecordItem.vue' 
  import RecordDetail from 'src/components/point/RecordDetail.vue'
  import { get, } from 'lodash' 
 
  // const debug = require('debug')('CLIENT:PointRecord')
  const fetchPointRecords = (store) => store.dispatch('GET_POINT_HISTORIES', { params: {}, }) 
 
  export default { 
    name: 'PointRecord', 
    components: { 
      PointRecordItem, 
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