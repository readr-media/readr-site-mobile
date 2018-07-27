<template>
  <div>
    <img class="baselightbox-post__leading-image" v-if="post.ogImage && isClientSide"
      :src="getImageUrl(post.ogImage)"
      @load="setLeadingImageOrientation(getImageUrl(post.ogImage), $event)">
    <div class="baselightbox-post__article-container">
      <article class="baselightbox-post__article">
        <section class="author-info">
          <router-link :to="`/profile/${authorId}`">
            <img class="author-info__thumbnail" :src="authorThumbnailImg" v-if="isClientSide">
          </router-link>
          <div class="author-info__meta">
            <p class="author-info__date" v-text="!isPostEmpty ? updatedAtYYYYMMDD(post.updatedAt) : ''"></p>
            <router-link class="author-info__author-nickname" :to="`/profile/${authorId}`" v-text="authorNickname"></router-link>
          </div>
        </section>
        <section class="article-content">
          <h1 v-text="!isPostEmpty ? post.title : ''"></h1>
          <template v-for="p in postContent">
            <figure v-if="isImg(p)">
              <img v-if="isClientSide" :src="getImgSrc(p)" alt="post-content-img" @load="setContentImageOrientation(getImgSrc(p), $event)">
              <!-- <figcaption>
                我需要一個圖說
              </figcaption> -->
            </figure>
            <p v-else v-html="p"></p>
          </template>
        </section>
      </article>
      <div class="nav-container">
        <AppArticleNav :postId="post.id" :postRefId="assetRefId" :articleType="this.post.flag" :commentCount="commentCount" :tags="post.tags"/>
      </div>
    </div>
  </div>
</template>
<script>
  import AppArticleNav from 'src/components/AppArticleNav.vue' 
  import { getImageUrl, isClientSide, updatedAtYYYYMMDD, onImageLoaded, } from 'src/util/comm'
  export default {
    name: 'BaseLightBoxTemplateNews',
    components: {
      AppArticleNav,
    },
    computed: {
      isClientSide,
    },
    methods: {
      getImgSrc (content) { 
        const regexp = /<img.*?src=['"](.*?)['"]/ 
        return getImageUrl(regexp.exec(content)[1]) 
      },       
      isImg (content) { 
        const regexp = /<img([\w\W]+?)\/>/ 
        return regexp.test(content) 
      },       
      setLeadingImageOrientation (src, event) {
        onImageLoaded(src).then(({ width, height, }) => {
          width < height ? event.target.style.objectFit = 'contain' : event.target.style.objectFit = 'cover'
        }).catch(() => { event.target.style.objectFit = 'cover' })
      },
      setContentImageOrientation (src, event) {
        onImageLoaded(src).then(({ width, height, }) => {
          width < height ? event.target.classList.add('portrait') : event.target.classList.add('landscape')
        }).catch(() => { event.target.classList.add('landscape') })
      },    
      updatedAtYYYYMMDD,
      getImageUrl,
    },
    mounted () {},
    props: { 
      assetRefId: {}, 
      authorId: Number, 
      authorThumbnailImg: String, 
      authorNickname: String, 
      commentCount: Number, 
      isPostEmpty: Boolean,       
      post: Object, 
      postContent: Array, 
    }, 
  }
</script>
<style lang="stylus" scoped></style>