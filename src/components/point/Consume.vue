<template>
  <BaseLightBox :showLightBox.sync="showMemoDeduction" borderStyle="nonBorder" @closeLightBox="hideMemoDeduction">
    <div class="project-memo-alert">
      <div class="project-memo-alert__content">
        <h2 v-text="$t('PROJECT.JOIN_CONTENT_1')"></h2>
        <h1 v-text="get(targetItem, 'project.title')"></h1>
        <h2>
          <span v-text="$t('PROJECT.JOIN_CONTENT_2')"></span>
          <strong v-text="pointsNeeded"></strong> 
          <span v-text="$t('PROJECT.JOIN_CONTENT_POINT')"></span>
        </h2>
        <h2>
          <template v-if="isDepositNeeded"> 
            <span v-text="$t('PROJECT.WARNING_DEPOSIT_PREFIX')"></span> 
            <span v-text="extraPointsNeeded"></span> 
            <span v-text="$t('PROJECT.WARNING_DEPOSIT_POSTFIX')"></span> 
          </template>
        </h2>
        <button v-text="btnWording"
          :disabled="memoDeducting"
          @click="clickHandler">
        </button>
      </div>
    </div>
  </BaseLightBox>  
</template>
<script>
  import BaseLightBox from 'src/components/BaseLightBox.vue' 
  import { POINT_OBJECT_TYPE, DONATION_POINT_MIN_LINE, } from 'api/config'  
  import { ROLE_MAP, } from 'src/constants'
  import { filter, get, } from 'lodash'
  
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
  const switchOffDeductionPanel = store => store.dispatch('SWITCH_OFF_CONSUME_PANEL', { active: false, }) 

  export default {
    name: 'Consume',
    components: {
      BaseLightBox,
    },
    computed: {
      btnWording () {
        if (this.isDepositNeeded) {
          debug('WARN: YOU GOTTA DEPOSIT!!!!!!', DEFAULT_DONATION_POINT_MIN_LINE)
          debug('WARN: YOU GOTTA DEPOSIT!!!!!!', this.$t('PROJECT.WARNING_DEPOSIT_PREFIX') + this.currentPoints + this.$t('PROJECT.WARNING_DEPOSIT_POSTFIX'))
          return this.$t('PROJECT.DEPOSIT')
        } else {
          return this.memoDeducting ? `${this.$t('PROJECT.DEDUCTING')} ...` : this.$t('PROJECT.JOIN_CONFIRM')
        }
      },      
      currentPoints () {
        return get(this.$store, 'state.personalPoints.points', 0)
      },  
      currUser () {
        return get(this.$store, 'state.profile.id')
      },      
      extraPointsNeeded () { 
        return Math.abs(this.currentPoints - this.pointsNeeded - DEFAULT_DONATION_POINT_MIN_LINE) 
      },                 
      isActive () { 
        return get(this.$store, 'state.consumeFlag.active', false) 
      }, 
      isDonationActive () {
        return get(this.$store, 'state.setting.DONATION_IS_DEPOSIT_ACTIVE', false)
      },        
      isDepositNeeded () {
        return this.isDonationActive && this.currentPoints <= DEFAULT_DONATION_POINT_MIN_LINE
      },      
      pointsNeeded () { 
        return get(this.targetItem, 'project.memoPoints', 0) || 0 
      }, 
      targetItem () { 
        return get(this.$store, 'state.consumeFlag.item', {}) 
      },       
    },
    data () {
      return {
        memoDeducting: false,
        showMemoDeduction: false,
      }
    },
    methods: {
      get,
      clickHandler () {
        if (this.isDepositNeeded) {
          switchOffDeductionPanel(this.$store).then(() => {
            this.showMemoDeduction = false
            const memberCenter = get(filter(ROLE_MAP, { key: get(this.$store, 'state.profile.role'), }), '0.route', 'member')
            this.$router.push(`/${memberCenter}/records/point-manager`)
          })
        } else {
          this.memoDeduct()
        }
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
        })         
      },
    },
    mounted () {
      this.currUser && fetchCurrPoints(this.$store).then(() => {
        debug('GOT CURRENT POINT:', this.currentPoints)
      })      
    },
    watch: { 
      isActive () { 
        this.isActive && (this.showMemoDeduction = true) 
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
    background-position center calc(100% - 45px)
    background-size 110px auto
    background-repeat no-repeat
    border 5px solid #fff
    overflow hidden
    &__content
      margin-top 85px
      text-align center
      h1
        margin 1em 0 10px
        color #fff
        font-size 1.5625rem
        font-weight 400
        letter-spacing 1px
      h2
        margin .5em 0 0
        font-size 1.125rem
        font-weight 400
        strong
          color #fff
          font-size 1.875rem
          margin 0 .2em
      button
        width 150px
        margin-top 25px
        padding 11px 0
        color #11b8c9
        font-size 1.5625rem
        background-color #fff
        box-shadow 0 0 10px rgba(250,250,250,0.9)
        border-radius 2px
        border none
        transition color .5s
        &:disabled
          color rgba(17, 184, 201, .6)
</style>