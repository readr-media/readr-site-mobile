<template>
  <div class="tab">
    <div class="tab__nav">
      <div v-for="(tab, i) in tabs" :key="`tab-${i}`" :class="{ active: activeItem === i }" class="tab__nav__item" @click="navClickHandler(i)" v-text="tab"></div>
    </div>
    <div class="tab__content">
      <slot v-for="(t, i) in tabs" :name="i" v-if="i === activeItem"></slot>
    </div>
  </div>
</template>
<script>
  export default {
    name: 'AppTab',
    props: { 
      tabs: {}, 
      defaultTab: { 
        default: 0, 
      }, 
    }, 
    data () {
      return {
        activeItem: 0,
      }
    },
    computed: {
      tabStyle () {
        return {
          width: `${100 / (this.tabs ? this.tabs.length : 1)}%`,
        }
      },
    },
    watch: {
      activeItem (val) {
        this.$emit('changeTab', val)
        this.$emit('update:tabCurrIndex', val)
      },
    },
    mounted () { 
      this.defaultTab && (this.activeItem = this.defaultTab) 
    }, 
    methods: {
      navClickHandler (itemIndex) {
        this.activeItem = itemIndex
      },
    },
  }
</script>
<style lang="stylus" scoped>
  .tab
    &__nav
      display flex
      width 100%
      &__item
        flex 1
        height 25px
        display inline-flex
        justify-content center
        align-items center
        color #808080
        font-size 0.75rem
        font-weight 400
        cursor pointer
        border-top 1px solid #d3d3d3
        & + &
          border-left 1px solid #d3d3d3
        &:first-child
          border-left 1px solid #d3d3d3
        &:last-child
          border-right 1px solid #d3d3d3
        &.active
          background-color #ddcf21
          color #fff
          border-top none
          &:last-child, &:first-child
            border-right none
    &__content
      border 3px solid #d8ca21
      padding 20px
      font-size 0.625rem
      line-height 1rem
      color #000
  @media (min-width 950px)
    .tab
      &__content
        padding 37.5px 27.5px
</style>