<template>
  <div class="profile-edit">
    <div class="profile-edit__main">
      <div class="form">
        <button class="profile-edit__close"><img src="/public/icons/close-white.png" alt=""></button>
        <div class="portrait">
          <div class="portrait__container" @click="profileEditorUploadThumbnail">
            <img v-if="isClientSide" class="portrait__thumbnail" :src="getImageUrl(thumbnail)" alt="thumbnail">
            <div class="portrait__upload">
              <input ref="inputPortraitImg" type="file" accept="image/*" class="editor__input" style="display: none;" @change="inputChangeHandler">
            </div>
          </div>
        </div>
        <div class="form__item">
          <span class="form__name">{{ $t('PROFILE.NICK_NAME') }}：</span>
          <!-- <input type="text" name="nickname" v-model="computedNickname"> -->
          <input class="form__input" type="text" name="nickname" v-model="inputNickname">
        </div>
        <div class="form__item">
          <span class="form__name--align-start">{{ $t('PROFILE.DESCRIPTION') }}：</span>
          <!-- <textarea name="description" v-model="computedDescription"></textarea> -->
          <textarea class="form__description" name="description" v-model="inputDescription"></textarea>
        </div>
        <div class="form__item">
          <span class="form__name">{{ $t('PROFILE.OLD_PASSWORD') }}：</span>
          <input class="form__input" type="password" name="old_password" v-model="inputOldPassword">
        </div>
        <div class="form__item">
          <span class="form__name">{{ $t('PROFILE.NEW_PASSWORD') }}：</span>
          <input class="form__input" type="password" name="new_password" v-model="inputNewPassword">
        </div>
        <div class="form__item">
          <span class="form__name">{{ $t('PROFILE.CONFIRM_PASSWORD') }}：</span>
          <input class="form__input" type="password" name="confirm_password" v-model="inputConfirmPassword">
        </div>
        <div class="form__item"> 
          <span class="form__name" v-text="`${$t('PROFILE.PERSONAL_OPTIONS')}：`"></span> 
          <Advanced class="form__personal-options" :values.sync="advanced" :fetchPersonalSetting="fetchPersonalSetting"></Advanced> 
        </div>         
        <button class="profile-edit__save-button" @click="profileEditorSave">{{ $t('PROFILE.SAVE') }}</button>
      </div>
    </div>
    
  </div>
</template>

<script>
import Advanced from 'src/components/member/Advanced.vue'
import validator from 'validator'
import { camelize, } from 'humps' 
import { get, map, } from 'lodash'
import { getImageUrl, } from 'src/util/comm'
import { removeToken, } from 'src/util/services'

const debug = require('debug')('CLIENT:ProfileEdit')
const updateInfo = (store, profile, action) => {
  return store.dispatch(action, {
    params: profile,
  })
}
const checkPassword = (store, profile) => {
  return store.dispatch('CHECK_PASSWORD', {
    params: {
      email: profile.email,
      password: profile.password,
      // keepAlive: profile.keepAlive
    },
  })
}
const logout = (store) => {
  return store.dispatch('LOGOUT', {})
}
const uploadImage = (store, file) => {
  return store.dispatch('UPLOAD_IMAGE', { file, type: 'member', })
}
const deleteMemberProfileThumbnails = (store, id) => {
  return store.dispatch('DELETE_MEMBER_PROFILE_THUMBNAILS', { id, })
}

