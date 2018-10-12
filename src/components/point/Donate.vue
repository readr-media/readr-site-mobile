<template>
  <BaseLightBox borderStyle="nonBorder" :showLightBox.sync="showDonate" @closeLightBox="closeDonate()">
    <div class="donate-panel">
      <div class="donate-panel__container">
        <div class="donate-panel__wrapper" :class="{ center: !get(me, 'id') }" ref="content">
          <template v-if="isClientSide && get(me, 'id')">
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
              </div>
              <DonateDetail @resize="checkBottom"
                :rest="currentPoints"
                :amount="isNaN(donateAmount) ? 0 : typeof(donateAmount) === Number ? donateAmount : Number(donateAmount)"
                :type="alertType"></DonateDetail>
            </div>
            <div class="donate-panel__confirm" v-if="alertType !== 0" :class="{ block: alertMsg, }" @click="goDonate"><span v-text="$t('point.DONATE.CONFIRM')"></span></div>
            <div class="donate-panel__confirm" v-else @click="goClearUp"><span v-text="$t('point.DONATE.GO_CLEAR_UP')"></span></div>
          </template>
          <template v-else>
            <div class="donate-panel__content">
              <div class="appreciate"><span v-text="$t('point.DONATE.HAVE_TO_LOGIN')"></span></div>
            </div>
            <div class="donate-panel__confirm" @click="goLogin"><span v-text="$t('point.DONATE.LOG_IN')"></span></div>
          </template>
        </div>
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
  import { redirectToLogin, } from 'src/util/services'

  const DEFAULT_DONATION_POINT_MIN_LINE = DONATION_POINT_MIN_LINE || -100
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
  const fetchCurrPoints = store => store.dispatch('GET_POINT_CURRENT', { params: {}, })
  const switchOff = store => store.dispatch('SWITCH_OFF_DONATE_PANEL', {})
  const switchOnTappay = (store, item) => store.dispatch('SWITCH_ON_TAPPAY_PANEL', { active: true, item, })
  export default {
    name: 'Donate',
    components: {
      BaseLightBox,
      DonateDetail,
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
      isClientSide,
      me () {
        return get(this.$store, 'state.profile', {})
      },
      targetItem () {
        return get(this.$store, 'state.donateFlag.item', {})
      },
    },
    data () {
      return {
        alertMsg: '',
        alertType: 0,
        donateAmount: 0,
        showDonate: false,
      }
    },
    methods: {
      checkBottom () {

      },
      closeDonate () {
        // this.showDonate = false
        switchOff(this.$store).then(() => {
          this.$router.push(`/series/${get(this.$route, 'params.slug')}`)
        })
      },
      checkDonateAmount () {
        /**
         *  ## alertType
         *    0: have to clear up,
         *    1: donation is too less
         */
        this.alertType = 1
        if (isNaN(this.donateAmount)) {
          this.alertMsg = this.$t('point.DONATE.NOT_NUM')
        } else if (this.donateAmount < this.defaultAmount) {
          let message = `${this.$t('point.DONATE.LIMIT_PREFIX')} `
          message += `${this.defaultAmount} `
          message += `${this.$t('point.DONATE.LIMIT_POSTFIX')}`
          this.alertMsg = message
        } else if (this.currentPoints - this.donateAmount < DEFAULT_DONATION_POINT_MIN_LINE) {
          let message = `${this.$t('point.DONATE.NOT_ENOUGH_PREFIX')}`
          this.alertType = 0
          message += ` ${DEFAULT_DONATION_POINT_MIN_LINE} `
          message += `${this.$t('point.DONATE.NOT_ENOUGH_POSTFIX')}`
          message += `${this.$t('point.DONATE.GO_CLEAR_UP_PREFIX')}`
          message += ` ${Math.abs(this.currentPoints - this.donateAmount)} `
          message += `${this.$t('point.DONATE.GO_CLEAR_UP_POSTFIX')}`
          this.alertMsg = message
        } else {
          this.alertMsg = ''
        }
      },
      get,
      goClearUp () {
        switchOnTappay(this.$store, {
          amount: Math.abs(this.currentPoints - this.donateAmount),
          callback: () => {
            Promise.all([
              deductPoints(this.$store, {
                objectId: get(this.targetItem, 'id'),
                points: this.donateAmount,
              }),
              switchOff(this.$store),
            ]).then(() => {
              this.$router.push(`/series/${get(this.$route, 'params.slug')}`)
            })
          },
        })        
      },
      goDonate () {
        if (this.alertMsg || !get(this.targetItem, 'id') || !(`${this.donateAmount}`).trim()) { return }
        deductPoints(this.$store, {
          objectId: get(this.targetItem, 'id'),
          points: this.donateAmount,
        }).then(() => {
          this.closeDonate()
        })
      },
      goLogin () {
        redirectToLogin(this.$route.fullPath)
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
        this.showDonate && fetchCurrPoints(this.$store)
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
    padding 40px 0 190px
    background-image url(/public/icons/sponsor.png)
    background-repeat no-repeat
    background-size auto 160px
    background-position 0 368px

    &__container
      overflow hidden
      display flex
      flex-direction column
      justify-content center
      align-items center
      width 100%
      height 100%
      padding 0 20px
    &__content
      flex 1
      font-size 1rem
      line-height normal
      display flex
      justify-content center
      align-items center
      flex-direction column
      > div
        width 100%
      .project-name
        margin-top 5px
        margin-bottom 5px
        font-size 1.25rem
        font-weight 600
        line-height normal
        color #fff
      .amount
        margin-top 10px
        font-size 1rem
        &-input
          margin 0 10px
          width 100px
          font-size 1.25rem
          color #fff
          vertical-align bottom
          background-color #ccbf26
          border 1px solid #ccbf26
          border-radius 5px
          text-align center
      .alert
        font-size 0.75rem
        margin 5px 0
        .deposit
          cursor pointer
          color #fff
          &:hover
            text-decoration underline
    &__wrapper
      width 100%
      height 100%
      overflow auto
      padding-bottom 30px
      // display flex
      // flex-direction column
      // align-items center
      // text-align center
      > div
        width 100%
      &.center
        display flex
        flex-direction column

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