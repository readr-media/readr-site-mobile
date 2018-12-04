<template>
  <BaseLightBox :showLightBox.sync="showMemoDeduction" borderStyle="nonBorder" @closeLightBox="hideMemoDeduction">
    <div class="project-memo-alert">
      <div class="project-memo-alert__content" :class="{ center: !get(me, 'id'), }">
        <template v-if="isClientSide && get(me, 'id')">
          <div class="content">
            <h2 v-text="$t('PROJECT.JOIN_CONTENT_1')"></h2>
            <h1 v-text="get(targetItem, 'project.title')"></h1>
            <h2>
              <span v-text="$t('PROJECT.JOIN_CONTENT_2')"></span>
              <strong v-text="pointsNeeded"></strong> 
              <span v-text="$t('PROJECT.JOIN_CONTENT_POINT')"></span>
            </h2>
            <div v-if="isDepositNeeded" class="alert">
              <span v-text="$t('PROJECT.NOT_ENOUGH_PREFIX')"></span>
              <span v-text="DEFAULT_DONATION_POINT_MIN_LINE" class="value"></span>
              <span v-text="$t('PROJECT.NOT_ENOUGH_POSTFIX')"></span>
              <span v-text="$t('PROJECT.GO_CLEAR_UP_PREFIX')"></span>
              <span v-text="sum" class="value"></span>
              <span v-text="$t('PROJECT.GO_CLEAR_UP_POSTFIX')"></span>
            </div>
            <DonateDetail
              theme="join"
              @resize="checkBottom"
              :rest="currentPoints"
              :amount="pointsNeeded"
              :type="alertType"></DonateDetail>              
          </div>
          <button v-text="btnWording"
            :disabled="memoDeducting"
            @click="clickHandler">
          </button>
        </template>
        <template v-else>
          <div class="content"><span v-text="$t('PROJECT.HAVE_TO_LOGIN')"></span></div>
          <button v-text="$t('PROJECT.LOG_IN')" @click="goLogin"></button>
        </template>
      </div>
    </div>
  </BaseLightBox>  
