<template>
  <section class="invite">
    <div class="invite__title" @click="$_invite_toggle">
      <span class="invite__title-text" v-text="$t('INVITATION.TITLE')"></span>
      <span class="invite__title-count" v-text="inviteableCount"></span>
    </div>
    <div ref="inviteForm" class="invite__form">
      <h2 v-text="$t('INVITATION.EMAIL_ADDRESS')"></h2>
      <template v-for="n in inviteableCount">
        <input :key="n" type="text" :placeholder="$t('INVITATION.PLACEHOLDER')">
      </template>
      <button v-text="$t('INVITATION.BTN_CANCEL')"></button>
      <button v-text="$t('INVITATION.BTN_SUBMIT')"></button>
    </div>
  </section>
</template>
<script>
  export default {
    name: 'AppInvite',
    data () {
      return {
        inviteableCount: 5,
      }
    },
    mounted () {},
    methods: {
      $_invite_toggle () {
        this.$refs.inviteForm.classList.toggle('open')
      },
    },
  }
</script>
<style lang="stylus" scoped>
  .invite
    &__title
      position relative
      height 40px
      padding 0 10px
      text-align right
      background-color #11b8c9
      &-text
        position relative
        padding-right 35px
        font-size .9375rem
        line-height 40px
        &:before
          content ''
          position absolute
          top -4px
          right 0
          width 25px
          height 30px
          background-image url('/public/icons/invite.png')
          background-size contain
          background-position center center
      &-count
        position absolute
        top 8px
        right 18px
        color #fff
        font-size .9375rem
    &__form
      max-height 0
      text-align center
      background-color #fff
      overflow hidden
      transition max-height .5s ease-out
      &.open
        max-height 1000px
        transition max-height 1.5s ease-out
      h2
        display none
      input
        width calc(100% - 20px)
        margin-bottom 10px
        padding 4px 0 4px 10px
        font-size .6875rem
        border 1px solid #808080
        &:first-of-type
          margin-top 15px
      button
        width calc(50% - 15px)
        height 20px
        margin 0 10px 15px 0
        color #fff
        font-size .6875rem
        font-weight 300
        background-color #11b8c9
        border none
        &:first-of-type
          margin-left 10px
  @media (min-width 768px)
    .invite
      &__title
        padding 0 60px
        &-count
          right 68px
      &__form
        // padding 10px 60px 30px
        h2
          display block
          margin 10px 0 10px 0
          font-size .9375rem
        input
          height 25px
          font-size .75rem
          &:first-of-type
            margin-top 0
        button
          // width calc(50% - 7.5px)
          // margin-right 15px
          font-size .9375rem
</style>
