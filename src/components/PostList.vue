<template>
  <div class="postList-container">
    <div class="postList__multiple">
      <button
        class="postList__btn postList__btn--multiple"
        :disabled="!canPublishPosts"
        @click="$_postList_publishPosts"
        v-text="$t('POST_LIST.PUBLISH')">
      </button>
      <button
        class="postList__btn postList__btn--multiple"
        :disabled="!canDeletePosts"
        @click="$_postList_deletePosts"
        v-text="$t('POST_LIST.DELETE')">
      </button>
    </div>
    <PaginationNav :totalPages="totalPages" :currPage.sync="currPage"></PaginationNav>
    <table class="postList">
      <thead>
        <tr>
          <th class="postList__checkbox"><input type="checkbox" ref="checkboxSelectAll" @click="$_postList_toggleSelectAll"></th>
          <th class="postList__nickname"><span @click="$_postList_orderBy('author.nickname')" v-text="$t('POST_LIST.NICKNAME')"></span></th>
          <th class="postList__type"></th>
          <th class="postList__title"><span @click="$_postList_orderBy('title')" v-text="$t('POST_LIST.TITLE')"></span></th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="p in posts" :key="p.id" :class="{ active: p.publishStatus === config.postStatus.PUBLISHED }">
          <td class="postList__checkbox"><input type="checkbox" ref="checkboxItems" @change="$_postList_toggleHandler($event, p.id)"></td>
          <td class="postList__nickname" v-text="$_postList_getAuthorId(p)"></td>
          <td class="postList__type"><div v-if="p.type === config.postType.NEWS" class="postList__type--news">N</div></td>
          <td class="postList__title" @click="$_showPost(p)" v-text="p.title"></td>
          <td class="postList__edit" @click="$_postList_editPost(p.id)"><img src="/public/icons/pen-blue.png" alt=""></td>
        </tr>
      </tbody>
    </table>
    <BaseLightBox :showLightBox.sync="showLightBox">
      <BaseLightBoxPost :showLightBox="showLightBox" :post="post" @closeEditor="post = {}"/>
    </BaseLightBox>
  </div>
