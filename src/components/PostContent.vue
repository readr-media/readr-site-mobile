<template>
  <div class="post-content">
    <!-- template for post type is news -->
    <template v-if="postType === 'news'">
      <img class="post-content__leading-image" v-if="post.ogImage && isClientSide" :src="getImageUrl(post.ogImage)" alt="" @load="setLeadingImageOrientation(getImageUrl(post.ogImage), $event)">
      <h1 class="post-content__title--news" v-text="post.title"></h1>
      <div class="editor-writing--news">
        <router-link :to="targetUrl" class="editor-writing__container">
          <template v-for="(p, i) in postContentProcessed">
            <!-- post content for initial display -->
            <p class="editor-writing__paragraph--visible" v-if="i <= shouldContentStopAtIndex" :key="`${post.id}-${i}`">
              <span v-if="isImg(p)" class="figure">
                <img v-if="isClientSide" :src="getImgSrc(p)" alt="post-content-img" @load="setContentImageOrientation(getImgSrc(p), $event)">
              </span>
              <span v-else v-html="p"></span>
              <span v-if="shouldShowReadMoreButton(i)">
                <span class="editor-writing__more" @click="toogleReadmore($event)" v-text="$t('homepage.WORDING_HOME_POST_MORE')"></span>
              </span>
            </p>
            <!-- rest of the post content -->
            <!-- <p :class="`editor-writing__paragraph--${isReadMoreClicked ? 'visible' : 'invisible'}`" v-else v-html="p" :key="`${post.id}-${i}`"></p> -->
          </template>
          <p class="editor-writing__more--news" v-text="$t('homepage.WORDING_HOME_POST_MORE_NEWS')"></p>
        </router-link>
      </div>
    </template>
    <!-- template for report -->
    <template v-else-if="postType === 'report'">
      <h1 class="report__title"><a :href="getReportUrl(post.slug)" v-text="get(post, 'title')" target="_blank"></a></h1>
      <a v-if="post.heroImage" class="report__img" :href="getReportUrl(post.slug)" target="_blank"><img :src="getImageUrl(post.heroImage)" alt=""></a>
      <p class="report__descr"><a :href="getReportUrl(post.slug)" v-text="get(post, 'description')" target="_blank"></a></p>
    </template>
    <template v-else-if="postType === 'memo'"> 
      <PostContentMemo 
        :targetUrl="targetUrl" 
        :postContentProcessed="postContentProcessed" 
        :shouldContentStopAtIndex="shouldContentStopAtIndex" 
        :isImg="isImg" 
        :getImgSrc="getImgSrc" 
        :setContentImageOrientation="setContentImageOrientation" 
        :isClientSide="isClientSide" 
        :shouldShowReadMoreButton="shouldShowReadMoreButton" 
        :hasSource="hasSource" 
        :setOgImageOrientation="setOgImageOrientation"
        :postLinkDecoded="postLinkDecoded"
        :post="post"></PostContentMemo> 
    </template>     
    <!-- template for post type is review and others -->
    <template v-else-if="postType === 'normal'">
      <h1 class="post-content__title" v-text="post.title"></h1>
      <div class="editor-writing">
        <router-link :to="targetUrl" class="editor-writing__container">
          <template v-for="(p, i) in postContentProcessed">
            <!-- post content for initial display -->
            <p class="editor-writing__paragraph--visible" v-if="i <= shouldContentStopAtIndex" :key="`${post.id}-${i}`">
              <!-- <span v-html="p"></span> -->
              <span v-if="isImg(p)" class="figure">
                <img v-if="isClientSide" :src="getImgSrc(p)" alt="post-content-img" @load="setContentImageOrientation(getImgSrc(p), $event)">
              </span>
              <span v-else v-html="p"></span>
              <span v-if="shouldShowReadMoreButton(i)">
                <span class="editor-writing__more" @click="toogleReadmore($event)" v-text="$t('homepage.WORDING_HOME_POST_MORE')"></span>
              </span>
            </p>
            <!-- rest of the post content -->
            <p :class="`editor-writing__paragraph--${isReadMoreClicked ? 'visible' : 'invisible'}`" v-else v-html="p" :key="`${post.id}-${i}`"></p>
          </template>
        </router-link>
      </div>
      <a class="editor-writing-source" v-if="hasSource" :href="post.link" target="_blank">
        <div class="editor-writing-source__content">
          <h1 class="editor-writing-source__title" v-text="linkTitleTrim"></h1>
          <div class="editor-writing-source__description">
            <!-- <p v-text="linkDescriptionTrim"></p> -->
            <p class="editor-writing-source__cite" v-if="post.linkName">{{ $t('homepage.WORDING_HOME_POST_SOURCE') }}{{ post.linkName }}</p>
          </div>
        </div>
        <img class="editor-writing-source__figure" :src="post.linkImage" alt="source-fig">
      </a>
      <a v-else-if="post.link && !hasSource" class="editor-writing-no-source" :href="post.link"  target="_blank" v-text="postLinkDecoded"></a>
    </template>
    <AppArticleNav
      :resource="post.flag"
      :resourceType="resourceType"
      :postId="post.id"
      :postRefId="get(post, 'project.id')" 
      :slug="get(post, 'flag') === 'report'? post.slug : ''"
      :commentCount="commentCount">
      <TagNav
        v-if="post.tags && post.tags.length > 0"
        slot="tagNav"
        :tags="post.tags"
        class="post-content__tag-nav" />
    </AppArticleNav>
  </div>
