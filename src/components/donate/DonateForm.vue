<template>
  <div class="donate">
    <header class="donate__header header">
      <img
        v-lazy="'/public/2.0/decorations/donate.png'"
      >
      <div class="header__titles">
        <p><span>贊助 READr</span><br><span>支持更多優質內容</span></p>
      </div>
    </header>
    <div class="donate__block type">
      <RadioItem
        :value="'subscription'"
        :value-selected="donateType"
        :class="{ active: donateType === 'subscription' }"
        class="type__radio"
        @change="changeDonateType"
      >
        每月定額
      </RadioItem>
      <RadioItem
        :value="'once'"
        :value-selected="donateType"
        :class="{ active: donateType === 'once' }"
        class="type__radio"
        @change="changeDonateType"
      >
        單筆贊助
      </RadioItem>
    </div>
    <div class="donate__block donate__donate-amount donate-amount">
      <h2 class="bold">
        贊助金額
      </h2>
      <div class="donate-amount__coins coins">
        <div class="coins__row">
          <button
            :class="[
              'coins__coin',
              'coin',
              { 'coin--selected': donateAmountSelected === 30 }
            ]"
            @click="toggleDomateAmount(30)"
          >
            30 元
          </button>
          <button
            :class="[
              'coins__coin',
              'coin',
              { 'coin--selected': donateAmountSelected === 60 }
            ]"
            @click="toggleDomateAmount(60)"
          >
            60 元
          </button>
          <button
            :class="[
              'coins__coin',
              'coin',
              { 'coin--selected': donateAmountSelected === 150 }
            ]"
            @click="toggleDomateAmount(150)"
          >
            150 元
          </button>
          <button
            :class="[
              'coins__coin',
              'coin',
              { 'coin--selected': donateAmountSelected === 200 }
            ]"
            @click="toggleDomateAmount(200)"
          >
            200 元
          </button>
        </div>
        <div class="coins__row">
          <button
            :class="[
              'coins__coin',
              'coin',
              { 'coin--selected': isDonateAmountCustom }
            ]"
            @click="toggleDomateAmount('custom')"
          >
            其他
          </button>
          <div
            v-show="isDonateAmountCustom"
            class="coins__custom-coin-input custom-coin-input"
          >
            <div class="custom-coin-input__top">
              <input
                v-model.number.lazy="donateAmountCustom"
                type="number"
              >
              <p>元</p>
            </div>
            <div class="custom-coin-input__bottom">
              <p>(單筆贊助最低 30 元，最高 2000 元)</p>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="donate__block donate__contact contact">
      <h2 class="bold">
        付款人資訊
      </h2>
      <div class="contact__form form">
        <div class="form__row form__contact">
          <h2>姓名</h2>
          <input
            v-model="contactInputs.contactName"
            type="text"
          >
        </div>
        <div class="form__row form__contact">
          <h2>Email</h2>
          <input
            v-model="contactInputs.contactEmail"
            type="email"
          >
        </div>
        <div class="form__row form__contact">
          <h2>電話</h2>
          <input
            v-model="contactInputs.contactPhone"
            type="tel"
          >
        </div>
      </div>
    </div>
    <div class="donate__block donate__payment-method-forms payment-method-forms">
      <!-- <h1>付款方式</h1> -->
      <div class="payment-method-forms__form form">
        <h2 class="bold">
          信用卡資訊
        </h2>
        <div class="form__row form__card-number">
          <h2>卡號</h2>
          <div
            id="card-number"
            class="tpfield"
          />
        </div>
        <div class="form__row form__expire-date">
          <h2>到期日</h2>
          <div
            id="card-expiration-date"
            class="tpfield"
          />
        </div>
        <div class="form__row form__security-code">
          <h2>末三碼</h2>
          <div
            id="card-ccv"
            class="tpfield"
          />
        </div>
      </div>
    </div>
    <div class="donate__block donate__carriers carriers">
      <h2 class="bold">
        電子發票
      </h2>
      <div class="carriers__carrier carrier">
        <RadioItem
          :value="'carrierEmail'"
          :value-selected="carrierTypeSelected"
          @change="changeCarrierType"
        >
          Email 載具
        </RadioItem>
        <div
          v-show="carrierTypeSelected === 'carrierEmail'"
          class="carrier__inputs"
        >
          <input
            v-model="carrierInputs.carrierEmail"
            type="text"
            placeholder="如：readr@readr.tw"
          >
        </div>
      </div>
      <div class="carriers__carrier carrier">
        <RadioItem
          :value="'carrierPhone'"
          :value-selected="carrierTypeSelected"
          @change="changeCarrierType"
        >
          手機條碼載具
        </RadioItem>
        <div
          v-show="carrierTypeSelected === 'carrierPhone'"
          class="carrier__inputs"
        >
          <input
            v-model="carrierInputs.carrierPhone"
            type="text"
            placeholder="如：/1234ABC"
          >
        </div>
      </div>
      <div class="carriers__carrier carrier">
        <RadioItem
          :value="'carrierNatural'"
          :value-selected="carrierTypeSelected"
          @change="changeCarrierType"
        >
          自然人憑證條碼
        </RadioItem>
        <div
          v-show="carrierTypeSelected === 'carrierNatural'"
          class="carrier__inputs"
        >
          <input
            v-model="carrierInputs.carrierNatural"
            type="text"
            placeholder="如：AB00001234567890"
          >
        </div>
      </div>
      <div class="carriers__carrier carrier">
        <RadioItem
          :value="'carrierBusiness'"
          :value-selected="carrierTypeSelected"
          @change="changeCarrierType"
        >
          三聯式發票
        </RadioItem>
        <div
          v-show="carrierTypeSelected === 'carrierBusiness'"
          class="carrier__inputs"
        >
          <input
            v-model="carrierInputs.carrierBusiness.title"
            type="text"
            placeholder="請填入您的公司抬頭"
          >
          <input
            v-model="carrierInputs.carrierBusiness.taxNumber"
            type="text"
            placeholder="請填入您的公司統一編號"
          >
          <input
            v-model="carrierInputs.carrierBusiness.address"
            type="text"
            placeholder="請填入您的發票寄送地址"
          >
        </div>
      </div>
    </div>
    <div class="donate__block donate__buttons buttons">
      <button
        :class="[
          'buttons__button',
          'button',
          { 'button--yellow': isFormValid }
        ]"
        @click="submitForm"
      >
        確認付款
      </button>
    </div>
  </div>
