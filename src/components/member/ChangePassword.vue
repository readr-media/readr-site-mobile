<template>
  <div class="change-password">
    <p><strong>修改密碼</strong></p>
    <div>
      <div class="change-password__row">
        <p>目前密碼</p>
        <InputWithErrorMessage
          :type="'password'"
          :init-value.sync="originPassword"
          :show-error-message="errorOfOriginPassword"
          :error-message="'請提供正確密碼'"
          class="change-password__input"
        />
      </div>
      <div class="change-password__row">
        <p>新密碼</p>
        <InputWithErrorMessage
          :type="'password'"
          :init-value.sync="newPassword"
          :show-error-message="errorOfNewPassword"
          :error-message="errorMessageOfNewPassword"
          class="change-password__input"
        />
      </div>
      <div class="change-password__row">
        <p>確認密碼</p>
        <InputWithErrorMessage
          :type="'password'"
          :init-value.sync="confirmPassword"
          :show-error-message="errorOfConfirmPassword"
          :error-message="'「新密碼」與「確認密碼」不同，請輸入相同之密碼'"
          class="change-password__input"
        />
      </div>
    </div>
    <button
      :disabled="disableSubmitBtn"
      @click="validate"
    >
      更改密碼
    </button>
  </div>
</template>
<script>
import InputWithErrorMessage from '../form/InputWithErrorMessage.vue'

import { get } from 'lodash'
import { removeToken } from 'src/util/services'

export default {
  name: 'ChangePassword',
  components: {
    InputWithErrorMessage
  },
  props: {
    profile: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      confirmPassword: '',
      newPassword: '',
      originPassword: '',
      errors: []
    }
  },
  computed: {
    disableSubmitBtn () {
      return !this.originPassword && !this.newPassword && !this.confirmPassword
    },
    errorOfConfirmPassword () {
      return this.errors.filter(error => error.match(/confirm/)).length > 0
    },
    errorOfNewPassword () {
      return this.errors.filter(error => error.match(/new/)).length > 0
    },
    errorOfOriginPassword () {
      return this.errors.filter(error => error.match(/origin/)).length > 0
    },
    errorMessageOfNewPassword () {
      const error = this.errors.find(error => error.match(/new/))
      const message = {
        'new-empty': '請輸入新密碼',
        'new-not-change': '新密碼與目前密碼相同'
      }
      return message[error]
    }
  },
  methods: {
    validate () {
      this.errors = []
      if (!this.originPassword) {
        this.errors.push('origin')
      }
      if (!this.newPassword) {
        this.errors.push('new-empty')
      }

      if (this.newPassword === this.originPassword) {
        this.errors.push('new-not-change')
      }

      if (this.newPassword !== this.confirmPassword) {
        this.errors.push('confirm')
      }

      if (this.errors.length === 0) {
        this.$store.dispatch('DataUser/CHECK_PASSWORD', {
          email: this.profile.mail,
          password: this.originPassword
        })
          .then(res => {
            console.log('updatePassword')
            this.updatePassword()
          })
          .catch(() => {
            this.errors.push('origin')
          })
      }
    },
    updatePassword () {
      this.$store.dispatch('DataUser/UPDATE_PASSWORD', {
        password: this.newPassword
      })
        .then(() => {
          this.$store.dispatch('LOGOUT')
            .then(() => {
              const domain = get(this.$store, 'state.setting.DOMAIN')
              removeToken(domain)
            })
        })
        .catch(err => {
          console.log(err)
        })
    }
  }
  // watch: {
  //   confirmPassword (value) {
  //   },
  //   newPassword (value) {
  //   },
  //   originPassword (value) {
  //   }
  // }
}
</script>
<style lang="stylus" scoped>
.change-password
  display flex
  flex-direction column
  button
    align-self flex-end
    background-color #fff
    border 1px solid #979797
    &:disabled
      background-color transparent
  > div
    margin-top .5em
    & + button
      margin-top .5em

.change-password
  &__row
    display flex
    & + .edit-password__row
      margin-top .5em
    p
      min-width 4em
      height 30px
      line-height 30px
  &__input
    flex 1
    margin-left .5em
    >>> input
      height 30px
      border 1px solid #979797
</style>
