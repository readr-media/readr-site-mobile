<template>
  <div class="baselightbox-post--review" v-if="isContentEmpty">
    No content found. Or, you may not have the right to fetch this content? 
  </div>
  <div :class="[ { 'baselightbox-post--review': !isNews }, { 'baselightbox-post--news': isNews } ]" v-else>
    <!-- template for post type is news -->
    <template v-if="isNews">
      <img class="baselightbox-post__leading-image" v-if="post.ogImage && isClientSide" :src="getImageUrl(post.ogImage)" @load="setLeadingImageOrientation(getImageUrl(post.ogImage), $event)">
      <div class="baselightbox-post__article-container">
        <article class="baselightbox-post__article">
          <section class="author-info">
            <router-link :to="`/profile/${authorId}`">
              <img class="author-info__thumbnail" :src="authorThumbnailImg" v-if="isClientSide">
            </router-link>
            <div class="author-info__meta">
              <p class="author-info__date" v-text="!isPostEmpty ? updatedAtYYYYMMDD(post.updatedAt) : ''"></p>
              <router-link class="author-info__author-nickname" :to="`/profile/${authorId}`" v-text="authorNickname"></router-link>
            </div>
          </section>
          <section class="article-content">
            <h1 v-text="!isPostEmpty ? post.title : ''"></h1>
            <template v-for="p in postContent">
              <figure v-if="isImg(p)">
                <img v-if="isClientSide" :src="getImgSrc(p)" alt="post-content-img" @load="setContentImageOrientation(getImgSrc(p), $event)">
                <!-- <figcaption>
                  我需要一個圖說
                </figcaption> -->
              </figure>
              <p v-else v-html="p"></p>
            </template>
          </section>
        </article>
        <div class="nav-container">
          <AppArticleNav :postId="post.id" :articleType="this.post.flag" :commentCount="commentCount"/>
        </div>
      </div>
    </template>
    <!-- template for post type is review and others -->
    <template v-if="!isNews">
      <article class="baselightbox-post__article">
        <img class="baselightbox-post__author-thumbnail" :src="authorThumbnailImg" v-if="isClientSide">
        <section class="article-content">
          <h2 class="article-content__date" v-text="!isPostEmpty ? updatedAtYYYYMMDD(post.updatedAt) : ''"></h2>
          <h2 class="article-content__author-nickname" v-text="authorNickname"></h2>
          <h1 class="article-content__title" v-text="!isPostEmpty ? post.title : ''"></h1>
          <div class="article-content__paragraph-container" v-html="!isPostEmpty ? post.content : ''"></div>
          <a class="article-content__source-link" :href="post.link" target="_blank" v-text="post.linkTitle"></a>
          <AppArticleNav :postId="post.id" :articleType="this.post.flag" :commentCount="commentCount" :inLightbox="true" @toogleComment="toogleComment"/>
        </section>
      </article>
      <CommentContainer class="baselightbox-post__comment" v-show="showComment" v-if="shouldRenderComment" :asset="asset"></CommentContainer>
    </template>
  </div>
</template>

<script>
import { updatedAtYYYYMMDD, isClientSide, getArticleAuthorId, getArticleAuthorNickname, getArticleAuthorThumbnailImg, getImageUrl, onImageLoaded, } from 'src/util/comm'
import { POST_TYPE, } from '../../api/config'
import { get, find,  map, isEmpty, } from 'lodash'
import AppArticleNav from 'src/components/AppArticleNav.vue'
import CommentContainer from 'src/components/comment/CommentContainer.vue'
import sanitizeHtml from 'sanitize-html'