</template>
<script>
  import { get, map, some, findIndex, } from 'lodash'
  import { onImageLoaded, getImageUrl, getReportUrl, isClientSide, } from 'src/util/comm'
  import AppArticleNav from 'src/components/AppArticleNav.vue'
  import PostContentMemo from 'src/components/PostContentMemo.vue'
  import TagNav from 'src/components/tag/TagNav.vue'
  import sanitizeHtml from 'sanitize-html'
  import truncate from 'html-truncate'
  import { POST_TYPE, } from '../../api/config'

  const dom = require('xmldom').DOMParser
  const seializer  = require('xmldom').XMLSerializer
  // const debug = require('debug')('CLIENT:PostContent')
  export default {
    name: 'PostContent',
    computed: {
      commentCount () {
        return get(this.post, 'commentAmount') || 0
      },
      hasSource () {
        return this.post.linkTitle
      },
      linkTitleTrim () {
        return truncate(this.post.linkTitle, 20)
      },
      linkDescriptionTrim () {
        return truncate(this.post.linkDescription, 45)
      },
      isNews () {
        return get(this.post, 'type', POST_TYPE.REVIEW) === POST_TYPE.NEWS
      },
      hasCustomContentBreak () {
        return some(get(this.contentDOM, 'childNodes'), [ 'tagName', this.customContentBreakTagName, ])
      },
      shouldCustomBreakAtIndex () {
        const originalIndex = findIndex(get(this.contentDOM, 'childNodes'), [ 'tagName', this.customContentBreakTagName, ])
        if (this.hasCustomContentBreak) return originalIndex - 1 < 0 ? 0 : originalIndex - 1
      },
      contentDOM () {
        const wrappedContent = sanitizeHtml(this.post.content, { allowedTags: false, selfClosing: [ 'img', this.customContentBreakTagName, ], })
        const doc = new dom().parseFromString(wrappedContent)
        return doc
      },
      postContent () {
        if (!this.post.content || this.post.content.length === 0) { return [] }
        const postParagraphs = map(get(this.contentDOM, 'childNodes'), (p) => (sanitizeHtml(new seializer().serializeToString(p), { allowedTags: [ 'img', 'strong', 'h1', 'h2', 'figcaption', ], })))
        return postParagraphs
      },
      postContentProcessed () {
        if (this.postContentWordCountTotal <= this.showContentWordLimit){
          return this.postContent
        } else {
          const ellipsis = `......${this.postType === 'normal' ? '' : this.$t('homepage.WORDING_HOME_POST_MORE')}`
          return this.postContent.map((paragraph, index) => {
            if (!this.isReadMoreClicked && index === this.shouldContentStopAtIndex) {
              if (this.isStopParagraphWordCountExceedLimit) {
                const wordCountBeforeStop = this.postContentWordCount.reduce((acc, curr, currIndex) => currIndex < this.shouldContentStopAtIndex ? acc + curr : acc, 0)
                return truncate(paragraph, this.showContentWordLimit - wordCountBeforeStop, { ellipsis: ellipsis, })
              } else if (!this.isStopLastParagraphBeforeTruncate) {
                return paragraph + ellipsis
              }
            }
            return paragraph
          })
        }
      },
      postContentWordCount () {
        return this.postContent.map(paragraph => paragraph.length)
      },
      postContentWordCountTotal () {
        return this.postContentWordCount.reduce((acc, curr) => acc + curr, 0)
      },
      postType () {
        if (get(this.post, 'type') === POST_TYPE.NEWS) {
          return 'news'
        } else if (get(this.post, 'projectId') && get(this.post, 'slug')) {
          return 'report'
        } else if (get(this.post, 'flag') === 'memo'){ 
          return 'memo'          
        } else {
          return 'normal'
        }
      },
      resourceType () {
        switch (get(this.post, 'type')) {
          case POST_TYPE.NEWS:
            return 'news'
          case POST_TYPE.REVIEW:
            return 'review'
          default:
            return ''
        }
      },
      shouldContentStopAtIndex () {
        if (this.hasCustomContentBreak) return this.shouldCustomBreakAtIndex
        if (this.postContentWordCountTotal <= this.showContentWordLimit) return this.postContent.length
        let count = 0
        let index = 0
        if (this.postContentWordCountTotal <= this.showContentWordLimit) return this.postContent.length
        while (count + this.postContent[index].length <= this.showContentWordLimit) {
          const currentParagraph = this.postContent[index]
          const currentParagraphWordLength = currentParagraph.length
          if (index < this.postContent.length - 1) {
            index += 1
          }
          count += currentParagraphWordLength
        }
        return index
      },
      isStopLastParagraphBeforeTruncate () {
        return this.shouldContentStopAtIndex === this.postContent.length - 1
      },
      isStopParagraphWordCountExceedLimit () {
        const stopParagraph = this.postContent[this.shouldContentStopAtIndex]
        const stopParagraphWordLength = stopParagraph.length
        return stopParagraphWordLength > this.showContentWordLimit
      },
      targetUrl () {
        switch (this.post.flag) {
          case 'memo':
            return `/series/${get(this.$route, 'params.slug')}/${get(this.post, 'id')}`
          default:
            return `/post/${get(this.post, 'id')}`
        }
      },
      postLinkDecoded () {
        return decodeURI(this.post.link || '')
      },   
    },
    components: {
      AppArticleNav,
      PostContentMemo,
      TagNav,
    },
    data () {
      return {
        isReadMoreClicked: false,
        showContentWordLimit: 150,
        customContentBreakTagName: 'hr',
      }
    },
    methods: {
      toogleReadmore (event) {
        if (event) event.preventDefault()
        this.isReadMoreClicked = true
      },
      isLastParagraphAfterTruncate (index) {
        return index === this.shouldContentStopAtIndex
      },
      shouldShowReadMoreButton (index) {
        return this.postType === 'normal' && !this.isReadMoreClicked && (!this.isStopLastParagraphBeforeTruncate || this.isStopParagraphWordCountExceedLimit) && this.isLastParagraphAfterTruncate(index)
      },
      setOgImageOrientation (src, event) {
        onImageLoaded(src).then(({ width, height, }) => {
          width < height ? event.target.style.objectFit = 'contain' : event.target.style.objectFit = 'cover'
        }).catch(() => { event.target.style.objectFit = 'cover' })
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
      isImg (content) {
        const regexp = /<img([\w\W]+?)\/>/
        return regexp.test(content)
      },
      getImgSrc (content) {
        const regexp = /<img.*?src=['"](.*?)['"]/
        return getImageUrl(regexp.exec(content)[1])
      },
      isClientSide,
      getImageUrl,
      get,
      getReportUrl,
    },
    mounted () {},
    props: [ 'post', ],
  }
</script>
<style lang="stylus">
  .post-content
    a
      color #000
    &__title
      font-size 18px
      font-weight 600
      margin 0
      line-height 1.5
      &--news
        font-size 20px
        font-weight bold
        margin 0 0 11px 0
        line-height 1.5
        color #4a4a4a
    &__leading-image
      // width = 100% is equal to 100vw - 15px - 15px
      // keep the aspect ratio to 16:9
      width 100%
      height calc((100vw - 15px - 15px) * 0.5625)
      background-color #444746
      margin-bottom 22px
    &__tag-nav
      margin-top 5px
      > div
        margin-top 5px
    .report
      &__title
        font-size 1.125rem
      &__img
        display block
        margin-top 1em
        img
          width 100%
      &__descr
        margin 1.5em 0
        font-size .9375rem
  .editor-writing
    margin 18px 0
    &--news
      margin 18px 0 10px 0
      padding-bottom 4.5px
      border-bottom solid 0.5px #979797
      p
        color #4a4a4a
      h1
        font-size 35px
        line-height 1.5
        margin 16.5px 0 21px 0
      h2
        font-size 25px
        line-height 1.5
        font-weight bold
        margin 23.5px 0 15px 0
      .figure
        margin 41px 0 0px 0
        display flex
        flex-direction column
        align-items center
      figcaption
        font-size 14px
        line-height 1.71
        letter-spacing 0.5px
        color #808080
        margin-top 4.5px
        text-align center
        margin-bottom 28px
      .landscape
        width 100%
      .portrait
        width 50%
    &__container 
      // min-height 105px
      // overflow hidden
      // text-overflow: ellipsis;
      display inline-block
      margin-bottom 5px
      color black
      min-width 100%
      min-height 20px
      & > p
        font-size 15px
        font-weight 400
        text-align justify
        line-height 1.5
        margin 0
        // text-overflow: ellipsis;
      p > br
        display none
      p > img, p img
        width 100%
        object-fit contain
        // margin 20px 0
      p + p
        margin-top 6px
    &__more
      font-weight 500
      color #a7a7a7
      cursor pointer
      &:hover
        border-bottom 1px solid currentColor
      &--news
        color #11b8c9 !important
        margin-top 24px !important
    &__paragraph
      &--visible
        display block
      &--invisible
        display none
  .editor-writing-source
    height 102px
    border solid 0.5px #d3d3d3
    display flex
    justify-content space-between
    &__content
      order 1
      width 50%
      padding 10px
      position relative
    &__title
      font-size 12px
      font-weight 500
      color #808080
      margin 0
      line-height 1.4
    &__figure
      order 0
      margin 0
      display flex
      align-self center
      width 50%
      height 100%
      object-fit cover
      object-position center
    &__cite
      font-size 11px
      font-weight 300
      color #808080
      align-self flex-end
  .editor-writing-no-source
    display block
    color #808080
    font-size 12px
    
</style>