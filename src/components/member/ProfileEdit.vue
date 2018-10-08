<template>
  <ProfileEditLayout>
    <template slot="aside">
      <div class="portrait">
          <div class="portrait__container" @click="profileEditorUploadThumbnail">
            <img v-if="isClientSide" class="portrait__thumbnail" :src="getFullUrl(thumbnail)" alt="thumbnail">
            <div class="portrait__upload">
              <input ref="inputPortraitImg" type="file" accept="image/*" class="editor__input" style="display: none;" @change="inputChangeHandler">
            </div>
          </div>
        </div>      
    </template>  
    <template slot="main">
      <div class="form">
        <div class="form__wrapper">
          <div class="form__item--title"><span v-text="$t('PROFILE.SECTION_PROFILE')"></span></div>
          <div class="form__item">
            <span class="form__name" v-text="$t('PROFILE.NICK_NAME')"></span>
            <input class="form__input" type="text" name="nickname" v-model="inputNickname">
          </div>
          <div class="form__item">
            <span class="form__name align-start" v-text="$t('PROFILE.DESCRIPTION')"></span>
            <textarea class="form__input textarea" name="description" v-model="inputDescription"></textarea>
          </div>          
        </div>
        <div class="form__wrapper">
          <div class="form__item--title"><span v-text="$t('PROFILE.SECTION_NOTIFICATION')"></span></div>
          <div class="form__item switcher" v-for="item in SETTING_NOTIFICATION">
            <ProfileEditSwitchItem :value.sync="settings[ get(item, 'key') ]" :defaultVal="get(personalSetting, camelize(get(item, 'key')))"
              :title="$t(`PROFILE.SETTING_NOTIFICATION.${get(item, 'name')}.TITLE`)"
              :desc="$t(`PROFILE.SETTING_NOTIFICATION.${get(item, 'name')}.DESC`)"></ProfileEditSwitchItem>
          </div>
        </div>
        <div class="form__wrapper">
          <div class="form__item--title"><span v-text="$t('PROFILE.SECTION_ACCUONT')"></span></div>
          <div class="form__item switcher" v-for="item in SETTING_ACCOUNT">
            <ProfileEditSwitchItem :value.sync="settings[ get(item, 'key') ]" :defaultVal="get(personalSetting, camelize(get(item, 'key')))"
              :title="$t(`PROFILE.SETTING_ACCOUNT.${get(item, 'name')}.TITLE`)"
              :desc="$t(`PROFILE.SETTING_ACCOUNT.${get(item, 'name')}.DESC`)"></ProfileEditSwitchItem>
          </div>   
          <div class="form__item--subtitle"><span v-text="$t('PROFILE.MODIFY_PASSWORD')"></span></div>        
          <div class="form__item">
            <span class="form__name sub" v-text="$t('PROFILE.OLD_PASSWORD')"></span>
            <TextItem type="password" class="form__input text"
              height="20px" border="1px solid #d3d3d3" alertPosition="bottom"
              :alert.sync="alert.old_pwd"
              :value.sync="inputOldPassword"></TextItem>            
          </div>
          <div class="form__item">
            <span class="form__name sub" v-html="$t('PROFILE.NEW_PASSWORD')"></span>
            <TextItem type="password" class="form__input text"
              height="20px" border="1px solid #d3d3d3" alertPosition="bottom"
              :alert.sync="alert.new_pwd"
              :value.sync="inputNewPassword"></TextItem>             
          </div>
          <div class="form__item">
            <span class="form__name sub" v-text="$t('PROFILE.CONFIRM_PASSWORD')"></span>
            <TextItem type="password" class="form__input text"
              height="20px" border="1px solid #d3d3d3" alertPosition="bottom"
              :alert.sync="alert.confirm_pwd"
              :value.sync="inputConfirmPassword"></TextItem>
          </div>          
        </div>
      </div>
    </template>
    <template>
      <button class="button save" @click="profileEditorSave" v-text="$t('PROFILE.SAVE')"></button>
      <div class="password_alert" v-if="isPasswordAlertActive">
        <div class="container">
          <div class="message"><span v-text="$t('PROFILE.PASSWORD_REVISING.SUCCESSUFULLY')"></span></div>
          <div class="confirm" @click="logout"><span v-text="$t('PROFILE.PASSWORD_REVISING.CONFIRM')"></span></div>
        </div>
      </div>      
    </template>
  </ProfileEditLayout>
  <!--div class="profile-edit">
    <div class="profile-edit__main">
      <div class="form">
        <button class="profile-edit__close"><img src="/public/icons/close-white.png" alt=""></button>
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
    <div class="profile-edit__password_alert" v-if="isPasswordAlertActive">
      <div class="container">
        <div class="message"><span v-text="$t('profile_editor.PASSWORD_REVISING.SUCCESSUFULLY')"></span></div>
        <div class="confirm" @click="logout"><span v-text="$t('profile_editor.PASSWORD_REVISING.CONFIRM')"></span></div>
      </div>
    </div>
  </div-->
</template>