</template>

<script>
import { get } from 'lodash'
import dayjs from 'dayjs'
import { mapState } from 'vuex'

import RadioItem from 'src/components/RadioItem/RadioItem.vue'

const debug = require('debug')('CLIENT:SidebarDonateForm')

const donate = (store, {
  points,
  token,
  invoiceItem,

  // eslint-disable-next-line camelcase
  member_phone,

  // eslint-disable-next-line camelcase
  member_name,

  // eslint-disable-next-line camelcase
  member_mail,

  // eslint-disable-next-line camelcase
  object_id,

  reason
} = {}) => store.dispatch('DONATE', {
  params: {
    object_type: 5,
    object_id,
    reason,
    currency: points,
    token,
    member_name,
    member_phone,
    member_mail,
    invoiceItem
  }
})

const subscribe = (store, params = {}) => store.dispatch('SUBSCRIBE', params)

const CARRIER_TYPE_NUM = {
  carrierEmail: '2',
  carrierPhone: '0',
  carrierNatural: '1',
  carrierBusiness: undefined
}

export default {
  name: 'DonateForm',
  components: {
    RadioItem
  },
  data () {
    return {
      donateAmountSelected: 0,
      isDonateAmountCustom: false,
      donateAmountCustomInternal: 30,

      isCardInfoValid: false,

      carrierTypeSelected: '',
      carrierInputs: {
        carrierEmail: get(this.$store.state, [ 'DataUser', 'profile', 'mail' ], ''),
        carrierPhone: '',
        carrierNatural: '',
        carrierBusiness: {
          address: '',
          title: '',
          taxNumber: ''
        }
      },
      contactInputs: {
        contactName: get(this.$store.state, [ 'DataUser', 'profile', 'nickname' ], ''),
        contactEmail: get(this.$store.state, [ 'DataUser', 'profile', 'mail' ], ''),
        contactPhone: ''
      },

      donateType: 'subscription',

      isTappayInitialized: false,

      isDepositing: false
    }
  },
  computed: {
    donateAmount () {
      return this.isDonateAmountCustom ? this.donateAmountCustom : this.donateAmountSelected
    },
    donateAmountCustom: {
      get () {
        return this.donateAmountCustomInternal
      },
      set (value) {
        if (value < 30) {
          this.donateAmountCustomInternal = 30
        } else if (value > 2000) {
          this.donateAmountCustomInternal = 2000
        } else {
          this.donateAmountCustomInternal = value
        }
      }
    },

    isFormValid () {
      const isDonateAmountValid =
        this.donateAmountSelected !== 0 ||
        (this.isDonateAmountCustom && this.donateAmountCustomInternal >= 30 && this.donateAmountCustomInternal <= 2000)
      const isPaymentMethodValid =
        this.isCardInfoValid
      const isCarrierValid =
        this.carrierTypeSelected !== '' &&
        this.carrierInputs[this.carrierTypeSelected] !== ''
      const isContactValid =
        this.contactInputs.contactName !== '' &&
        this.contactInputs.contactEmail !== '' &&
        this.contactInputs.contactPhone !== ''

      const isCarrierBusiness = this.carrierTypeSelected === 'carrierBusiness'
      let isCarrierBusinessInfoValid = true
      if (isCarrierBusiness) {
        isCarrierBusinessInfoValid = this.carrierInputs.carrierBusiness.address &&
          this.carrierInputs.carrierBusiness.taxNumber &&
          this.carrierInputs.carrierBusiness.title
      }

      return isDonateAmountValid &&
             isPaymentMethodValid &&
             isCarrierValid &&
             isContactValid &&
             isCarrierBusinessInfoValid
    },

    // isTappayLoaded () {
    //   return get(this.$store, 'state.isTappayLoaded', false)
    // },
    configTappay () {
      return get(this.$store, 'state.setting.TAPPAY')
    },

    carrierInfo () {
      const carrierType = CARRIER_TYPE_NUM[this.carrierTypeSelected]
      const carrierNum = get(this.carrierInputs, this.carrierTypeSelected, '')
      const category = this.carrierTypeSelected === 'carrierBusiness' ? 2 : 1
      return { carrierType, carrierNum, category }
    },

    ...mapState({
      seriesData: state => get(state.DataPost, 'post', {}),
      singleSeries: state => state.DataSeries.singleSeries
    }),
    seriesId () {
      return this.$route.name === 'series' ? get(this.singleSeries, 'id', null) : get(this.seriesData, 'projectId', null)
    }
  },
  mounted () {
    !this.isTappayInitialized && this.initialTappay()
  },
  methods: {
    toggleDomateAmount (value) {
      if (value === 'custom') {
        this.isDonateAmountCustom = true
        this.donateAmountSelected = 0
      } else {
        this.isDonateAmountCustom = false
        this.donateAmountSelected = value
      }
    },

    changeCarrierType (newType) {
      this.carrierTypeSelected = newType
    },

    changeDonateType (type) {
      this.donateType = type
    },

    processSubscription (primeResult, now) {
      const invoiceCategoryMapping = {
        1: 'B2C',
        2: 'B2B',
        default: 'B2C'
      }
      const email = get(this.contactInputs, 'contactEmail', '')
      const contactName = get(this.contactInputs, 'contactName', '')
      const invoiceCategory = get(this.carrierInfo, 'category')
      const invoiceCarrierType = get(this.carrierInfo, 'carrierType')
      let requestBody = {
        amount: this.donateAmount,
        email,
        createdAt: now.toISOString(),
        paymentInfos: {
          prime: primeResult.card.prime,
          cardholder: {
            phoneNumber: get(this.contactInputs, 'contactPhone', ''),
            name: contactName,
            email
          }
        },
        invoiceInfos: {
          category: invoiceCategoryMapping[invoiceCategory] || invoiceCategory.default,
          buyerName: contactName,
          buyerEmail: email,
          itemPrice: [ this.donateAmount ],
          lastFourNum: primeResult.card.lastfour // for readr-web-api log
        }
      }
      const memberId = get(this.$store, 'state.DataUser.profile.id')
      if (memberId) {
        requestBody.memberId = memberId
      }
      if (invoiceCarrierType === '2') { // Email 載具
        requestBody.invoiceInfos.buyerEmail = get(this.carrierInputs, 'carrierEmail')
      }
      if (this.carrierTypeSelected === 'carrierBusiness') {
        requestBody.invoiceInfos.buyerUbn = get(this.carrierInputs, 'carrierBusiness.taxNumber')
        requestBody.invoiceInfos.buyerName = get(this.carrierInputs, 'carrierBusiness.title') || contactName
        requestBody.invoiceInfos.buyerAddress = get(this.carrierInputs, 'carrierBusiness.address')
      }
      if (this.carrierTypeSelected !== 'carrierBusiness') {
        requestBody.invoiceInfos.carrierType = invoiceCarrierType
        requestBody.invoiceInfos.carrierNum = get(this.carrierInfo, 'carrierNum')
      }
      return subscribe(this.$store, requestBody)
    },

    processOnce (primeResult, now) {
      return donate(this.$store, {
        invoiceItem: {
          businessTitle: get(this.carrierInputs, ['carrierBusiness', 'title']),
          businessTaxNo: get(this.carrierInputs, ['carrierBusiness', 'taxNumber']),
          businessAddress: get(this.carrierInputs, 'carrierBusiness.address'),
          carrierType: get(this.carrierInfo, 'carrierType'),
          carrierNum: get(this.carrierInfo, 'carrierNum'),
          category: get(this.carrierInfo, 'category'),
          lastFourNum: primeResult.card.lastfour
        },
        points: this.donateAmount,
        token: primeResult.card.prime,
        member_name: get(this.contactInputs, 'contactName', ''),
        member_mail: get(this.contactInputs, 'contactEmail', ''),
        member_phone: get(this.contactInputs, 'contactPhone', ''),
        object_id: this.seriesId,
        reason: location && location.pathname
      })
    },

    submitForm () {
      if (this.isFormValid) {
        this.isDepositing = true
        window.TPDirect.card.getPrime(result => {
          if (result.status !== 0) {
            debug('get prime error ' + result.msg)
            this.isDepositing = false
            this.$emit('showResultFail')
            return
          }

          const submitStrategy = {
            once: this.processOnce,
            subscription: this.processSubscription
          }

          const now = new Date()

          debug('get prime successfully: ' + result.card.prime)

          submitStrategy[this.donateType] && submitStrategy[this.donateType](result, now)
            .then(() => {
              this.$emit('submitForm', {
                isSubscription: this.donateType === 'subscription',
                donateAmount: this.donateAmount,
                carrierTypeSelected: this.carrierTypeSelected,
                carrierInputs: this.carrierInputs[this.carrierTypeSelected],
                date: dayjs(now).format('YYYY/MM/DD HH:mm:ss')
              })
              this.isDepositing = false
              this.$emit('showResultSuccess')
            })
            .catch(err => {
              console.error(err)
              this.isDepositing = false
              this.$emit('showResultFail')
            })
        })
      }
    },

    initialTappay () {
      window.TPDirect.setupSDK(
        get(this.configTappay, 'APP_ID', ''),
        get(this.configTappay, 'SECRET', ''),
        get(this.configTappay, 'ENV', 'sandbox')
      )
      window.TPDirect.card.setup({
        fields: {
          number: {
            element: '#card-number',
            placeholder: '**** **** **** ****'
          },
          ccv: {
            element: '#card-ccv',
            placeholder: '末三碼'
          },
          expirationDate: {
            element: document.getElementById('card-expiration-date'),
            placeholder: 'MM / YY'
          }
        },
        styles: {
          'input': { 'color': 'black', 'font-size': '16px' },
          // 'input.cvc': {},
          // 'input.expiration-date': {},
          // 'input.card-number': {},
          // ':focus': {},
          '.valid': { 'color': 'black' },
          '.invalid': { 'color': 'red' }
        }
      })
      window.TPDirect.card.onUpdate(update => {
        if (update.canGetPrime) {
          debug('no wrong data.')
          this.isCardInfoValid = true
        } else {
          this.isCardInfoValid = false
        }
        if (update.hasError) {
          debug('invalid data found.')
        }

        if (update.status.number === 2) {
          debug('invalid card number')
        } else if (update.status.number === 0) {
          debug('card number: passed.')
        } else {
          debug('wating to fill card number.')
        }

        if (update.status.expiry === 2) {
          debug('incalid expiry')
        } else if (update.status.expiry === 0) {
          debug('expiry: passed')
        } else {
          debug('watiing to fill card expiry')
        }

        if (update.status.cvc === 2) {
          debug('incalid cvc')
        } else if (update.status.cvc === 0) {
          debug('cvc: passed')
        } else {
          debug('watiing to fill card cvc')
        }
      })
      this.isTappayInitialized = true
    }
  }
}
</script>

