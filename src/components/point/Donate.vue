<template>
  <BaseLightBox borderStyle="nonBorder" :showLightBox.sync="showDonate" @closeLightBox="closeDonate()">
    <div class="donate-panel">
      <div class="donate-panel__container">
        <div class="donate-panel__content">
          <div class="appreciate"><span v-text="$t('point.DONATE.APPRECIATE')"></span></div>
          <div class="project-name"><span v-text="get(targetItem, 'title')"></span></div>
          <div class="amount">
            <span v-text="$t('point.DONATE.AMOUNT_PREFIX')"></span>
            <input class="amount-input" type="text" v-model="donateAmount">
            <span v-text="$t('point.DONATE.AMOUNT_POSTFIX')"></span>
          </div>
          <div class="alert">
            <span v-text="alertMsg"></span>
            <span v-show="alertMsg" v-text="$t('point.DONATE.GO_DEPOSIT')" class="deposit" @click="goDeposit"></span>
          </div>
        </div>
        <div class="donate-panel__confirm" :class="{ block: alertMsg, }" @click="goDonate"><span v-text="$t('point.DONATE.CONFIRM')"></span></div>
      </div>
    </div>
  </BaseLightBox>
</template>
<script>
  import BaseLightBox from 'src/components/BaseLightBox.vue'
  import { ROLE_MAP, } from 'src/constants'
  import { POINT_OBJECT_TYPE, } from 'api/config'
  import { get, filter, } from 'lodash'

  const debug = require('debug')('CLIENT:Donate')
  const deductPoints = (store, { objectId, points, } = {}) => {
    const isPointNumeric = typeof(points) === 'number'
    return store.dispatch('ADD_REWARD_POINTS_TRANSACTIONS', {
      params: {
        object_type: POINT_OBJECT_TYPE.PROJECT,
        object_id: objectId,
        points: isPointNumeric ? points : Number(points) ,
      },
    })
  }    
  const switchOff = store => store.dispatch('SWITCH_OFF_DONATE_PANEL', {})
  export default {
    name: 'Donate',
    components: {
      BaseLightBox,
    },
    computed: {
      currentPoints () {
        return get(this.$store, 'state.personalPoints.points', 0)
      },       
      defaultAmount () {
        return get(this.targetItem, 'memoPoints', 20)
      },
      isActive () {
        return get(this.$store, 'state.donateFlag.active', false)
      },
      targetItem () {
        return get(this.$store, 'state.donateFlag.item', {})
      },
    },
    data () {
      return {
        alertMsg: '',
        donateAmount: 0,
        showDonate: false,
      }
    },
    methods: {
      closeDonate () {
        // this.showDonate = false
        switchOff(this.$store).then(() => {
          this.$router.push(`/series/${get(this.$route, 'params.slug')}`)
        })
      },
      checkDonateAmount () {
        if (isNaN(this.donateAmount)) {
          this.alertMsg = this.$t('point.DONATE.NOT_NUM')
        } else if (this.currentPoints < this.donateAmount) {
          /** show alert */
          let message = `${this.$t('point.DONATE.NOT_ENOUGH')}`
          message += `${this.$t('point.DONATE.CURRENT_PREFIX')} `
          message += `${this.currentPoints} `
          message += `${this.$t('point.DONATE.CURRENT_POSTFIX')}`
          this.alertMsg = message
        } else if (this.donateAmount < this.defaultAmount) {
          let message = `${this.$t('point.DONATE.LIMIT_PREFIX')} `
          message += `${this.defaultAmount} `
          message += `${this.$t('point.DONATE.LIMIT_POSTFIX')}`
          this.alertMsg = message
        } else {
          this.alertMsg = ''
        }
      },
      get,
      goDonate () {
        if (this.alertMsg || !get(this.targetItem, 'id') || !this.donateAmount.trim()) { return }
        deductPoints(this.$store, {
          objectId: get(this.targetItem, 'id'),
          points: this.donateAmount,
        }).then(() => {
          this.closeDonate()
        })
      },
      goDeposit () {
        switchOff(this.$store).then(() => {
          const memberCenter = get(filter(ROLE_MAP, { key: get(this.$store, 'state.profile.role'), }), '0.route', 'member')
          this.$router.push(`/${memberCenter}/records/point-manager`)
        })
      },
    },
    beforeMount () {
      this.isActive && (this.showDonate = true)
    },
    mounted () {
      this.donateAmount = get(this.targetItem, 'memoPoints', 20)
    },
    watch: {
      currentPoints () {
        this.checkDonateAmount()
      },
      defaultAmount () {
        this.donateAmount = get(this.targetItem, 'memoPoints', 20)
      },
      donateAmount () {
        debug('Mutation detected: donateAmount', this.donateAmount)
        debug('currentPoints', this.currentPoints)
        this.checkDonateAmount()
      },
      isActive () {
        this.showDonate = this.isActive
      },
    },
  }
</script>
<style lang="stylus" scoped>
  .donate-panel
    position relative
    width 320px
    height 568px
    border 5px solid #fff
    background-color #ddcf21
    padding 80px 0 230px
    background-image url(/public/icons/sponsor.png)
    background-repeat no-repeat
    background-size auto 160px
    background-position 0 368px

    &__container
      display flex
      flex-direction column
      justify-content center
      align-items center
      width 100%
      height 100%
      padding 0 20px
    &__content
      flex 1
      font-size 1.125rem
      line-height normal
      display flex
      justify-content center
      align-items center
      flex-direction column
      .project-name
        margin-top 5px
        margin-bottom 5px
        font-size 1.5625rem
        font-weight 600
        line-height normal
        color #fff
      .amount
        margin-top 20px
        font-size 1.125rem
        &-input
          margin 0 10px
          width 100px
          font-size 1.875rem
          color #fff
          vertical-align bottom
          background-color #ccbf26
          border 1px solid #ccbf26
          border-radius 5px
          text-align center
      .alert
        font-size 0.75rem
        margin-top 5px
        .deposit
          cursor pointer
          color #fff
          &:hover
            text-decoration underline

    &__confirm
      margin-top 45px
      height 50px
      width 150px
      background-color #fff
      color #ddcf21
      cursor pointer
      display flex
      justify-content center
      align-items center
      box-shadow 0 0 15px rgba(0, 0, 0, 0.15)
      border-radius 5px
      &:hover
        box-shadow 0 0 15px rgba(255, 255, 255, 0.4)
      &.block
        cursor not-allowed
      span
        font-size 1.5625rem
        font-weight 600
        line-height normal
</style>