export default {
  name: 'ProfileEdit',
  props: {
    profile: {
      type: Object,
    },
    showLightBox: {
      type: Boolean,
      default: false,
    },
  },
  components: {
    Advanced,
  },
  data () {
    return {
      advanced: {},
      staticNickname : get(this.profile, [ 'nickname', ], ''),
      // inputNickname: '',
      // inputDescription: '',
      inputNickname: get(this.profile, [ 'nickname', ], ''),
      inputDescription: get(this.profile, [ 'description', ], ''),
      inputOldPassword: '',
      inputNewPassword: '',
      inputConfirmPassword: '',
    }
  },
  computed: {
    isClientSide () {
      return get(this.$store, 'state.isClientSide', false)
    },
    isPersonalSettingMutated () { 
      let isMutated = false 
      map(this.advanced, (v, k) => { 
        const origin = get(this.personalSetting, camelize(k)) 
        if (origin !== undefined && get(this.personalSetting, camelize(k)) !== v) { 
          isMutated = true 
        } 
      }) 
      return isMutated 
    }, 
    personalSetting () { 
      return get(this.$store, 'state.personalSetting', {}) 
    },      
    thumbnail () {
      return get(this.profile, [ 'profileImage', ]) || '/public/icons/exclamation.png'
    },
    thumbnailFilePath () {
      return this.thumbnail.substr(this.thumbnail.lastIndexOf('/') + 1)
    },
  },
  watch: {
    showLightBox (value) {
      if (!value) {
        this.inputNickname = get(this.profile, [ 'nickname', ], '')
        this.inputDescription = get(this.profile, [ 'description', ], '')
        this.inputOldPassword = ''
        this.inputNewPassword = ''
        this.inputConfirmPassword = ''
      }
    },
  },
  methods: {
    fetchPersonalSetting: (store) => { 
      return store.dispatch('FETCH_PERSONAL_SETTONG') 
    },
    getImageUrl,
    inputChangeHandler () {
      const file = this.$refs.inputPortraitImg.files[0]
      console.log('inputChangeHandler 1')
      const saveImage = (file) => {
        console.log('saveImage')
        const fd = new FormData()
        // const fileExt = file.type.split('image/')[1]
        fd.append('image', file, `${this.profile.id}`)
        
        uploadImage(this.$store, fd)
        .then((res) => {
          updateInfo(this.$store, {
            id: this.profile.id,
            edit_mode: 'edit_profile',
            profile_image: res.body.url,
          }, 'UPDATE_PROFILE')
        })
        .catch((err) => {
          console.error(err)
        })
      }

      if (/^image\//.test(file.type)) {
        console.log('inputChangeHandler 2')
        deleteMemberProfileThumbnails(this.$store, this.profile.id)
        file.size <= 5242880 ? saveImage(file) : console.info(`file size is ${file.size} bytes bigger than 5MB`)
      }
    },
    profileEditorUploadThumbnail () {
      this.$refs.inputPortraitImg.click()
    },
    profileEditorSave () {
      // Check basic infos has been modified or not, if modified, update the infos
      const inputNotChange = (field) => {
        // return validator.isEmpty(this[`input${field}`]) || this[`computed${field}`] === this[`input${field}`]
        return this[`input${field}`] === this.profile[field.toLowerCase()]
      }
      const updateBasicInfo = () => {
        let params = { id: this.profile.id, edit_mode: 'edit_profile', }
        if (!inputNotChange('Nickname')) {
          params.nickname = this.inputNickname
        }
        if (!inputNotChange('Description')) {
          params.description = this.inputDescription
        }
        if (this.isPersonalSettingMutated) { 
          debug('go update!!')
          debug('go update!!')
          debug('go update!!', this.advanced)
          params = Object.assign(params, this.advanced) 
        }

        updateInfo(this.$store, params, 'UPDATE_PROFILE').then(() => { 
          return this.fetchPersonalSetting(this.$store) 
        }) 
        // .then(callback)
      }

      // Check password which user inputs, and confirm the new password, if two values are equal, update the password
      const isOldPasswordEmpty = () => {
        return validator.isEmpty(this.inputOldPassword)
      }
      const isConfirmNewPassword = () => {
        if (!validator.isEmpty(this.inputNewPassword) && !validator.isEmpty(this.inputConfirmPassword)) {
          return this.inputNewPassword === this.inputConfirmPassword
        } else {
          return false
        }
      }
      const updatePassword = () => {
        checkPassword(this.$store, {
          email: this.profile.id,
          password: this.inputOldPassword,
          // keepAlive: this.$refs[ 'keep-alive' ].checked
        })
        .then((res) => {
          if (res.status === 200) {
            // console.log('login success')
            // return true
            updateInfo(this.$store, {
              id: this.profile.id,
              edit_mode: 'edit_profile',
              password: this.inputNewPassword,
            }, 'UPDATE_PASSWORD')
            .then(() => {
              this.inputOldPassword = ''
              this.inputNewPassword = ''
              this.inputConfirmPassword = ''
  
              logout(this.$store).then(() => {
                const domain = get(this.$store, 'state.setting.DOMAIN')
                return removeToken(domain).then(() => {
                  location && location.replace('/')
                })
              })
            })
          } else {
            console.log('login fail')
          }
        })
        .catch((err) => {
          if (err.status === 401) {
            console.log('login 401')
            // return false
          }
        })
      }

      if (!(inputNotChange('Nickname') && inputNotChange('Description')) || this.isPersonalSettingMutated) {
        updateBasicInfo()
      }
      if (!isOldPasswordEmpty() && isConfirmNewPassword()) {
        updatePassword()
      }

      this.$emit('save')
    },
  },
}
</script>