<style lang="stylus" scoped>
.donate
  padding 0 0 50px
  h2
    font-weight 400
    &.bold
      font-weight 500
  &__block
    width 90%
    max-width 640px
    margin 0 auto
    & + &
      margin-top 20px
    + .donate__buttons
      margin-top 70px
  &__header
    position relative
    + *
      margin-top 40px

.header
  width 100%
  height 80px
  background-color #ddcf21
  display flex
  align-items center
  img
    height 84px
    position absolute
    top 5px
    left 0
  &__titles
    margin 0 0 0 115px

.donate-amount
  &__coins
    margin 8px 0 0 0

.coins
  &__row
    display flex
    align-items center
    & + &
      margin 8px 0 0 0
  &__coin
    & + &
      margin 0 0 0 8px
  &__custom-coin-input
    margin 0 0 0 8px

.coin
  d = 60px
  width d
  height d
  border-radius d
  border 1px solid black
  cursor pointer
  font-size 16px
  padding 0
  &:focus
    outline none
  &--selected
    background-color #ddcf21

.custom-coin-input
  &__top
    display flex
    align-items center
    input
      -webkit-appearance none
      border-radius 0
      box-shadow inset 0 1px 3px 0 rgba(0,0,0,0.5)
      border none
      // width 150px
      height 30px
      padding 6px 10px
      font-size 16px
      &:focus
        outline none
    p
      margin 0 0 0 10px
  &__bottom
    margin 3px 0 0 0
    p
      font-size 12px

