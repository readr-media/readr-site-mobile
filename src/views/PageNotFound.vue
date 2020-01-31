<template>
  <div class="page-not-found">
    <div class="page-not-found__top top">
      <div class="top__back-to-home back-to-home">
        <img
          class="back-to-home__404-img"
          src="/public/404.svg"
          alt=""
        >
        <div class="back-to-home__to-home to-home">
          <p
            class="to-home__hint"
            v-text="$t('NOT_FOUND.TO_HOME_HINT')"
          />
          <button
            class="to-home__button"
            @click="$router.push('/')"
            v-text="$t('NOT_FOUND.TO_HOME_BUTTON')"
          />
        </div>
      </div>
    </div>
    <div class="page-not-found__bottom bottom">
      <div class="bottom__projects-list-title projects-list-title">
        <h1
          class="projects-list-title__text"
          v-text="$t('NOT_FOUND.PROJECTS')"
        />
      </div>
      <ol class="bottom__projects-list projects-list">
        <li
          v-for="(project, i) in projects"
          :key="get(project, 'id', i)"
          class="projects-list__list-item list-item"
        >
          <router-link :to="project.slug ? `/series/${project.slug}` : '/'">
            <img
              v-if="project.heroImage"
              class="list-item__project-img"
              :src="getFullUrl(get(project, 'heroImage', ''))"
              alt=""
            >
            <div
              v-else
              class="list-item__project-img list-item__project-img--no-img"
              v-text="get(project, 'title', '')"
            />
            <p
              class="list-item__project-title"
              v-text="get(project, 'title', '')"
            />
          </router-link>
        </li>
      </ol>
    </div>
  </div>
</template>

<script>

import { SITE_NAME } from '../constants'
import { get } from 'lodash'
import { getFullUrl } from 'src/util/comm'
import { mapState } from 'vuex'

const MAXRESULT = 3

export default {
  name: 'PageNotFound',
  metaInfo: {
    title: SITE_NAME,
    titleTemplate: null
  },
  computed: {
    ...mapState({
      projects: state => state.DataSeries.publicProjects.normal
    })
  },
  asyncData ({ store }) {
    return store.dispatch('DataSeries/FETCH', { maxResult: MAXRESULT })
  },
  methods: {
    get,
    getFullUrl (url) {
      return url.includes('http') ? url : getFullUrl(url)
    }
  }
}
</script>

<style lang="stylus" scoped>
.page-not-found
  position relative
  min-height 100vh
  background-color white
  z-index 1000
  padding 40px 0 !important
  &__bottom
    margin 40px 0 0 0

.back-to-home
  height 100%
  display flex
  flex-direction column
  align-items center
  &__404-img
    width 70%
  &__to-home
    margin 0

.to-home
  display flex
  flex-direction column
  align-items center
  &__hint
    font-size 20px
    color #8c8c8c
    margin 20px 0
  &__button
    border none
    border-radius 18.8px
    font-size 30px
    font-weight 900
    color white
    background-color #808080
    width 207px
    padding 3px 0
    &:focus
      outline none

.bottom
  display flex
  flex-direction column
  align-items center

.projects-list-title
  width 90%
  display flex
  align-items center
  &:before
    flex 1 1 auto
    content ''
    height 1px
    background-color black
  &__text
    font-size 19px
    font-weight 600
    margin 0 17.5px
  &:after
    flex 1 1 auto
    content ''
    height 1px
    background-color black

.projects-list
  list-style none
  margin 12px 0 0 0
  padding 0
  display flex
  flex-direction column
  align-items center
  width 90%

.list-item
  width 100%
  & + &
    margin 20px 0 0 0
  &__project-img
    width 100%
    height calc(90vw * 0.525)
    object-fit cover
    background-color #11b8c9
    &--no-img
      display flex
      justify-content center
      align-items center
      font-size 25px
      color white
      text-align center
  &__project-title
    width 100%
    white-space nowrap
    overflow hidden
    text-overflow ellipsis
    margin 0
    padding 10px 0
    text-align center
    font-size 19px
    color black
</style>
