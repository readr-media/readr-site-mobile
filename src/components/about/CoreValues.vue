<template>
  <section class="core-values">
    <div class="core-values__landing landing">
      <picture>
        <source
          srcset="/public/2.0/about/assets/基本價值-web.svg"
          media="(min-width: 768px)"
        >
        <img
          class="landing__img"
          src="/public/2.0/about/assets/基本價值-mobile.svg"
          alt="intro"
        >
      </picture>
    </div>
  </section>
</template>

<style lang="stylus" scoped>
.landing
  display flex
  justify-content center
  padding 0 10px
  &__img
    width 90vw
    position relative
    top -10px

@media (min-width 768px)
  .landing
    padding 0
    &__img
      width 50vw
</style>
