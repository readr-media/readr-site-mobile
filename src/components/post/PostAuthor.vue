<template>
  <section class="post-author">
    <template v-if="postType === 'review'">
      <div class="post-author__img">
        <div class="post-author__heading">
          評論
        </div>
        <figure>
          <img
            :src="author.profileImage || '/public/icons/exclamation.png'"
            :alt="author.nickname"
          >
        </figure>
      </div>
      <div class="post-author__name app-content-area">
        <h2 v-text="author.nickname" />
        <button
          v-if="author.description"
          :class="{ active: openDescription }"
          @click="openDescription = !openDescription"
        />
      </div>
      <div
        v-show="openDescription"
        class="post-author__descr app-content-area"
      >
        <p v-text="author.description" />
      </div>
    </template>
    <template v-else>
      <p
        class="small"
        v-text="defaultFormat"
      />
    </template>
  </section>
</template>
<script>

export default {
  name: 'PostAuthor',
  props: {
    author: {
      type: Object,
      required: true
    },
    postType: {
      type: String,
      default: 'news'
    }
  },
  data () {
    return {
      openDescription: false
    }
  },
  computed: {
    defaultFormat () {
      return `文 / ${this.author.nickname}`
    }
  }
}
</script>
<style lang="stylus" scoped>
.post-author
  > div
    & + div
      margin-top .5em
  &__img
    display flex
    width 70%
    figure
      position relative
      width 66%
      padding-top 66%
      img
        position absolute
        top 0
        left 0
        right 0
        bottom 0
        width 100%
        object-fit cover
        object-position center
  &__heading
    flex 1
    display flex
    justify-content center
    align-items center
    color #fff
    font-size 1.5rem
    writing-mode vertical-lr
    letter-spacing .5em
    background-color #d6c721
  &__name
    display flex
    align-items center
    h2
      font-size 1.25rem
    button
      position relative
      top -2px
      width 25px
      height 25px
      margin-left .6em
      background-color #d6c721
      background-image url(/public/2.0/icons/info.png)
      background-size auto 18px
      background-position center center
      background-repeat no-repeat
      border-radius 50%
      box-shadow 0 2px 4px 0 rgba(0, 0, 0, 0.5)
      transition transform .5s
      &.active
        transform rotate(90deg)
  &__descr
    padding 1em
    background-color #fff
    border-radius 8px
    p
      line-height 1.86

@media (min-width: 768px)
  .post-author
    &__img
      width 60%
      margin 0 auto
      figure
        width 150px
        padding-top 150px
    &__heading
      max-width 70px

</style>
