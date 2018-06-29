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
    <base-light-box :showLightBox.sync="showLightBox" borderStyle="nonBorder">
      <div class="project-memo-alert">
        <div class="project-memo-alert__content">
          <h2 v-text="$t('PROJECT.JOIN_CONTENT_1')"></h2>
          <h1 v-text="projectName"></h1>
          <h2>{{ $t('PROJECT.JOIN_CONTENT_2') }}<strong v-text="get(memo, 'project.memoPoints', 0) || 0"></strong>{{ $t('PROJECT.JOIN_CONTENT_POINT') }}</h2>
          <button
            :disabled="deducting"
            @click="$_projectsFigureProgress_deductPoints()"
            v-text="deducting ? `${$t('PROJECT.DEDUCTING')} ...` : $t('PROJECT.JOIN_CONFIRM')">
          </button>
        </div>
      </div>
    </base-light-box>
  </div>
</template>

<script>
  import { POINT_OBJECT_TYPE, } from '../../../api/config'
  import { get, includes, } from 'lodash'
  import BaseLightBox from '../BaseLightBox.vue'
  
  const deductPoints = (store, { objectId, memoPoints, } = {}) => {
    return store.dispatch('ADD_REWARD_POINTS_TRANSACTIONS', {
      params: {
        member_id: get(store, [ 'state', 'profile', 'id', ]),
        object_type: POINT_OBJECT_TYPE.PROJECT_MEMO,
        object_id: objectId,
        points: memoPoints,
      },
    })
  }

  const fetchPointHistories = (store, { objectIds, objectType, }) => {
    return store.dispatch('GET_POINT_HISTORIES', {
      params: {
        objectType: objectType,
        objectIds: objectIds,
      },
    })
  }

  export default {
    name: 'MemoFigure',
    components: {
      BaseLightBox,
    },
    props: {
      memo: {
        type: Object,
        default: {},
      },
    },
    data () {
      return {
        deducting: false,
        showLightBox: false,
      }
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
      $_projectsFigureProgress_deductPoints () {
        this.deducting = true
        deductPoints(this.$store, { objectId: get(this.memo, 'projectId'), memoPoints: get(this.memo, 'project.memoPoints') || 0, })
        .then(() => {
          const projectIds = get(this.$store, 'state.publicMemos', []).map(memo => memo.id)
          fetchPointHistories(this.$store, { objectType: POINT_OBJECT_TYPE.PROJECT_MEMO, objectIds: projectIds, })
          .then(() => {
            this.deducting = false
            this.$router.push(this.memoURL)
          })
        })
      },
      $_projectsFigureProgress_openLightBox () {
        this.showLightBox = true
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
  

.project-memo-alert
  position relative
  min-width 100%
  min-height 100vh
  background-color #11b8c9
  background-image url(/public/icons/join.png)
  background-position center calc(100% - 45px)
  background-size 110px auto
  background-repeat no-repeat
  border 5px solid #fff
  overflow hidden
  &__content
    margin-top 85px
    text-align center
    h1
      margin 1em 0 0
      color #fff
      font-size 1.5625rem
      font-weight 400
      letter-spacing 1px
    h2
      margin .5em 0 0
      font-size 1.125rem
      font-weight 400
      strong
        color #fff
        font-size 1.875rem
        margin 0 .2em
    button
      width 150px
      margin-top 45px
      padding 11px 0
      color #11b8c9
      font-size 1.5625rem
      background-color #fff
      border none
      transition color .5s
      &:disabled
        color rgba(17, 184, 201, .6)
  
@media (min-width 768px)
  .projects-figure-progress
    &:first-of-type
      border-top none
</style>

