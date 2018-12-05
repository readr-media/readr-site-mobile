<template>
  <a
    :class="[ 'source', { 'source--no-source': post.link && !hasSource } ]"
    :href="post.link"
    target="_blank"
  >
    <template v-if="hasSource">
      <div class="source__content content">
        <h1 class="content__title" v-text="linkTitleTrim"></h1>
        <div class="content__descriptions descriptions">
          <!-- <p class="descriptions__description" v-text="linkDescriptionTrim"></p> -->
          <p
            v-if="post.linkName"
            class="descriptions__cite"
          >
            {{ $t('homepage.WORDING_HOME_POST_SOURCE') }}{{ linkNameTrim }}
          </p>
        </div>
      </div>
      <img
        class="source__link-image"
        :src="post.linkImage"
        @load="setOgImageOrientation(post.linkImage, $event)"
      >
    </template>
    <template v-else-if="post.link && !hasSource">
      {{ decodeURI(post.link) }}
    </template>
  </a>
</template>

<script>
import { get, } from 'lodash'
import { onImageLoaded, } from 'src/util/comm'

export default {
  props: {
    post: {
      type: Object,
      required: true,
    },
  },
  computed: {
    hasSource () {
      return get(this.post, [ 'processed', 'hasSource', ], false)
    },
    linkTitleTrim () {
      return get(this.post, [ 'processed', 'linkTitleTrim', ], '')
    },
    // linkDescriptionTrim () {
    //   return get(this.post, [ 'processed', 'linkDescriptionTrim', ], '')
    // },
    linkNameTrim () {
      return get(this.post, [ 'processed', 'linkNameTrim', ], '')
    },
  },
  methods: {
    setOgImageOrientation (src, event) {
      onImageLoaded(src).then(({ width, height, }) => {
        width < height ? event.target.style.objectFit = 'contain' : event.target.style.objectFit = 'cover'
      }).catch(() => { event.target.style.objectFit = 'cover' })
    },
  },
}
</script>

<style lang="stylus" scoped>
.source
  height 102px
  border solid 0.5px #d3d3d3
  display flex
  justify-content space-between
  &--no-source
    display block
    height auto
    border none
    padding 0
    color #808080
    font-size 12px
    word-break break-all
  &__content
    order 1
    width 50%
    padding 10px
    position relative
  &__link-image
    order 0
    margin 0
    display flex
    align-self center
    width 50%
    height 100%
    object-fit cover
    object-position center

.content
  &__title
    font-size 12px
    font-weight 500
    color #808080
    margin 0
    line-height 1.4

.descriptions
  // &__description
  //   font-size 14px
  //   font-weight 300
  //   color #808080
  //   line-height 1.4
  //   margin 5px 0 0 0
  //   text-align justify
  &__cite
    font-size 11px
    font-weight 300
    color #808080
    align-self flex-end
</style>


