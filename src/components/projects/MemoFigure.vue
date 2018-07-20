<template>
  <div class="projects-figure-progress">
    <div class="projects-figure-progress__container" @click="navigateToMemo">
      <div class="projects-figure-progress__title">
        <h3 v-if="projectName" v-text="projectName"></h3>
        <h2 v-text="memo.title"></h2>
      </div>
      <router-link v-if="deducted" :to="`/series/${get(this.memo, 'project.slug')}`" class="projects-figure-progress__block projects-figure-progress--link">
        <img src="/public/icons/microphone-grey.png" :alt="$t('PROJECT.DISCUSS')">
        <p v-text="$t('PROJECT.DISCUSS')"></p>
      </router-link>
      <div v-else class="projects-figure-progress__block projects-figure-progress--encoruage" @click="$_projectsFigureProgress_openLightBox">
        <img src="/public/icons/participate-grey.png" :alt="`${$t('PROJECT.ENCOURAGE_1')}${$t('PROJECT.ENCOURAGE_2')}`">
        <p>{{ $t('PROJECT.ENCOURAGE_1') }}<br>{{ $t('PROJECT.ENCOURAGE_2') }}</p>
      </div>
    </div>
  </div>
</template>

<script>
  import { get, includes, } from 'lodash'
  const switchOnDeductionPanel = (store, item) => store.dispatch('SWITCH_ON_CONSUME_PANEL', { active: true, item, })
  export default {
    name: 'MemoFigure',
    props: {
      memo: {
        type: Object,
        default: {},
      },
    },
    computed: {
      deducted () {
        const pointHistories = get(this.$store, 'state.pointHistories', []) || []
        const objectIds = pointHistories.map(history => history.objectId)
        return includes(objectIds, get(this.memo, 'projectId'))
      },
      projectName () {
        return get(this.memo, 'project.title')
      },
      memoURL () {
        return `/series/${get(this.memo, 'project.slug')}`
      },
    },
    methods: {
      $_projectsFigureProgress_openLightBox () {
        switchOnDeductionPanel(this.$store, this.memo)
      },
      navigateToMemo () {
        this.deducted ? this.$router.push(this.memoURL) : this.$_projectsFigureProgress_openLightBox()
      },
      get,
    },
  }
</script>

<style lang="stylus" scoped>
.projects-figure-progress
  display flex
  color black
  background-color #fff
  &:first-of-type
    border-top 3px solid #ddcf21
  & + .projects-figure-progress
    border-top 1px solid #d3d3d3
  &__container
    display flex
    width 100%
  &__title
    flex 1
    padding 10px
    font-size .9375rem
    line-height 20px
    white-space nowrap
    text-overflow ellipsis
    overflow hidden
    h2, h3
      margin 0
    h2
      font-size .8125rem
    h3
      color #808080
      font-size .625rem
  &__block
    display flex
    align-items center
    margin 10px 0
    padding 0 10px 0 5px
    border-left 1px solid #979797
    img
      width 25px
      height 25px
    p
      margin 0 0 0 5px
      color #808080
      font-size .6875rem
      user-select none
  &--progress
    color #fff
    font-size .9375rem
    text-align center
    line-height 40px
    border-right 1px solid #fff
  
@media (min-width 768px)
  .projects-figure-progress
    &:first-of-type
      border-top none
</style>

