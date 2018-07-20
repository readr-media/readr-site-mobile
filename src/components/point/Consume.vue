<template>
  <BaseLightBox :showLightBox.sync="showMemoDeduction" borderStyle="nonBorder" @closeLightBox="hideMemoDeduction">
    <div class="project-memo-alert">
      <div class="project-memo-alert__content">
        <h2 v-text="$t('PROJECT.JOIN_CONTENT_1')"></h2>
        <h1 v-text="get(targetItem, 'project.title')"></h1>
        <h2>
          <span v-text="$t('PROJECT.JOIN_CONTENT_2')"></span>
          <strong v-text="get(targetItem, 'project.memoPoints', 0) || 0"></strong>
          <span v-text="$t('PROJECT.JOIN_CONTENT_POINT')"></span>
        </h2>
        <button v-text="memoDeducting ? `${$t('PROJECT.DEDUCTING')} ...` : $t('PROJECT.JOIN_CONFIRM')"
          :disabled="memoDeducting"
          @click="memoDeduct">
        </button>
      </div>
    </div>
  </BaseLightBox>  
</template>
<script>
  import BaseLightBox from 'src/components/BaseLightBox.vue' 
  import { POINT_OBJECT_TYPE, } from 'api/config' 
  import { get, } from 'lodash'
  
  const deductPoints = (store, { objectId, memoPoints, } = {}) => {
    return store.dispatch('ADD_REWARD_POINTS_TRANSACTIONS', {
      params: {
        member_id: get(store, 'state.profile.id'),
        object_type: POINT_OBJECT_TYPE.PROJECT_MEMO,
        object_id: objectId,
        points: memoPoints,
      },
    })
  }
  const switchOffDeductionPanel = store => store.dispatch('SWITCH_OFF_CONSUME_PANEL', { active: false, }) 

  export default {
    name: 'Consume',
    components: {
      BaseLightBox,
    },
    computed: {
      isActive () { 
        return get(this.$store, 'state.consumeFlag.active', false) 
      }, 
      targetItem () { 
        return get(this.$store, 'state.consumeFlag.item', {}) 
      },       
    },
    data () {
      return {
        memoDeducting: false,
        showMemoDeduction: false,
      }
    },
    methods: {
      get,
      hideMemoDeduction () {
        this.showMemoDeduction = false 
      },
      memoDeduct () { 
        this.memoDeducting = true 
        deductPoints(this.$store, { 
          objectId: get(this.targetItem, 'projectId'), 
          memoPoints: get(this.targetItem, 'project.memoPoints') || 0, 
        }).then(() => { 
          this.showMemoDeduction = false 
          location.reload() 
        })         
      },
    },
    mounted () {},
    watch: { 
      isActive () { 
        this.isActive && (this.showMemoDeduction = true) 
      }, 
      showMemoDeduction () { 
        !this.showMemoDeduction && switchOffDeductionPanel(this.$store) 
      }, 
    },    
  }
</script>
<style lang="stylus" scoped>
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