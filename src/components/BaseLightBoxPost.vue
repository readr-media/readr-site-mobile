<template>
  <div class="baselightbox-post">
    <article class="baselightbox-post__article">
      <img class="baselightbox-post__author-thumbnail" :src="authorThumbnailImg" v-if="isClientSide">
      <section class="article-content">
        <h2 class="article-content__date" v-text="!isPostEmpty ? updatedAtYYYYMMDD(post.updatedAt) : ''"></h2>
        <h2 class="article-content__author-nickname" v-text="authorNickname"></h2>
        <h1 class="article-content__title" v-text="!isPostEmpty ? post.title : ''"></h1>
        <div class="article-content__paragraph-container" v-html="!isPostEmpty ? post.content : ''"></div>
      </section>
    </article>
    <section class="baselightbox-post__comment">
      <!-- <section class="comment-now">
        <img class="comment-now__user-thumbnail" src="/public/icons/account.png" alt="">
        <input class="comment-now__input" type="text">
      </section>
      <section class="comment-list"></section> -->
      <div v-if="post.id" :class="`comment comment-${post.id}`"></div>
    </section>
  </div>
</template>

<script>
import { renderComment, } from 'src/util/talk'
import { updatedAtYYYYMMDD, isClientSide, getArticleAuthorNickname, getArticleAuthorThumbnailImg, } from '../util/comm'
import _ from 'lodash'

export default {
  props: {
    post: {
      type: Object,
    },
    showLightBox: {
      type: Boolean,
      default: false,
    },
  },
  watch: {
    showLightBox (val) {
      if (!val) {
        this.$emit('closeEditor')
      }
    },
  },
  computed: {
    isPostEmpty () {
      return _.isEmpty(this.post)
    },
    isClientSide,
    authorNickname () {
      return getArticleAuthorNickname(this.post)
    },
    authorThumbnailImg () {
      return getArticleAuthorThumbnailImg(this.post)
    },
  },
  methods: {
    updatedAtYYYYMMDD,
    renderComment (ref) {
      renderComment(this.$el, `${ref}`, `/post/${this.post.id}`, this.$store.state.setting.TALK_SERVER)
    },
  },
  updated () {
    if (this.post.id) this.renderComment(`.baselightbox-post__comment > .comment.comment-${this.post.id}`)
  },
}
</script>

<style lang="stylus">
.baselightbox-post
  width 100%
  // height 620.5px
  padding 29px 25px 12.5px 25px
  overflow-y scroll
  align-self flex-start
  margin 0 auto auto auto
  &__article
    display flex
  &__author-thumbnail
    width 45px
    min-width 45px
    height 45px
    border-radius 45px
    object-fit cover
  &__comment
    margin-top 17px
    border-top 1px solid #979797
    padding 10px 0
    
.article-content
  margin-left 10px
  &__date
    font-size 12px
    font-weight 300
    color #000000
    margin 0
    line-height 20px
  &__author-nickname
    font-size 15px
    font-weight 500
    color #000000
    margin 0
    line-height 21px
  &__title
    font-size 15px
    font-weight 400
    color #000000
    margin 0
    line-height 25px
  &__paragraph-container
    & > p
      margin 10px 0
      font-size 14px
      font-weight 300
      text-align justify
      color #000000
      line-height 1.4
      & > br
        display none
      & > img
        width 100%

.comment-now
  display flex
  align-items center
  &__user-thumbnail
    r = 45px
    width r
    height r
    border-radius r
    border 1px solid #979797
  &__input
    width 100%
    height 30px
    margin-left 17px
    border solid 0.5px #979797
    padding 5px 12.5px
</style>