const dom = require('xmldom').DOMParser
const seializer  = require('xmldom').XMLSerializer

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
  components: {
    AppArticleNav,
    CommentContainer,
  },
  watch: {
    showLightBox (val) {
      if (!val) {
        this.$emit('closeEditor')
      }
    },
    post () {
      if (!this.post) {
        /**
         * Client may not have the right to fetch this post content.
         */        
        this.isContentEmpty = true
      } else if (this.post.id && !this.isNews ) {
        this.shouldRenderComment = true
        this.showComment = true
      }
    },
  },
  computed: {
    asset () { 
      return `${get(this.$store, 'state.setting.HOST')}/${get(this.post, 'flag') === 'memo' ? `series/${get(this.$route, 'params.slug')}` : 'post'}/${this.post.id}` 
    },    
    isPostEmpty () {
      return isEmpty(this.post)
    },
    isClientSide,
    isNews () {
      return get(this.post, 'flag') === 'memo' || get(this.post, 'type', POST_TYPE.REVIEW) === POST_TYPE.NEWS
    },
    authorId () {
      return getArticleAuthorId(this.post)
    },
    authorNickname () {
      return getArticleAuthorNickname(this.post)
    },
    authorThumbnailImg () {
      return getArticleAuthorThumbnailImg(this.post)
    },
    postContent () {
      if (!this.post.content || this.post.content.length === 0) { return [] }
      const wrappedContent = sanitizeHtml(this.post.content, { allowedTags: false, selfClosing: [ 'img', ], })
      const doc = new dom().parseFromString(wrappedContent)
      let postParagraphs = map(get(doc, 'childNodes'), (p) => (sanitizeHtml(new seializer().serializeToString(p), { allowedTags: [ 'img', 'strong', 'a', 'h1', 'h2', 'figcaption', ], })))
      return postParagraphs
    },
    commentCount () {
      return get(find(get(this.$store, 'state.commentCount'), { postId: this.post.id, }), 'count') || 0
    },
  },
  data () { 
    return { 
      isContentEmpty: true,
      showComment: true,
      shouldRenderComment: false,
    } 
  }, 
  methods: {
    getImageUrl,
    updatedAtYYYYMMDD,
    isImg (content) {
      const regexp = /<img([\w\W]+?)\/>/
      return regexp.test(content)
    },
    getImgSrc (content) {
      const regexp = /<img.*?src=['"](.*?)['"]/
      return getImageUrl(regexp.exec(content)[1])
    },
    setLeadingImageOrientation (src, event) {
      onImageLoaded(src).then(({ width, height, }) => {
        width < height ? event.target.style.objectFit = 'contain' : event.target.style.objectFit = 'cover'
      }).catch(() => { event.target.style.objectFit = 'cover' })
    },
    setContentImageOrientation (src, event) {
      onImageLoaded(src).then(({ width, height, }) => {
        width < height ? event.target.classList.add('portrait') : event.target.classList.add('landscape')
      }).catch(() => { event.target.classList.add('landscape') })
    },
    toogleComment () {
      this.showComment = !this.showComment
    },
    mounted () {
      this.isContentEmpty = !this.post
    },
  },
}
</script>

<style lang="stylus">
.baselightbox-post
  &--review
    width 100%
    // height 620.5px
    padding 29px 25px 12.5px 25px
    overflow-y scroll
    align-self flex-start
    margin 0 auto auto auto
    .baselightbox-post
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
      &__source-link
        font-size 15px
        text-align justify
        line-height 1.5
        color #0a5780
        text-decoration underline
        margin 20px 0
        display block

  &--news
    width 100%
    // height 90vh
    overflow-y scroll
    .baselightbox-post
      &__leading-image
        width 100%
        height auto
        background-color #444746
      &__article-container
        width 100%
        padding 26.5px
      &__article
        display flex
        flex-direction column
        padding-bottom 8.5px
        // border-bottom solid 0.5px #d3d3d3
    .author-info
      display flex
      &__thumbnail
        width 45px
        min-width 45px
        height 45px
        border-radius 45px
        object-fit cover
      &__meta
        width 100%
        margin-left 10px
        display flex
        flex-direction column
        justify-content center
      &__date
        font-size 12px
        color #808080
        margin 5px 0
      &__author-nickname
        font-size 15px
        font-weight 500
        color black
    .article-content
      h1
        font-size 20px
        line-height 1.5
        margin 15px 0 10px 0
      h2
        font-size 18px
        line-height 1.5
        font-weight bold
        margin 23.5px 0 15px 0
      p
        font-size 15px
        letter-spacing 0.5px
        line-height 1.6
        text-align justify
      p + p
        margin 26px 0 0 0
      figure
        margin 28px 0 0px 0
        display flex
        flex-direction column
        align-items center
      figcaption
        font-size 14px
        line-height 1.71
        letter-spacing 0.5px
        color #808080
        margin-top 4.5px
        margin-bottom 28px
        text-align center
      .landscape
        width 100%
      .portrait
        width 100%
    .nav-container
      padding 16px 0
</style>


