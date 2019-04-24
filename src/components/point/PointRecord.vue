<template> 
  <div class="point-record"> 
    <div class="item title">
      <div class="item__timestamp"><span v-text="$t('point.RECORD_TITLE.DATETIME')"></span></div>
      <div class="item__deduction">
        <span class="unit" v-text="$t('point.RECORD_TITLE.MUTATION')"></span>
      </div>
      <div class="item__rest">
        <span class="unit" v-text="$t('point.RECORD_TITLE.REST')"></span>
      </div>
    </div>  
    <template v-for="(item, index) in records"> 
      <PointRecordItem :key="`point-record-${index}`" class="point-record-item" :record="item" @showDetail="checkoutDetail"></PointRecordItem> 
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
<style lang="stylus" scoped> 
  .point-record
    & >>> .item 
      width 100% 
      display flex 
      border-top 1px solid #d3d3d3 
      padding 10px 0 
      align-items center 
      &.title
        > div
          font-size 0.875rem
          font-weight 600      
      &:last-child 
        border-bottom 1px solid #d3d3d3  
      > div 
        margin-right 30px 
        font-size 0.75rem 
        line-height normal 
        &:last-child 
          margin-right 0 
      &__deduction, &__rest 
        width 110px 
        text-align right 
        .value 
          font-size 0.75rem
          font-weight 600 
          color #11b8c9 
          &.negative 
            color #d0021b 
        .unit 
          margin-left 10px 
      &__timestamp 
        width 160px 
      &__subject 
        flex 1 
        .object-type 
          margin-right 5px 
        .object-name 
          font-weight 500 
 
</style>