</template>
<script>
  import BaseLightBox from 'src/components/BaseLightBox.vue' 
  import DonateDetail from 'src/components/point/DonateDetail.vue'
  import { POINT_OBJECT_TYPE, DONATION_POINT_MIN_LINE, } from 'api/config'  
  import { get, } from 'lodash'
  import { isClientSide, } from 'src/util/comm'
  
  const DEFAULT_DONATION_POINT_MIN_LINE = DONATION_POINT_MIN_LINE || -100

  const debug = require('debug')('CLIENT:Consume')
  const deductPoints = (store, { objectId, memoPoints, } = {}) => {
    return store.dispatch('ADD_REWARD_POINTS_TRANSACTIONS', {
      params: {
        object_type: POINT_OBJECT_TYPE.PROJECT_MEMO,
        object_id: objectId,
        points: memoPoints,
      },
    })
  }
  const fetchCurrPoints = store => store.dispatch('GET_POINT_CURRENT', { params: {}, })
  const switchOnTappay = (store, item) => store.dispatch('SWITCH_ON_TAPPAY_PANEL', { active: true, item, })
  const switchOffDeductionPanel = store => store.dispatch('SWITCH_OFF_CONSUME_PANEL', { active: false, }) 
  const switchOnLoginLight = (store, message) => store.dispatch('LOGIN_ASK_TOGGLE', { active: true, message, type: 'GO_LOGIN', })
  export default {
    name: 'Consume',
    components: {
      BaseLightBox,
      DonateDetail,
    },
    computed: {
      btnWording () {
        if (this.isDepositNeeded) {
          return this.$t('PROJECT.GO_CLEAR_UP')
        } else {
          return this.memoDeducting ? `${this.$t('PROJECT.DEDUCTING')} ...` : this.$t('PROJECT.JOIN_CONFIRM')
        }
      },      
      currentPoints () {
        return get(this.$store, 'state.personalPoints.points', 0)
      },      
      extraPointsNeeded () { 
        return Math.abs(this.currentPoints - this.pointsNeeded - DEFAULT_DONATION_POINT_MIN_LINE) 
      },                 
      isActive () { 
        return get(this.$store, 'state.consumeFlag.active', false) 
      }, 
      isClientSide,
      isDonationActive () {
        return get(this.$store, 'state.setting.DONATION_IS_DEPOSIT_ACTIVE', false)
      },        
      isDepositNeeded () {
        return this.isDonationActive && this.currentPoints - this.pointsNeeded <= DEFAULT_DONATION_POINT_MIN_LINE
      },   
      me () {
        return get(this.$store, 'state.profile', {})
      },   
      pointsNeeded () { 
        return get(this.targetItem, 'project.memoPoints') || 0
      }, 
      sum () {
        return Math.abs(this.currentPoints - this.pointsNeeded)
      },      
      targetItem () { 
        return get(this.$store, 'state.consumeFlag.item', {}) 
      },       
    },
    data () {
      return {
        DEFAULT_DONATION_POINT_MIN_LINE,
        alertType: 1,
        memoDeducting: false,
        showMemoDeduction: false,
      }
    },
    methods: {
      get,
      checkBottom () {},
      clickHandler () {
        if (this.isDepositNeeded) {
          const slug = get(this.targetItem, 'project.slug')
          const objectId = get(this.targetItem, 'projectId')
          const memoPoints = get(this.targetItem, 'project.memoPoints')
          switchOnTappay(this.$store, {
            amount: this.sum,
            callback: () => {
              Promise.all([
                deductPoints(this.$store, { objectId, memoPoints, }),
                switchOffDeductionPanel(this.$store),
              ]).then(() => {
                // this.$router.push(`/series/${get(this.targetItem, 'project.slug')}`)
                location.replace(`/series/${slug}`)
              })
            },
          })
        } else {
          this.memoDeduct()
        }
      },    
      goLogin () {
        switchOnLoginLight(this.$store)
      },        
      hideMemoDeduction () {
        this.showMemoDeduction = false 
      },
      memoDeduct () { 
        this.memoDeducting = true 
        deductPoints(this.$store, { 
          objectId: get(this.targetItem, 'projectId'), 
          memoPoints: get(this.targetItem, 'project.memoPoints') || 0, 
        }).then(() => { 
          this.showMemoDeduction = false 
          location.reload() 
          // location.replace(`/series/${get(this.targetItem, 'project.slug')}`)
        })         
      },
    },
    mounted () {
      this.get(this.me, 'id') && fetchCurrPoints(this.$store).then(() => {
        debug('GOT CURRENT POINT:', this.currentPoints)
      })      
    },
    watch: { 
      isActive () { 
        if (this.isActive) {
          this.showMemoDeduction = true
          if (this.isActive && !get(this.me, 'id')) {
            switchOnLoginLight(this.$store)
          } else {
            fetchCurrPoints(this.$store)
          }
        } else {
          this.showMemoDeduction = false
        }        
      }, 
      isDepositNeeded () {
        if (this.isDepositNeeded) {
          this.alertType = 0
        } else {
          this.alertType = 1
        }
      },
      showMemoDeduction () { 
        !this.showMemoDeduction && switchOffDeductionPanel(this.$store) 
      }, 
    },    
  }
</script>
<style lang="stylus" scoped>
  .project-memo-alert
    position relative
    min-width 100%
    min-height 100vh
    background-color #11b8c9
    background-image url(/public/icons/join.png)
    background-position center calc(100% - 35px)
    background-size 90px auto
    background-repeat no-repeat
    border 5px solid #fff
    overflow hidden
    padding 40px 0 220px
    &__content
      padding 0 20px
      height 100%
      width 100%

      .content
        flex 1
        line-height normal
        height 235px
        .alert
          font-size 0.75rem
          margin 5px 0
          .value
            margin 0 5px
      &.center
        .content
          display flex
          flex-direction column
          justify-content center
      > div
        width 100%

      h1
        margin 10px 0 10px
        color #fff
        font-size 1.25rem
        font-weight 400
        letter-spacing 1px
      h2
        margin 10px 0 0
        font-size 1rem
        font-weight 400
        strong
          color #fff
          font-size 1.375rem
          margin 0 10px
      button
        width 100%
        height 40px
        margin-top 25px
        padding 11px 0
        color #11b8c9
        font-size 1.375rem
        background-color #fff
        box-shadow 0 0 10px rgba(250,250,250,0.9)
        border-radius 2px
        border none
        transition color .5s
        &:disabled
          color rgba(17, 184, 201, .6)
</style>