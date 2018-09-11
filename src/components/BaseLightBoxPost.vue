<template>
  <div class="baselightbox-post--review no-content" v-if="isContentEmpty">
    <span v-if="isMemo && !isMemoPaid && !isPostEmpty" v-text="$t('POST_CONTENT.GO_JOIN_MEMO')" class="go-join" @click="goJoin"></span> 
    <span v-else v-text="$t('POST_CONTENT.NO_PERMISSION')"></span> 
  </div>
  <div :class="[ { 'baselightbox-post--review': !isNews && !isMemo }, { 'baselightbox-post--news': isNews || isMemo } ]" v-else>
    <!-- template for post type is news -->
    <BaseLightBoxTemplateNews v-if="isNews || isMemo"
      :assetRefId="assetRefId" 
      :authorId="authorId" 
      :authorThumbnailImg="authorThumbnailImg" 
      :authorNickname="authorNickname" 
      :commentCount="commentCount" 
      :isPostEmpty="isPostEmpty"     
      :post="post" 
      :postContent="postContent"></BaseLightBoxTemplateNews>
    <!-- template for post type is review and others -->
    <BaseLightBoxTemplatePost v-else
      :assetRefId="assetRefId" 
      :authorThumbnailImg="authorThumbnailImg" 
      :authorNickname="authorNickname" 
      :commentCount="commentCount" 
      :isPostEmpty="isPostEmpty" 
      :post="post"></BaseLightBoxTemplatePost>
  </div>
</template>

<script>
import { getArticleAuthorId, getArticleAuthorNickname, getArticleAuthorThumbnailImg, } from 'src/util/comm'
import { POST_TYPE, } from 'api/config'
import { get, find,  map, isEmpty, } from 'lodash'
import BaseLightBoxTemplateNews from 'src/components/BaseLightBoxTemplateNews.vue'
import BaseLightBoxTemplatePost from 'src/components/BaseLightBoxTemplatePost.vue'
import sanitizeHtml from 'sanitize-html'

const debug = require('debug')('CLIENT:BaseLightBoxPost')
const dom = require('xmldom').DOMParser
const seializer  = require('xmldom').XMLSerializer
const switchOnDeductionPanel = (store, item) => store.dispatch('SWITCH_ON_CONSUME_PANEL', { active: true, item, }) 
const switchOffDeductionPanel = store => store.dispatch('SWITCH_OFF_CONSUME_PANEL', { active: false, }) 

export default {
  name: 'BaseLightBoxPost',
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
    BaseLightBoxTemplateNews,
    BaseLightBoxTemplatePost,
  },
  computed: {
    assetRefId () { 
      return get(this.post, 'project.id') 
    }, 
    isPostEmpty () {
      return isEmpty(this.post)
    },
    isNews () {
      return get(this.post, 'type', POST_TYPE.REVIEW) === POST_TYPE.NEWS 
    },
    isMemo () { 
      debug('is memo?', get(this.post, 'flag') === 'memo' )
      debug('is memo?', this.$route.fullPath.split('/')[ 1 ] === 'series' && get(this.$route, 'params.slug') && get(this.$route, 'params.subItem'))
      return get(this.post, 'flag') === 'memo' 
        || (this.$route.fullPath.split('/')[ 1 ] === 'series' && get(this.$route, 'params.slug') && get(this.$route, 'params.subItem') && get(this.$route, 'params.subItem') !== 'donate')
    },    
    isMemoPaid () { 
      return get(this.post, 'project.paid') 
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
      return get(find(get(this.$store, 'state.commentCount'), { postId: this.post.id, }), 'count', get(this.post, 'commentAmount')) || 0
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
    goJoin () { 
      debug('this.isPostEmpty', this.isPostEmpty)
      debug('this.isMemo', this.isMemo)
      debug('this.isMemoPaid', this.isMemoPaid)
      debug('go open deduction?', !this.isPostEmpty && this.isMemo && !this.isMemoPaid)
      if (!this.isPostEmpty && this.isMemo && !this.isMemoPaid) { 
        switchOnDeductionPanel(this.$store, this.post) 
      }       
    }, 
  },
  mounted () {
    if (!this.isPostEmpty) { 
      debug(this.isMemo && !this.isMemoPaid && !this.isNews)       
      if (this.isMemo && !this.isMemoPaid) { 
        this.isContentEmpty = true 
        switchOnDeductionPanel(this.$store, this.post) 
      } else { 
        this.isContentEmpty = false 
        switchOffDeductionPanel(this.$store)
      } 
    } else { 
      this.isContentEmpty = true 
    } 
    debug('Mounted: this.isContentEmpty', this.isContentEmpty)
  },
  watch: {
    showLightBox (val) {
      if (!val) {
        this.$emit('closeEditor')
      }
    },
    post () {
      if (!this.isPostEmpty) { 
        if (this.isMemo && !this.isMemoPaid) { 
          this.isContentEmpty = true 
          switchOnDeductionPanel(this.$store, this.post) 
        } else { 
          this.isContentEmpty = false 
        } 
      } else {
        /** 
         * Client may not have the right to fetch this post content. 
         */      
        this.isContentEmpty = true    
      }
      debug('watch: this.isContentEmpty', this.isContentEmpty, this.post)
    },
  },  
}
</script>

<style lang="stylus">
.baselightbox-post
  &--review
    width 100%
    // height 620.5px
    padding 29px 25px 52.5px 25px
    overflow-y scroll
    align-self flex-start
    margin 0 auto auto auto
    &.no-content 
      display flex 
      justify-content center 
      align-items center 
      height 50vh

      .go-join 
        padding 10px 20px 
        background-color #d8ca21 
        cursor pointer 
        box-shadow 0 0 10px rgba(0,0,0,0.3) 
        border-radius 2px 
        color #fff 
        &:hover 
          background-color #e8dc4c     
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
  &__tags
    margin-top 10px
    > div
      margin-top 5px
</style>


