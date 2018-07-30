<template>
  <li class="editors-intro-main">
    <figure class="editors-intro-main__profile">
      <router-link :to="`/profile/${editor.id}`" class="editors-intro-main__thumbnail">
        <img :src="authorThumbnailImg" alt="" v-if="isClientSide">
      </router-link>
    </figure>
    <div class="editors-intro-main__info">
      <router-link :to="`/profile/${editor.id}`" class="editors-intro-main__nickname"><p v-text="authorNickname"></p></router-link>
      <router-link :to="`/profile/${editor.id}`" class="editors-intro-main__description"><p v-text="trimDescription ? descritpionTrim : editor.description"></p></router-link>
    </div>
  </li>
</template>

<script>
import { isClientSide, getArticleAuthorNickname, getArticleAuthorThumbnailImg, } from 'src/util/comm'

export default {
  props: {
    editor: {
      type: Object,
      require: true,
    },
    trimDescription: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    descritpionTrim () {
      const limit = 30
      if (this.editor.description) {
        return this.editor.description.length > limit ? this.editor.description.slice(0, limit) + ' ...' : this.editor.description
      } else {
        return ''
      }
    },
    isClientSide,
    authorNickname () {
      return getArticleAuthorNickname(this.editor)
    },
    authorThumbnailImg () {
      return getArticleAuthorThumbnailImg(this.editor)
    },
  },
}
</script>

<style lang="stylus" scoped>
.editors-intro-main
  display flex
  align-items flex-start
  margin-bottom 15px
  a
    display block
    color #000
  p
    margin 0
  &__profile
    display flex
    flex-direction column
    margin 0
  
  &__thumbnail
    r = 45px
    width r
    height r
    border-radius r
    img
      width 100%
      height 100%
      object-position center center
      object-fit cover
  &__meta-container
    display flex
    justify-content center
    align-items center
    margin-top 5px
  &__follow-icon
    cursor pointer
    width 25px
    height 25px
  &__info
    margin-left 5px
  &__nickname
    margin 0
    font-size 15px
  &__description
    margin-top 5px
    font-size .875rem
    font-weight 300
    text-align justify
    line-height 1.5
    margin 3px 0 0 0
</style>

