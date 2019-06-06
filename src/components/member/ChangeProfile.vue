<template>
  <div class="change-profile">
    <figure>
      <img
        :src="profile.profileImage || '/public/icons/exclamation.png'"
        :alt="profile.name"
      >
    </figure>
    <div>
      <InputWithErrorMessage :init-value="profile.nickname" />
      <textarea
        v-model="profile.description"
        type="text"
      />
    </div>
  </div>
</template>
<script>
import InputWithErrorMessage from '../form/InputWithErrorMessage.vue'

export default {
  name: 'ChangeProfile',
  components: {
    InputWithErrorMessage
  },
  props: {
    profile: {
      type: Object,
      required: true
    }
  }
}
</script>
<style lang="stylus" scoped>
.change-profile
  display flex
  align-items flex-start
  figure
    border-radius 50%
    overflow hidden
    img
      display block
      width 50px
      height 50px
      border 1px solid #979797
  >>> input, >>> textarea
    width 100%
    padding .2em .4em
    border 1px solid #979797
  textarea
    min-height 80px
    margin-top .5em
    text-align justify
  > div
    flex 1
    margin-left .5em
</style>