.payment-method-forms
  &__form
    margin 10px 0 0 0

.form
  &__row
    margin 10px 0 0 0
  &__contact
    input
      -webkit-appearance none
      border-radius 0
      box-shadow inset 0 1px 3px 0 rgba(0,0,0,0.5)
      border none
      width 100%
      height 30px
      padding 6px 10px
      margin 5px 0 0 0
      font-size 16px
      &::placeholder
        font-size 16px
        color #9b9b9b
        line-height normal

.tpfield
  margin 5px 0 0 0
  height 30px
  box-shadow inset 0 1px 3px 0 rgba(0,0,0,0.5)
  border none
  padding 6px 10px
  font-size 12px

.carriers
  &__carrier
    margin 10px 0 0 0

.carrier
  &__inputs
    margin 10px 0 0 0
    padding 0 0 0 30px
    input
      -webkit-appearance none
      border-radius 0
      box-shadow inset 0 1px 3px 0 rgba(0,0,0,0.5)
      border none
      width 100%
      height 30px
      padding 6px 10px
      font-size 16px
      &::placeholder
        font-size 16px
        color #9b9b9b
        line-height normal
    input + input
      margin 10px 0 0 0

.button
  width 100%
  height 50px
  border-radius 8px
  background-color gray
  font-size 1.5rem
  font-weight 500
  display flex
  justify-content center
  align-items center
  &--yellow
    background-color #ddcf21

.type
  display flex
  &__radio
    flex 1
    height 40px
    line-height 40px
    border 1px solid #9b9b9b
    & + .type__radio
      border-left none
    &.active
      background-color #ddcf21
      box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.5)
    >>> .wrapper__label
      margin 0 auto
      font-size 1rem
    >>> .wrapper__checkmark
      display none
@media (min-width 768px)
  .donate
    h1
      font-size 24px
      font-weight 500
    h2
      font-size 16px
      font-weight 500
    &__block
      width 60%
      & + &
        margin-top 36px

  .header
    justify-content center
    &__titles
      margin 0
      p
        font-size 30px

  .donate-amount
    &__coins
      margin 12px 0 0 0

  .coins
    &__row
      & + &
        margin 20px 0 0 0
    &__coin
      & + &
        margin 0 0 0 20px
    &__custom-coin-input
      margin 0 0 0 20px

  .custom-coin-input
    &__top
      input
        width 200px
</style>