</template>
<script>
  import { POST_PUBLISH_STATUS, POST_TYPE, } from '../../api/config'
  import { filter, find, get, map, uniq, } from 'lodash'
  import BaseLightBox from './BaseLightBox.vue'
  import BaseLightBoxPost from './BaseLightBoxPost.vue'
  import PaginationNav from './PaginationNav.vue'

  export default {
    name: 'PostList',
    components: {
      BaseLightBox,
      BaseLightBoxPost,
      PaginationNav,
    },
    props: {
      maxResult: {
        type: Number,
        required: true,
      },
      posts: {
        type: Array,
        required: true,
      },
      sort: {
        type: String,
        required: true,
      },
    },
    data () {
      return {
        checkedIems: [],
        config: {
          postStatus: POST_PUBLISH_STATUS,
          postType: POST_TYPE,
        },
        currPage: 1,
        order: '',
        post: {},
        showLightBox: false,
      }
    },
    computed: {
      canDeletePosts () {
        return this.checkedIems.length > 0
      },
      canPublishPosts () {
        const items = filter(this.checkedIems, (item) => {
          const post = find(this.posts, { id: item, })
          return get(post, [ 'publishStatus', ]) !== POST_PUBLISH_STATUS.PUBLISHED
        })
        return items.length > 0
      },
      totalPages () {
        return Math.ceil(get(this.$store, [ 'state', 'postsCount', ], 0) / this.maxResult)
      },
    },
    mounted () {},
    methods: {
      $_postList_deletePost (id) {
        this.$emit('deletePosts', [ id, ], POST_PUBLISH_STATUS.DELETED)
      },
      $_postList_deletePosts () {
        this.$emit('deletePosts', this.checkedIems, POST_PUBLISH_STATUS.DELETED)
      },
      $_postList_editPost (id) {
        this.$emit('editPost', { postPanel: 'edit', id: id, })
      },
      $_postList_getAuthorId (post) {
        return get(post, [ 'author', 'nickname', ])
      },
      $_postList_getStatus (post) {
        const status = get(post, [ 'publishStatus', ])
        switch (status) {
          case POST_PUBLISH_STATUS.DRAFT:
            return this.$t('POST_LIST.PUBLISH_STATUS_DRAFT')
          case POST_PUBLISH_STATUS.PENDING:
            return this.$t('POST_LIST.PUBLISH_STATUS_PENDING')
          case POST_PUBLISH_STATUS.PUBLISHED:
            return this.$t('POST_LIST.PUBLISH_STATUS_PUBLISHED')
          case POST_PUBLISH_STATUS.SCHEDULING:
            return this.$t('POST_LIST.PUBLISH_STATUS_SCHEDULING')
          case POST_PUBLISH_STATUS.UNPUBLISHED:
            return this.$t('POST_LIST.PUBLISH_STATUS_UNPUBLISHED')
          default:
            return ' '
        }
      },
      $_postList_orderBy (field) {
        let order
        if (this.sort === field || this.sort === `-${field}`) {
          order = this.sort.indexOf('-') === 0 ? field : `-${field}`
        } else {
          order = field
        }
        this.$emit('filterChanged', { sort: order, })
      },
      $_postList_publishPosts () {
        const items = filter(this.checkedIems, (item) => {
          const post = find(this.posts, { id: item, })
          return get(post, [ 'publishStatus', ]) !== POST_PUBLISH_STATUS.PUBLISHED
        })
        this.$emit('publishPosts', items, POST_PUBLISH_STATUS.PUBLISHED)
      },
      $_postList_toggleHandler (event, id) {
        if (event.target.checked) {
          this.checkedIems.push(id)
        } else {
          const index = this.checkedIems.indexOf(id)
          if (index > -1) {
            this.checkedIems.splice(index, 1)
          }
        }
      },
      $_postList_toggleSelectAll () {
        this.checkedIems = []
        map(this.$refs.checkboxItems, (item) => {
          item.checked = this.$refs.checkboxSelectAll.checked
        })
        if (this.$refs.checkboxSelectAll.checked) {
          map(this.posts, (item) => {
            this.checkedIems.push(item.id)
          })
          this.checkedIems = uniq(this.checkedIems)
        }
      },
      $_showPost (post) {
        this.showLightBox = true
        this.post = post
      },
    },
    watch: {
      currPage () {
        this.$emit('filterChanged', { page: this.currPage, })
      },
    },
  }
</script>
<style lang="stylus" scoped>

.postList
  width 100%
  margin-top 10px
  color #808080
  text-align left
  border-collapse collapse
  thead
    font-size .9375rem
  tbody
    font-size .85rem
  th
    padding-top 5px
    border-top 2px solid #000
    span
      position relative
      cursor pointer
      &::before
        content ''
        position absolute
        top 0
        left 100%
        width 15px
        height 100%
        background-position center center
        background-repeat no-repeat
        background-size 7px auto
        background-image url(/public/icons/double-triangle.png)
  tr
    &.active
      td
        background-color #d3d3d3
    &:last-of-type
      td
        border-bottom none
  td
    max-width 0
    padding-top 5px
    padding-bottom 5px
    text-overflow ellipsis
    white-space nowrap
    border-bottom 1px solid #d3d3d3
    overflow hidden
    &.postList__edit
      padding 2.5px 0
  
  input[type="checkbox"]
    width 14px
    height 14px
    line-height 1
  button:disabled
    background-color #ccc
  &-control
    text-align right
  &__checkbox
    width 20px
    height 25px
    padding-right 5px
    line-height 1
  &__multiple
    position absolute
    top 20px
    right 5%
    button
      margin-left 0
      margin-right 10px
      &:last-of-type
        margin-right 0
  &__nickname
    width 20%
    padding-right 10px
  &__type
    width 20px
    padding-right 5px
    &--news
      width 15px
      height 15px
      color #fff
      font-size 10px
      text-align center
      line-height 15px
      background-color #4280A2
      border-radius 50%
      user-select none
  &__title
    padding-right 10px
    cursor pointer
  &__edit
    width 20px
    line-height 1
    img
      width 20px
      height 20px
  &--center
    text-align center
  &__btn
    background-color transparent
    border none
    outline none
    &--single
      color #4280a2
    &--multiple
      width auto
      height 20px
      margin-left 10px
      color #fff
      font-size .9375rem
      line-height 20px
      background-color #808080
      border-radius 4px

</style>
