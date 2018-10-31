<template>
  <div :style="{ position: 'relative', }">
    <div class="post-content__hint">
      <img class="lock" src="/public/icons/lock.png">
      <span v-text="$t('homepage.EDITOR_ROOMMATE_ONLY')"></span>
    </div>
    <h1 class="post-content__title" v-text="post.title"></h1>
    <div class="editor-writing">
      <div class="editor-writing__container" @click="goMemo">
        <template v-for="(p, i) in postContentProcessed">
          <!-- post content for initial display -->
          <p class="editor-writing__paragraph--visible" v-if="i <= shouldContentStopAtIndex" :key="`${post.id}-${i}`">
            <!-- <span v-html="p"></span> -->
            <span v-if="isImg(p)" class="figure">
              <img v-if="isClientSide" :src="getImgSrc(p)" alt="post-content-img" @load="setContentImageOrientation(getImgSrc(p), $event)">
            </span>
            <span v-else v-html="p"></span>
            <span v-if="isMemoPaid === false && !isProjectPublished && i === shouldContentStopAtIndex"> 
              <span>......</span> 
              <span class="editor-writing__more" @click.prevent="memoDeductMach" v-text="$t('homepage.WORDING_HOME_POST_MORE')"></span> 
            </span> 
            <span v-else-if="shouldShowReadMoreButton(i)">             
              <span class="editor-writing__more" @click="toogleReadmore" v-text="$t('homepage.WORDING_HOME_POST_MORE')"></span>
            </span>
          </p>
          <!-- rest of the post content -->
          <p :class="`editor-writing__paragraph--${isReadMoreClicked ? 'visible' : 'invisible'}`" v-else v-html="p" :key="`${post.id}-${i}`"></p>
        </template>
      </div>
    </div>
    <a class="editor-writing-source" v-if="hasSource" :href="post.link" target="_blank">
      <div class="editor-writing-source__content">
        <h1 class="editor-writing-source__title" v-text="linkTitleTrim"></h1>
        <div class="editor-writing-source__description">
          <!-- <p v-text="linkDescriptionTrim"></p> -->
          <p class="editor-writing-source__cite" v-if="post.linkName">{{ $t('homepage.WORDING_HOME_POST_SOURCE') }}{{ linkNameTrim }}</p>
        </div>
      </div>
      <img class="editor-writing-source__figure" :src="post.linkImage" alt="source-fig">
    </a>
    <a v-else-if="!hasSource" class="editor-writing-no-source" :href="post.link" target="_blank" v-text="postLinkDecoded"></a>
  </div>
</template>
<script>
  import { PROJECT_STATUS, } from 'api/config'
  import { get, } from 'lodash'
  import truncate from 'html-truncate'

  const switchOnDeductionPanel = (store, item) => store.dispatch('SWITCH_ON_CONSUME_PANEL', { active: true, item, }) 

  export default {
    name: 'PostContentMemo',
    computed: {
      isMemoPaid () {
        return get(this.post, 'project.paid')
      },
      linkTitleTrim () {
        return truncate(this.post.linkTitle, 20)
      },
      linkDescriptionTrim () {
        return truncate(this.post.linkDescription, 45)
      },
      linkNameTrim () {
        return truncate(this.post.linkName, 20)
      },
      isProjectPublished () {
        return get(this.post, 'project.status') === PROJECT_STATUS.DONE
      },
    },
    data () {
      return {
        isReadMoreClicked: false,
      }
    },
    methods: {
      get,
      goMemo () {
        if (this.isMemoPaid !== false || this.isProjectPublished) {
          this.$router.push(this.targetUrl)
        }
      },
      memoDeductMach () {
        if (this.isMemoPaid === false) {
          switchOnDeductionPanel(this.$store, this.post)
        }
      },      
      toogleReadmore () {
        if (this.isMemoPaid !== false) {
          this.isReadMoreClicked = true
        }
      },
    },
    mounted () {},
    props: {
      targetUrl: {
        required: true,
      },
      postContentProcessed: {
        required: true,
      },
      shouldContentStopAtIndex: {
        required: true,
        type: Number,
      },
      isImg: {
        type: Function,
        required: true,
      },
      getImgSrc: {
        type: Function,
        required: true,
      },
      setContentImageOrientation: {
        type: Function,
        required: true,
      },
      post: {
        type: Object,
        required: true,
      },
      isClientSide: {
        required: true,
      },
      shouldShowReadMoreButton: {
        typs: Function,
        required: true,
      },
      hasSource: {
        required: true,
      },
      setOgImageOrientation: {
        required: true,
      },
      postLinkDecoded: {
        required: true,
      },
    },
  }
</script>
<style lang="stylus" scoped>
  .editor-writing__container
    cursor pointer
    & >>> iframe
      width 100%
  .post-content__hint
    display flex
    align-items center
    margin-bottom 5px
    font-size 0.875rem
    font-weight 500
    line-height normal
    color #808080
    .lock
      height 11px
      margin-right 7px    
</style>
