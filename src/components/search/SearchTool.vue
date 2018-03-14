<template>
  <div class="search">
    <input class="search__input" type="text" ref="searchInput"
      :placeholder="wording[ 'WORIDNG_HEADER_MEMBER_SEARCH' ]"
      @keyup="setCurrVal"
      @change="checkIsChanged">
    <span class="search__icon" @click="goSearch"></span>
  </div>
</template>
<script>
  import { WORIDNG_HEADER_MEMBER_SEARCH } from 'src/constants'
  import { get } from 'lodash'

  const debug = require('debug')('CLIENT:SearchTool')
  export default {
    name: 'SearchTool',
    data () {
      return {
        currentSearchVal: get(this.$refs, 'searchInput.value'),
        isChanged: true,
        // searchVal: get(this.$route, [ 'params', 'keyword' ]),
        wording: {
          WORIDNG_HEADER_MEMBER_SEARCH
        }
      }
    },
    computed: {
      searchVal () {
        return get(this.$route, [ 'params', 'keyword' ])
      }
    },
    methods: {
      checkIsChanged () {
        debug('Change Detected.', this.searchVal, this.currentSearchVal)
        if (this.searchVal !== this.currentSearchVal) {
          this.isChanged = true
        } else {
          this.isChanged = false
        }
      },
      goSearch () {
        debug('this.isChanged', this.isChanged)
        debug('this.currentSearch', this.currentSearchVal)
        debug('this.searchVal', this.searchVal)
        if (this.searchVal !== this.currentSearchVal && this.currentSearchVal) {
          this.$router.push('/search/' + this.currentSearchVal)
        }
      },
      setCurrVal () {
        debug('Abt to change current search words to:', get(this.$refs, 'searchInput.value'))
        this.currentSearchVal = get(this.$refs, 'searchInput.value')
      }
    }
  }
</script>
<style lang="stylus" scoped>
  .search
    flex 1
    max-width 150px
    height 20px
    padding 0 5px
    margin-right 15px
    background-color #fff
    &__input
      width calc(100% - 20px)
      height 100%
      padding 2px 0
      margin-right 5px
      font-size 12px
      line-height 1
      vertical-align top
      border none
      outline none
      
    &__icon
      display inline-block
      width 15px
      height 20px
      background-image url('/public/icons/search-grey.png')
      background-position center center
      background-repeat no-repeat
      background-size contain
      vertical-align top
      cursor pointer
</style>