<script>
import ProfileEditLayout from 'src/components/member/ProfileEditLayout.vue'
import ProfileEditSwitchItem from 'src/components/member/ProfileEditSwitchItem.vue'
import TextItem from 'src/components/form/TextItem.vue'
import validator from 'validator'
import { SETTING_ACCOUNT, SETTING_NOTIFICATION, } from 'src/constants'
import { camelize, } from 'humps' 
import { filter, get, map, } from 'lodash'
import { getFullUrl, } from 'src/util/comm'
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
    ProfileEditLayout,
    ProfileEditSwitchItem,
    TextItem,
  },
  data () {
    return {
      SETTING_ACCOUNT,
      SETTING_NOTIFICATION,
      alert: {},
      inputNickname: get(this.profile, 'nickname', ''),
      inputDescription: get(this.profile, 'description', ''),
      inputOldPassword: '',
      inputNewPassword: '',
      inputConfirmPassword: '',
      isPasswordAlertActive: false,
      isPersonalSettingMutated: false,
      settings: {},
      staticNickname : get(this.profile, 'nickname', ''),
    }
  },
  computed: {
    isClientSide () {
      return get(this.$store, 'state.isClientSide', false)
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
    settings: {
      handler () {
        debug('Mutation detected: settings', this.settings, this.personalSetting)
        if (this.isPersonalSettingMutated) { return }
        map(this.settings, (v, k) => {
          const origin = get(this.personalSetting, camelize(k))
          if (origin !== undefined && get(this.personalSetting, camelize(k)) !== v) {
            this.isPersonalSettingMutated = true
          }
        })
      },
      deep: true,
    },    
  },
  mounted () {
    this.fetchPersonalSetting(this.$store)
  },
  methods: {
    camelize,
    fetchPersonalSetting: (store) => { 
      return store.dispatch('FETCH_PERSONAL_SETTONG') 
    },
    get,
    getFullUrl,
    logout () {
      location && location.replace('/')
    },    
    inputChangeHandler () {
      const file = this.$refs.inputPortraitImg.files[0]
      debug('inputChangeHandler 1')
      const saveImage = (file) => {
        debug('saveImage')
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
        debug('inputChangeHandler 2')
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
          params = Object.assign(params, this.settings) 
        }

        return updateInfo(this.$store, params, 'UPDATE_PROFILE').then(() => { 
          return this.fetchPersonalSetting(this.$store) 
        }) 
        // .then(callback)
      }

      // Check password which user inputs, and confirm the new password, if two values are equal, update the password
      const isOldPasswordEmpty = () => {
        return !this.inputOldPassword || validator.isEmpty(this.inputOldPassword)
      }
      const isConfirmNewPassword = () => {
        if (this.inputNewPassword && this.inputConfirmPassword && !validator.isEmpty(this.inputNewPassword) && !validator.isEmpty(this.inputConfirmPassword)) {
          if (this.inputNewPassword === this.inputConfirmPassword) {
            return true
          } else {
            this.alert.confirm_pwd = {
              flag: true,
              msg: this.$t('login.WORDING_REGISTER_PWD_CHECK_INFAIL_NEW'),
            } 
            return false
          }
        } else {
          if (!this.inputNewPassword || validator.isEmpty(this.inputNewPassword)) {
            this.alert.new_pwd = {
              flag: true,
              msg: this.$t('login.WORDING_REGISTER_PWD_EMPTY'),
            }
          }
          if ((!this.inputConfirmPassword || validator.isEmpty(this.inputConfirmPassword))) {
            this.alert.confirm_pwd = {
              flag: true,
              msg: this.$t('login.WORDING_REGISTER_PWD_CHECK_EMPTY'),
            }
          }          
          return false
        }
      }
      const updatePassword = () => {
        return checkPassword(this.$store, {
          email: this.profile.mail,
          password: this.inputOldPassword,
          // keepAlive: this.$refs[ 'keep-alive' ].checked
        })
        .then((res) => {
          if (res.status === 200) {
            return updateInfo(this.$store, {
              edit_mode: 'edit_profile',
              password: this.inputNewPassword,
            }, 'UPDATE_PASSWORD')
            .then(() => {  
              return logout(this.$store).then(() => {
                const domain = get(this.$store, 'state.setting.DOMAIN')
                return removeToken(domain).then(() => {
                  this.isPasswordAlertActive = true
                })
              })
            })
          } else {
            debug('login fail')
            this.alert.old_pwd = {
              flag: true,
              msg: this.$t('login.WORDING_LOGIN_INFAIL_VALIDATION_ISSUE'),
            }             
          }
        })
        .catch((err) => {
          if (err.status === 401) {
            debug('login 401')
            // return false
            this.alert.old_pwd = {
              flag: true,
              msg: this.$t('login.WORDING_LOGIN_INFAIL_VALIDATION_ISSUE'),
            }              
          }
          return
        })
      }

      const process = []
      if (!(inputNotChange('Nickname') && inputNotChange('Description')) || this.isPersonalSettingMutated) {
        process.push(updateBasicInfo())
      }
      if (!isOldPasswordEmpty() && isConfirmNewPassword()) {
        process.push(updatePassword())
      }
      Promise.all(process).then(() => {
        const anyAlert = filter(this.alert, { flag: true, })
        anyAlert.length === 0 && !this.isPasswordAlertActive && this.$emit('save')
      })
    },
  },
}
</script>


<!--style lang="stylus" scoped>
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
  &__password_alert
    position fixed
    top 0
    left 0
    width 100vw
    height 100vh
    background-color rgba(0, 0, 0, 0.5)
    z-index 99999
    display flex
    justify-content center
    align-items center
    > .container
      padding 10px
      width 90%
      height 200px
      background-color #e3e3e3
      border-radius 2px
      display flex
      justify-content center
      align-items center
      flex-direction column
      font-size 0.875rem
      line-height normal
      .confirm
        margin-top 10px
        padding 2px 10px
        cursor pointer
        background-color #4280a2
        border-radius 2px
        color #fff
      .message
        padding 0 10px      

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
</style-->
