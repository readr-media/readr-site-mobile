<template>
  <div class="search">
    <img src="/public/icons/search-white.png" alt="" @click="toggleSearchBar">
    <section ref="searchBar" class="searchBar" @click.self="toggleSearchBar">
      <form action="">
        <input type="text" :placeholder="$t('header.WORIDNG_HEADER_MEMBER_SEARCH')">
        <button @click.prevent="toggleSearchBar"><img src="/public/icons/close-grey.png" alt=""></button>
      </form>
    </section>
  </div>
  <!-- <div class="search">
    <input class="search__input" type="text" ref="searchInput"
      :placeholder="wording[ 'WORIDNG_HEADER_MEMBER_SEARCH' ]"
      @keyup="setCurrVal"
      @change="checkIsChanged">
    <span class="search__icon" @click="goSearch"></span>
  </div> -->
</template>
<script>
  import { get, } from 'lodash'

  // const debug = require('debug')('CLIENT:SearchTool')
  export default {
    name: 'SearchTool',
    data () {
      return {
        currentSearchVal: get(this.$refs, 'searchInput.value'),
        isChanged: true,
        // searchVal: get(this.$route, [ 'params', 'keyword' ]),
      }
    },
    computed: {
      searchVal () {
        return get(this.$route, [ 'params', 'keyword', ])
      },
    },
    methods: {
      toggleSearchBar () {
        this.$refs.searchBar.classList.toggle('active')
      },
      // checkIsChanged () {
      //   debug('Change Detected.', this.searchVal, this.currentSearchVal)
      //   if (this.searchVal !== this.currentSearchVal) {
      //     this.isChanged = true
      //   } else {
      //     this.isChanged = false
      //   }
      // },
      // goSearch () {
      //   debug('this.isChanged', this.isChanged)
      //   debug('this.currentSearch', this.currentSearchVal)
      //   debug('this.searchVal', this.searchVal)
      //   if (this.searchVal !== this.currentSearchVal && this.currentSearchVal) {
      //     this.$router.push('/search/' + this.currentSearchVal)
      //   }
      // },
      // setCurrVal () {
      //   debug('Abt to change current search words to:', get(this.$refs, 'searchInput.value'))
      //   this.currentSearchVal = get(this.$refs, 'searchInput.value')
      // },
    },
  }
</script>
<style lang="stylus" scoped>
  .search
    img
      width 20px
      height 20px
  .searchBar
    position absolute
    top -100vh
    left 0
    right 0
    z-index 1000
    width 100%
    height 100vh
    background-color rgba(0, 0, 0, .4)
    overflow hidden
    &.active
      top 0
      form
        top 0
    form
      position relative
      top -50px
      width 100%
      height 50px
      padding 5px 55px 5px 15px
      background-color #fff
      transition top 0.35s ease-out
      input
        width 100%
        height 100%
        padding 0 0 0 5px
        border none
        outline none
    button
      position absolute
      top 5px
      right 15px
      width 40px
      height 40px
      padding 2.5px
      background-color transparent
      border none


    // flex 1
    // max-width 150px
    // height 20px
    // padding 0 5px
    // margin-right 15px
    // background-color #fff
    // &__input
    //   width calc(100% - 20px)
    //   height 100%
    //   padding 2px 0
    //   margin-right 5px
    //   font-size 12px
    //   line-height 1
    //   vertical-align top
    //   border none
    //   outline none
      
    // &__icon
    //   display inline-block
    //   width 15px
    //   height 20px
    //   background-image url('/public/icons/search-grey.png')
    //   background-position center center
    //   background-repeat no-repeat
    //   background-size contain
    //   vertical-align top
    //   cursor pointer
</style>