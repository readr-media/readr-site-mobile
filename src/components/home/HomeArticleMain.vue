<template>
  <article class="home-article-main">
    <div class="home-article-main__info info">
      <figure class="author-info">
        <router-link class="author-info__thumbnail" :to="authorPublicProfileUrl">
          <img :src="authorThumbnailImg" alt="" v-if="isClientSide">
        </router-link>
        <figcaption class="author-info__meta">
          <AppDateCreatedUpdated
            v-if="isReportOrMemo && shouldShowMultipleDate"
            class="author-info__date-report-memo"
            :createdAt="articleData.createdAt"
            :updatedAt="articleData.updatedAt"
          />
          <p v-else class="author-info__date" v-text="dateDiffFromNow"></p>
          <router-link class="author-info__nickname" :to="authorPublicProfileUrl">
            <p class="author-info__nickname" v-text="authorNickname"></p>
          </router-link>
        </figcaption>
      </figure>
    </div>
    <div class="home-article-main__content">
      <PostContent :post="articleData" :key="`post-content-${articleData.id}`" :id="`post-content-${articleData.id}`"></PostContent>
    </div>
  </article>
</template>

<script>
import AppDateCreatedUpdated from 'src/components/AppDateCreatedUpdated.vue'
import PostContent from 'src/components/post/PostContent.vue'
import { dateDiffFromNow, isClientSide, getArticleAuthorNickname, getArticleAuthorThumbnailImg, } from 'src/util/comm'
import { getPostType, } from 'src/util/post/index'
import { get, } from 'lodash'

export default {
  props: {
    articleData: {
      type: Object,
      default: {
        author: {
          nickname: '',
        },
        title: '',
        content: '',
      },
    },
    shouldShowMultipleDate: {
      type: Boolean,
      default: true,
    },
  },
  components: {
    AppDateCreatedUpdated,
    PostContent,
  },
  data () {
    return {
      isReadMore: false,
    }
  },
  computed: {
    authorId () {
      return get(this.articleData, 'author.id') || get(this.articleData, 'author')
    },
    authorPublicProfileUrl () {
      return this.authorId ? `/profile/${this.authorId}` : '#'
    },
    dateDiffFromNow () {
      return dateDiffFromNow(this.articleData.publishedAt)
    },
    isClientSide,
    authorNickname () {
      return getArticleAuthorNickname(this.articleData)
    },
    authorThumbnailImg () {
      return getArticleAuthorThumbnailImg(this.articleData)
    },
    isReportOrMemo () {
      return getPostType(this.articleData) === 'report' || getPostType(this.articleData) === 'memo'
    },
  },
  methods: {
    get,
  },
}
</script>

<style lang="stylus" scoped>
.home-article-main
  display flex
  flex-direction column
  justify-content center
  align-items center
  width 100%
  margin-top 20px
  position relative
  &__share
    position absolute
    top 15px
    right 15px
    width 30px
    height 30px
  &__info
    width 100%
    height 60px
    background-color #d3d3d3
  &__content
    width 100%
    height inherit
    box-shadow 0px 0px 3px 2px rgba(211, 211, 211, 1)
    padding 15px
    background-color white
    display flex
    flex-direction column
  // &__comment
  //   margin-top 20px
  &__date
    font-size 14px
    font-weight 500
    color #808080
    margin 0 0 5px 0
  &__title
    font-size 18px
    font-weight 600
    margin 0
  & + .home-article-main
    margin-top 10px

.author-info
  margin 0
  display flex
  flex-direction row
  justify-content flex-start
  align-items center
  position relative
  &__thumbnail
    width 60px
    height 60px
    img
      width 100%
      height 100%
      object-fit cover
  &__meta
    margin-left 20px
    display flex
    flex-direction column
    justify-content center
    p
      margin 5px 0 0 0
  &__date
    font-size 12px
    font-weight 500
  &__date-report-memo
    & >>> .date__field + .date__field
      border-left 1px solid gray
    & >>> .field--gray
      color gray
  &__nickname
    font-size 18px
    color #000
  &:before
    content ''
    position absolute
    left calc(60px - 12px)
    bottom 0
    width 0
    height 0
    border-style solid
    border-width 0 12px 20px 12px
    border-color transparent transparent #ffffff transparent

.info
  display flex
  justify-content space-between
  align-items center

@media (max-width 320px)
  .author-info
    &__date-report-memo
      & >>> .field
        font-size 9px
</style>