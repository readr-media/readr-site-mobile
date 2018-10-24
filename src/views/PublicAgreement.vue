<template>
  <main class="agreement">
    <Tab :tabs="tabs">
      <div slot="0" class="agreement__item" v-html="AGREEMENT_CONTENT"></div>
      <div slot="1" class="agreement__item" v-html="IPR_CONTENT"></div>
      <div slot="2" class="agreement__item" v-html="PRIVACY_CONTENT"></div>
    </Tab>
  </main>
</template>
<script>
  import { AGREEMENT_CONTENT, IPR_CONTENT, PRIVACY_CONTENT, } from '../constants/agreement'
  import Tab from '../components/Tab.vue'

  export default {
    components: {
      Tab,
    },
    data () {
      return {
        AGREEMENT_CONTENT,
        IPR_CONTENT,
        PRIVACY_CONTENT,
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
      & >>> h3
        margin 40px 0
        font-size 20px
        letter-spacing .5px
        line-height 1.25
      & >>> p
        margin 30px 0
        font-size 15px
        line-height 1.6
        letter-spacing .5px
        text-align justify
        > span
          margin 5px 0
          display block
      & >>> .footer
        font-size 12px
   
</style>