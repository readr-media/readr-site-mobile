<template>
  <nav class="tag-nav-aside">
    <!-- TODO: add sorting radio buttons -->
    <h1 class="tag-nav-aside__sort-title" v-text="$t('TAG_NAV_ASIDE.TITLE.HOT')"></h1>
    <ol class="tag-nav-aside__list">
      <TagItem
        v-for="tag in tags"
        :key="tag.id"
        class="tag-nav-aside__tag-item"
        :tag="tag"
        :shouldShowRelatedsList="true"
      />
    </ol>
  </nav>
</template>

<script>
import { isEmpty, take, } from 'lodash'
import { mapState, } from 'vuex'
import TagItem from './TagItem.vue'

const MAXRESULT = 3
const DEFAULT_PAGE = 1
const DEFAULT_SORT = '-updated_at'
const DEFAULT_URL_PARAM= '/hot'
const getTags = (store, {
  urlParam = DEFAULT_URL_PARAM,
  max_result = MAXRESULT,
  page = DEFAULT_PAGE,
  sort = DEFAULT_SORT,
  keyword = '',
  stats = false,
} = {}) => {
  return store.dispatch('GET_PUBLIC_TAGS', {
    urlParam: urlParam,
    params: {
      max_result: max_result,
      page: page,
      sorting: sort,
      keyword: keyword,
      stats: stats,
      tagged_resources: 1,
    },
  })
}

export default {
  components: {
    TagItem,
  },
  computed: {
    ...mapState({
      tags: state => take(state.publicTags, 3),
    }),
  },
  beforeMount () {
    if (isEmpty(this.tags)) {
      getTags(this.$store, { stats: false, })
    }
  },
}
</script>

<style lang="stylus" scoped>
.tag-nav-aside
  padding 11.5px 15.5px
  &__sort-title
    font-size 15px
    font-weight 400
    margin 0 0 11.5px 0
  &__list
    list-style none
    margin 0
    padding 0
  &__tag-item
    display flex !important
    & + &
      margin 10px 0 0 0
</style>

