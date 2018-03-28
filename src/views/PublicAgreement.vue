<template>
  <main class="agreement">
    <Tab :tabs="tabs">
      <div slot="0" class="agreement__item" v-html="agreementContent"></div>
      <div slot="1">NA</div>
      <div slot="2">NA</div>
    </Tab>
  </main>
</template>
<script>
  import { AGREEMENT_CONTENT, } from '../constants/agreement'
  import Tab from '../components/Tab.vue'

  export default {
    components: {
      Tab,
    },
    data () {
      return {
        agreementContent: AGREEMENT_CONTENT,
        tabs: [
          this.$t('agreement.WORDING_AGREEMENT_TERMS_AND_SERVICE'),
          this.$t('agreement.WORDING_AGREEMENT_IPR'),
          this.$t('agreement.WORDING_AGREEMENT_PRIVACY'),
        ],
      }
    },
    name: 'agreement',
    methods: {
      navClickHandler (itemIndex) {
        this.activeItem = itemIndex
      },
    },
    mounted () {},
  }
</script>
<style lang="stylus" scoped>
  .agreement
    width 100%
    min-height 100vh
    padding-top 70px
    background-color #fff
    &__item
      text-align justify
   
</style>