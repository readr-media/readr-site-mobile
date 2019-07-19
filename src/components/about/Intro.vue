<template>
  <section class="intro">
    <div class="intro__landing landing">
      <picture>
        <source
          srcset="/public/2.0/about/assets/關於我們-web.svg"
          media="(min-width: 768px)"
        >
        <img
          class="landing__img"
          src="/public/2.0/about/assets/關於我們-mobile.svg"
          alt="intro"
        >
      </picture>
    </div>
    <footer class="intro__footer footer">
      <p class="footer__description description">
        <span>
          提供有趣、多元的新聞報導，例如
        </span>
        <span class="description__highlight">
          數據分析
        </span>
        <span>
          、
        </span>
        <span class="description__highlight">
          多媒體互動
        </span>
        <span>
          ，
        </span>
        <span class="description__highlight">
          理想的閱讀體驗
        </span>
        <span>
          都會是我們提供的服務
        </span>
      </p>
    </footer>
  </section>
</template>

<style lang="stylus" scoped>
.landing
  background-color #69CAD3
  padding 50px 10px

.footer
  background-color #363C5C
  display flex
  justify-content center
  padding 20px 10px

.description
  color white
  font-size 16px
  line-height 1.5
  text-align justify
  &__highlight
    color #DDD01F

@media (min-width 768px)
  .landing
    padding 80px 100px

  .footer
    height 100px
    padding 20px 0 50px 0

  .description
    font-size 16px

@media (min-width 1024px)
  .description
    font-size 20px
</style>
