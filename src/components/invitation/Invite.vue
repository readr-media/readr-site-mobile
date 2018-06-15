<template>
  <section class="invite" :class="{ hide: quota <= 0, }">
    <div class="invite__title" @click="$_invite_toggle">
      <span class="invite__title-text" v-text="$t('INVITATION.TITLE')"></span>
      <div class="invite__title-count">
        <span v-text="quota"></span>
      </div>
    </div>
    <div ref="inviteForm" class="invite__form">
      <h2 v-text="$t('INVITATION.EMAIL_ADDRESS')"></h2>
      <div class="item__container" v-for="i in activeItemsCount">
        <TextItem class="item input" v-if="isOpen"
          :alert.sync="emailAlert[ i ]"
          :alertPosition="'bottom'"
          :height="'25px'"
          :border="'solid 1px #d3d3d3'"
          :disabled="isSent || isProcessing"
          :backgroundColor="inputBackgroundColor"
          :fontSize="'0.75rem'"
          :placeHolder="$t('INVITATION.EMAIL_EXAMPLE')"
          :value.sync="emails[ i ]"
          :key="`email${i}`"></TextItem>
        <Spinner class="spinner" :show="isProcessing" height="22px"></Spinner> 
      </div>
      <div class="item__container" v-if="quota > activeItemsCount" @click="$_invite_addItem"><div class="item add-item"></div></div>
      <button v-text="$t('INVITATION.BTN_CANCEL')" @click="$_invite_remove" :class="{ disabled: isProcessing }"></button>
      <button v-text="$t('INVITATION.BTN_SUBMIT')" @click="$_invite_submit" :class="{ disabled: isProcessing || !find(emails, email => email) }"></button>
    </div>
  </section>
</template>
<script>
  import Spinner from 'src/components/Spinner.vue'
  import TextItem from 'src/components/form/TextItem.vue'
  import validator from 'validator'
  import { filter, find, get, map, } from 'lodash'

  const debug = require('debug')('CLIENT:AppInvite')
  const fetchQuota = (store) => {
    return store.dispatch('FETCH_INVITATIONO_QUOTA')
  }
  const invite = (store, params) => {
    return store.dispatch('INVITE', {
      params,
    })
  }

  export default {
    name: 'AppInvite',
    components: {
      Spinner,
      TextItem,
    },
    computed: {
      activeItemsCount () {
        return this.inviteableCount
      },
      inputBackgroundColor () {
        return this.isProcessing ? '#f6f6f6' : undefined
      },
      inviteStyle () {
        return {
          height: this.isOn ? `${ 40 * this.activeItemsCount + 275 }px` : '140px',
        }
      },
      quota () {
        return get(this.$store, 'state.invitation_quota')
      },      
    },
    data () {
      return {
        inviteableCount: 0,
        emails: {},
        emailAlert: {},
        emailsStatus: {},
        isOpen: false,
        isSent: false,
        isProcessing: false,        
      }
    },
    beforeMount () {
      debug('curr_user beforeMount.')
      Promise.all([
        fetchQuota(this.$store),
      ])
    },
    watch: {
      curr_user: function () {
        debug('curr_user change detected.')
        Promise.all([
          fetchQuota(this.$store),
        ])
      },
      quota: function () {
        this.inviteableCount = this.quota > 3 ? 3 : this.quota
      },
    },
    methods: {
      find,
      $_invite_submit () {
        if (!find(this.emails, email => email)) { return }
        this.isProcessing = true
        if (this.$_invite_validate()) {
          invite(this.$store, {
            emails: filter(this.emails, email => email),
          }).then(() => {
            return fetchQuota(this.$store).then(() => {
              debug('INVITE DONE')
              this.isProcessing = false
              this.$_invite_remove()
              this.$forceUpdate()
            })
          })
        } else {
          this.isProcessing = false
        }
      },
      $_invite_addItem () {
        if (this.isProcessing) { return }
        this.inviteableCount += 1
      },
      $_invite_toggle () {
        this.$refs.inviteForm.classList.toggle('open')
        this.isOpen = !this.isOpen
      },
      $_invite_remove () {
        this.$refs.inviteForm.classList.remove('open')
        this.isOpen = false
      },
      $_invite_validate () {
        let pass = true
        map(this.emails, (email, index) => {
          if (email && !validator.isEmail(email)) {
            pass = false
            this.emailAlert[ index ] = {
              flag: true,
              msg: this.$t('INVITATION.EMAIL_VALIDATE_IN_FAIL'),
            }
            debug('Mail wrong', email)
          }
          debug('email', email)
        })
        return pass
      },
    },
  }
</script>
<style lang="stylus" scoped>
  .invite
    &.hide
      display none
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
        width 35px
        height 30px
        top 0
        right 0
        color #fff
        font-size 14px
        > span
          display flex
          align-items center
          justify-content center
          height 14px
          width 28px
          position absolute
          top 15px
          right 15px
          overflow hidden
          margin-top -6px
          margin-right -6px
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
      .item
        margin 10px 0
        &__container
          width calc(100% - 20px)
          margin auto
          position relative
          > .spinner, .check
            position absolute
            right 0
            top 0
        &.add-item
          height 20px
          width 20px
          border 1px solid #d3d3d3
          border-radius 50%
          color #d3d3d3
          position relative
          cursor pointer
          overflow hidden
          &:before
            content '+'
            width 100%
            height 100%
            display flex
            justify-content center
            align-items center
            position absolute
            top -1px
            left 0
          &:hover
            background-color #ddcf21
            border none
            &:before
              color #fff
      button
        width calc(50% - 15px)
        height 30px
        margin 15px 10px 15px 0
        color #fff
        font-size 0.9375rem
        font-weight 300
        background-color #11b8c9
        border none
        &.disabled
          background-color #cecece
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
        button
          // width calc(50% - 7.5px)
          // margin-right 15px
          font-size .9375rem
</style>
