<template>
  <div class="projects-figure-progress">
    <div class="projects-figure-progress__title" v-text="projectName"></div>
    <div class="projects-figure-progress__block projects-figure-progress--progress" v-text="`${projectProgress}%`"></div>
    <router-link v-if="deducted" :to="`/memo/${get(this.project, 'id')}`" class="projects-figure-progress__block projects-figure-progress--link"><img src="/public/icons/microphone.png" :alt="$t('PROJECT.DISCUSS')"></router-link>
    <div v-else class="projects-figure-progress__block projects-figure-progress--encoruage" @click="$_projectsFigureProgress_openLightBox"><img src="/public/icons/encoruage-white.png" :alt="$t('PROJECT.ENCOURAGE')"></div>
    <base-light-box :showLightBox.sync="showLightBox" borderStyle="nonBorder">
      <div class="project-memo-alert">
        <div class="project-memo-alert__content">
          <h2 v-text="$t('PROJECT.JOIN_CONTENT_1')"></h2>
          <h1 v-text="projectName"></h1>
          <h2>{{ $t('PROJECT.JOIN_CONTENT_2') }}<strong v-text="get(project, [ 'memoPoints' ], 0) || 0"></strong>{{ $t('PROJECT.JOIN_CONTENT_POINT') }}</h2>
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
        memberId: get(store, [ 'state', 'profile', 'id', ]),
        objectType: objectType,
        objectIds: objectIds,
      },
    })
  }

  export default {
    name: 'ProjectsFigureProgress',
    components: {
      BaseLightBox,
    },
    props: {
      project: {
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
        return includes(objectIds, get(this.project, 'id'))
      },
      projectName () {
        return get(this.project, [ 'title', ])
      },
      projectProgress () {
        return get(this.project, [ 'progress', ])
      },
    },
    methods: {
      $_projectsFigureProgress_deductPoints () {
        this.deducting = true
        deductPoints(this.$store, { objectId: get(this.project, 'id'), memoPoints: get(this.project, 'memoPoints') || 0, })
        .then(() => {
          const projectInProgressIds = get(this.$store, 'state.publicProjects.inProgress', []).map(project => project.id)
          fetchPointHistories(this.$store, { objectType: POINT_OBJECT_TYPE.PROJECT_MEMO, objectIds: projectInProgressIds, })
          .then(() => {
            this.deducting = false
            this.$router.push(`/memo/${get(this.project, 'id')}`)
          })
        })
      },
      $_projectsFigureProgress_openLightBox () {
        this.showLightBox = true
      },
      get,
    },
  }
</script>

<style lang="stylus" scoped>
.projects-figure-progress
  display flex
  color black
  & + .projects-figure-progress
    border-top 1px solid #d3d3d3
  &__title
    flex 1
    padding 10px
    font-size .9375rem
    line-height 20px
    white-space nowrap
    text-overflow ellipsis
    overflow hidden
    background-color #fff
  &__block
    width 40px
    height 40px
    background-color #11b8c9
  &--progress
    color #fff
    font-size .9375rem
    text-align center
    line-height 40px
    border-right 1px solid #fff
  &--link
    position relative
    border-left 1px solid #fff
    img
      position absolute
      top 50%
      left 50%
      transform translate(-50%, -50%)
      width 15px
      height auto
  &--encoruage
    position relative
    border-left 1px solid #fff
    img
      position absolute
      top 50%
      left 50%
      transform translate(-50%, -50%)
      width 20px
      height auto

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
</style>

