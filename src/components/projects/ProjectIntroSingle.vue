<template>
  <div class="project-single-intro">
    <div class="project-single-intro__container">
      <div class="project-single-intro__heroimg">
        <img :src="getImageUrl(get(project, 'heroImage'))">
        <div class="project-single-intro__progress-bar" :style="{ width: `${targProgress}%` }">
          <div class="current-progress"><span v-text="`${currProgress}%`"></span></div>
        </div>
      </div>
      <div class="project-single-intro__title">
        <span v-text="title"></span>
      </div>
      <div class="project-single-intro__desc">
        <span v-text="desc"></span>
      </div>
    </div>
    <div class="project-single-intro__comment">
      <AppArticleNav :articleType="'project'" :postId="project.slug" :commentCount="project.commentAmount || 0"></AppArticleNav>
    </div>
  </div>
</template>
<script>
import AppArticleNav from 'src/components/AppArticleNav.vue'
import { get, } from 'lodash'
import { getImageUrl, } from 'src/util/comm'
// const debug = require('debug')('CLIENT:ProjectIntroSingle')

export default {
  name: 'ProjectIntroSingle',
  components: {
    AppArticleNav,
  },
  computed: {
    targProgress () {
      return get(this.project, 'progress', 0)
    },
    desc () {
      return get(this.project, 'description', '')
    },
    project () {
      return get(this.$store, 'state.publicProjectSingle', {})
    },
    title () {
      return get(this.project, 'title')
    },
  },
  data () {
    return {
      currProgress: 0,
      isProgressRun: false,
    }
  },
  methods: {
    get,
    getImageUrl,
    runProgress () {
      // debug('this.targProgress', this.targProgress)
      const interval = setInterval(() => {
        this.currProgress += Math.ceil(this.targProgress / 100)
        // debug('this.currProgress', this.currProgress)
        // debug('this.targProgress', this.targProgress)
        if (this.currProgress >= this.targProgress) {
          this.currProgress = this.targProgress
          clearInterval(interval)
        }
      }, 10)
    },
  },
  mounted () {},
  props: {
    projSlug: {
      type: String,
    },
  },
  watch: {
    targProgress () {
      if (!this.isProgressRun) {
        this.isProgressRun = true
        this.runProgress()
      }
    },
  },
}
</script>
<style lang="stylus" scoped>
.project-single-intro
  width 100%
  // min-height 205px
  margin-bottom 10px
  position relative
  background-color #fff
  &__container
    background-position center left
    background-size cover
    background-repeat no-repeat
    padding 0 0 20px
    width 100%
    height 100%
    font-size 0.9375rem
    line-height 1.5625rem
    font-weight normal
    position relative
    > div:not(:first-child)
      margin-top 10px
      padding 0 15px
    > div:not(:last-child)
      margin-bottom 10px
    > div:first-child
      margin-bottom 20px      
    > div
      position relative
      z-index 1
    &::before
      background-image linear-gradient(45deg, rgba(255,255,255,1) 0%,rgba(255,255,255,1) 28%,rgba(255,255,255,0) 100%);
      content ''
      display block
      position absolute
      width 100%
      height 100%
      top 0
      left 0
  &__heroimg
    width 100%
    display block
    margin-bottom 25px
    img
      width 100%
      vertical-align middle
  &__title
    font-size 1.25rem
    font-weight 600
    line-height normal
  &__comment
    padding 0 15px
  &__progress-bar
    position absolute
    height 5px
    bottom 0
    left 0
    background-color #ddcf21
    transition width 1.5s
    .current-progress
      width 28px
      height 28px
      position absolute
      right -14px
      top -11px
      background-color #ddcf21
      border-radius 50%
      display flex
      justify-content center
      align-items center
      color #fff
      font-size 0.625rem
      z-index 998
</style>