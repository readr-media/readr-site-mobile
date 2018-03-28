<template>
  <div class="about" v-if="profile">
    <div class="about__thumbnail">
      <img :src="thumbnail">
    </div>
    <div class="about__name">
      <span class="name" v-text="name"></span>
      <span class="role" v-text="`（${role}）`" v-if="role"></span>
    </div>
    <div class="about__introduction" v-text="introduction"></div>
    <div class="about__edit" v-if="isCurrUser">
      <span class="about__edit__btn" v-text="editText" @click="goEdit"></span>
    </div>
    <BaseLightBox :showLightBox.sync="showLightBox" borderStyle="nonBorder">
      <BaseLightBoxProfileEdit :showLightBox="showLightBox" :profile="profile"/>
    </BaseLightBox>
  </div>
</template>
<script>
  import { filter, get, } from 'lodash'
  import { ROLE_MAP, } from 'src/constants'
  import BaseLightBox from 'src/components/BaseLightBox.vue'
  import BaseLightBoxProfileEdit from 'src/components/BaseLightBoxProfileEdit.vue'

  const debug = require('debug')('CLIENT:About')
  export default {
    components: {
      BaseLightBox,
      BaseLightBoxProfileEdit,
    },
    computed: {
      isCurrUser () {
        const currUser = get(this.$store, 'state.profile.id')
        debug('currUser', currUser)
        debug('profile', get(this.profile, 'id'))
        return currUser === get(this.profile, 'id')
      },
      introduction () {
        return get(this.profile, [ 'description', ], '')
      },
      name () {
        return get(this.profile, [ 'nickname', ])
      },
      role () {
        return get(filter(ROLE_MAP, { key: get(this.profile, [ 'role', ]), }), [ 0, 'value', ])
      },
      thumbnail () {
        return get(this.profile, [ 'profileImage', ]) || '/public/icons/exclamation.png'
      },
    },
    data () {
      return {
        editText: '(edit)',
        showLightBox: false,
      }
    },
    name: 'about',
    methods: {
      goEdit () {
        debug('isCurrUser', this.isCurrUser)
        this.isCurrUser && (this.showLightBox = true)
      },
    },
    mounted () {},
    props: [ 'profile', ],
  }
</script>
<style lang="stylus" scoped>
  .about
    position relative
    width 100%
    min-height 100px
    margin 0 auto
    padding 0 20px 0 70px
    &__thumbnail
      position absolute
      left 20px
      top 0
      width 40px
      height 40px
      border 1px solid #979797
      border-radius 50%
      overflow hidden
      > img
        width 100%
        height 100%
        object-fit cover
        object-position center center
    &__name
      font-size .75rem
    &__introduction
      margin-top 5px
      font-size .75rem
      line-height 1.5
      text-align justify
    &__edit
      text-align right
      &__btn
        color #4280a2
        font-size .75rem
        font-weight 600
        cursor pointer
  // .about
  //   width 100%
  //   min-height 100px
  //   margin 20px auto
  //   padding 0 20px
  //   position relative
  //   color #000
  //   &__thumbnail
  //     position absolute
  //     left 0
  //     top 0
  //     width 40px
  //     height 40px
  //     border 1px solid #979797
  //     border-radius 50%
  //     overflow hidden
  //     > img
  //       width 100%
  //       height 100%
  //       object-fit contain
  //       object-position center center
  //       // box-shadow inset 0 0 0 10px #fff
  //   &__name
  //     font-size 1.125rem
  //   &__introduction
  //     margin-top 10px
  //     font-size 0.9375rem
  //     font-weight 300
  //     line-height 1.375rem
  //   &__edit
  //     text-align right
  //     &__btn
  //       color #4280a2
  //       font-weight 600
  //       cursor pointer
  // @media (min-width 950px)
  //   .about
  //     max-width 950px
</style>