<style lang="stylus" scoped>
.profile-edit
  width 100%
  height 100vh
  background-color #d8d8d8
  display flex
  &__main
    width 100%
    padding 20px 15px 45px
    overflow auto
  &__close
    position absolute
    top 0
    right 0
    width 45px
    height 45px
    padding 10px
    background-color #808080
    img
      width 100%
      height 100%
  &__aside
    width 216px
    height 688px
    padding 30px 50px 22px 41px
    display flex
    flex-direction column
    justify-content space-between
  &__save-button
    width 100%
    height 30px
    margin-top 15px
    border-radius 2.5px
    border none
    background-color #4280a2
    font-size 15px
    font-weight 600
    color #ffffff
    cursor pointer
    outline none
    &:hover
      filter brightness(80%)

$form__name
  width 75px
  height 25px
  line-height 25px
  font-size .9375rem
  color #808080
  margin 0 4px 0 0 
  text-align justify
  // pseudo class for performing a line break, intend for applying text-align justify on single line text element
  &:after
    content ''
    width 100%
    display inline-block
.form
  display flex
  flex-direction column
  align-items flex-end
  &__item
    display flex
    align-items center
    width 100%
    & + .form__item
      margin 15px 0 0 0
  &__name
    @extends $form__name
    &--align-start
      @extends $form__name
      align-self flex-start
  form-width = auto
  &__input
    flex 1
    width form-width
    height 25px
    font-size .875rem
    border 1px solid white
    padding 0 15px
  &__description
    flex 1
    width form-width
    height 121px
    text-align justify
    font-size .875rem
    border 1px solid white
    resize none
    padding 9px 15px
  &__personal-options
    width form-width
    // height 300px
    // height 200px
    background-color white
    border 1px solid white
    flex 1
    overflow-y hidden

$portrait-container-size
  width 70px
  height 70px
$plus-sign
  content ''
  background-color white
  position absolute
  top 0
  bottom 0
  left 0
  right 0
  margin auto
.portrait
  align-self self-start
  margin-bottom 25px
  &__container
    @extends $portrait-container-size
    position relative
    cursor pointer
  &__thumbnail
    @extends $portrait-container-size
    display block
    border-radius 50%
    border 1px solid #808080
    overflow hidden
    object-fit cover
  &__upload
    r = 30px
    position absolute
    bottom 0
    right 0
    width r
    height r
    background-color #808080
    border-radius r
    box-shadow 0 1px 2px 0 rgba(0, 0, 0, 0.5)
    // CSS based plus sign
    &:before
      @extends $plus-sign
      width 24px
      height 4px
    &:after
      @extends $plus-sign
      width 4px
      height 24px
  &__name
    font-size 15px
    font-weight 300
    text-align center
    margin 5px 0
    word-break break-all
</style>
