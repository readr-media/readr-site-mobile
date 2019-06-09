<template>
  <div
    id="app"
    class="app"
  >
    <LoginLight />
    <AppHeader class="app__header" />
    <transition
      name="fade"
      mode="out-in"
    >
      <router-view class="view" />
    </transition>
    <AppFooter class="app__footer" />
  </div>
</template>

<script>
import AppHeader from 'src/components/AppHeader/AppHeader.vue'
import AppFooter from 'src/components/AppFooter.vue'
import LoginLight from 'src/components/login/LoginLight.vue'

import { SITE_FULL, SITE_NAME } from './constants'
import { updateViewport } from 'src/util/comm'

export default {
  components: {
    AppHeader,
    AppFooter,
    LoginLight
  },
  metaInfo: {
    titleTemplate: `%s - ${SITE_NAME}`,
    meta: [
      { name: 'og:image', content: `${SITE_FULL}/public/og-image.jpg` }
    ]
  },
  beforeMount () {
    this.updateViewport()
  },
  mounted () {
    window.addEventListener('resize', this.updateViewport)
  },
  beforeDestroy () {
    window.removeEventListener('resize', this.updateViewport)
  },
  methods: {
    updateViewport () {
      updateViewport(this.$store)
    }
  }
}
</script>

<style lang="stylus">

h1, h2, h3, p, a, figure, pre
  margin 0
h1, h2, h3, p, a
  color #000
h1
  font-size 2.8125rem
  font-weight normal
h2
  font-size 1.5rem
  font-weight 500
p
  font-size 1.125rem
  font-weight normal
  &.small
    color #4a4a4a
    font-size .875rem
button, input, textarea
  font-size 1rem
a
  text-decoration none
  cursor pointer
  &:link, &:visited, &:hover, &:active
    color #000
button
  background-color transparent
  border none
  cursor pointer
figure
  background-color #979797
img
  font-size .75rem // for alt text
pre
  padding .5em
  color #f8f8f2
  white-space pre-line
  background-color #23241f
  border-radius 3px

.fade-enter-active, .fade-leave-active
  transition opacity .5s
.fade-enter, .fade-leave-to
  opacity 0

.app
  display flex
  flex-direction column
  min-height 100vh
  background-color #f1f1f1
  &__header
    position fixed
    top 0
    left 0
  &-list
    h1, h2, p
      line-height 1.3
    h1, h2, p, figure
      & + h1, & + h2, & + p, & + div
        margin-top .5em
    h1
      font-size .75rem
      font-weight normal
    figure
      background-color #979797
  &-content-area
    width 90%
    margin-left auto
    margin-right auto

.view
  flex 1

@media (min-width: 768px)
  h1
    font-size 2.8125rem
  h2
    font-size 1.5rem
  p
    font-size 1.125rem
    &.small
      font-size .875rem
  .app
    &-content-area
      width 60%
      max-width 800px
    &-list
      font-size 1.5rem
      h1
        font-size 1.5rem
</style>
