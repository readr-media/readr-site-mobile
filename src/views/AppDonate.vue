<template>
  <section class="app-donate">
    <DonateForm
      v-show="!showResult"
      @submitForm="onFormSubmit"
      @showResultSuccess="onShowResultSuccess"
      @showResultFail="onShowResultFail"
    />
    <DonateResult
      v-show="showResult"
      :is-result-success="isResultSuccess"
      :form-data="formData"
      @backToForm="showResult = false"
    />
  </section>
</template>

<script>
import { SITE_NAME } from 'src/constants'
import DonateForm from 'src/components/donate/DonateForm.vue'
import DonateResult from 'src/components/donate/DonateResult.vue'

export default {
  name: 'AppDonate',
  components: {
    DonateForm,
    DonateResult
  },
  metaInfo: {
    title: '贊助 READr',
    meta: [
      { vmid: 'og:title', property: 'og:title', content: `贊助 READr - ${SITE_NAME}` }
    ]
  },
  data () {
    return {
      showResult: false,
      isResultSuccess: false,
      formData: {
        donateAmount: 0,
        carrierTypeSelected: '',
        carrierInputs: '',
        date: ''
      }
    }
  },
  methods: {
    onFormSubmit (formData) {
      this.$set(this, 'formData', formData)
    },
    onShowResultSuccess () {
      this.showResult = true
      this.isResultSuccess = true
    },
    onShowResultFail () {
      this.showResult = true
      this.isResultSuccess = false
    }
  }
}
</script>

<style lang="stylus" scoped>
.app-donate
  padding 40px 0 0
  @media (min-width 768px)
    padding 50px 0 0
</style>
