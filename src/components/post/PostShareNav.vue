<template>
  <nav class="nav">
    <a
      v-if="isClientSide"
      class="nav__icon nav__icon--fb"
      :href="createShareUrl('fb', shareUrl)"
      target="_blank"
      @click="sendShareLog('fb')"
    >
      <img src="/public/icons/fb-share.png" alt="">
    </a>
    <a
      v-if="isClientSide"
      class="nav__icon nav__icon--line"
      :href="createShareUrl('line', shareUrl)"
      target="_blank"
      @click="sendShareLog('line')"
    >
      <img src="/public/icons/line-share.png" alt="">
    </a>
    <PostShareNavCopylink
      class="nav__icon nav__icon--copy-link"
      @toggle="copyToClipboard(createShareUrl('copylink', shareUrl))"
    />
  </nav>
</template>

<script>
import { get, } from 'lodash'
import * as clipboard from 'clipboard-polyfill'
import { isClientSide, } from 'src/util/comm'
import { logTrace, } from 'src/util/services'

import { getPostType, getPostFullUrl, } from 'src/util/post/index'
import { createShareUrl, } from 'src/util/post/share'

import PostShareNavCopylink from 'src/components/post/PostShareNavCopylink.vue'

export default {
  props: {
    post: {
      type: Object,
      default () {
        return {}
      },
    },
  },
  components: {
    PostShareNavCopylink,
  },
  computed: {
    isClientSide,
    shareUrl () {
      return getPostFullUrl(this.post)
    },
    useragent () {
      return get(this.$store, 'state.useragent')
    },
    currUser () {
      return get(this.$store, 'state.profile.id')
    },
    postType () {
      return getPostType(this.post)
    },
  },
  methods: {
    createShareUrl,
    copyToClipboard (text) {
      clipboard.writeText(text)
    },
    sendShareLog (socialMedia) {
      const createShareLog = () => {
        return {
          'sharelog-type': this.postType,
          'sharelog-slug/id': get(this.post, 'slug') || get(this.post, 'id'),
          'sharelog-fb/line': socialMedia,
        }
      }

      logTrace({
        category: this.$route.fullPath,
        description: 'sharebutton',
        eventType: 'click',
        sub: this.currUser,
        target: {},
        useragent: this.useragent,
        ...createShareLog(),
      })
    },
  },
}
</script>

<style lang="stylus" scoped>
.nav
  display flex
  &__icon
    d = 30px
    width d
    height d
    border-radius d
    display flex
    justify-content center
    align-items center
    & + &
      margin 0 0 0 10px
    &--fb
      img
        width 100%
    &--line
      img
        width 100%

@media (max-width 320px)
  .nav
    &__icon
      d = 25px
      width d
      height d
      border-radius d
      & + &
        margin 0 0 0 5px
</style>

