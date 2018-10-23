<template>
  <nav class="tag-nav-aside">
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
import { get, } from 'lodash'
import { mapState, } from 'vuex'
import TagItem from './TagItem.vue'

// const MAXRESULT = 3
// const DEFAULT_PAGE = 1
const DEFAULT_SORT = '-updated_at'
const DEFAULT_URL_PARAM= '/hot'
const getTags = (store, {
  urlParam = DEFAULT_URL_PARAM,
  // max_result = MAXRESULT,
  // page = DEFAULT_PAGE,
  sort = DEFAULT_SORT,
  keyword = '',
  stats = false,
} = {}) => {
  return store.dispatch('GET_PUBLIC_TAGS', {
    urlParam: urlParam,
    params: {
      // max_result: max_result,
      // page: page,
      sorting: sort,
      keyword: keyword,
      stats: stats,
      tagged_resources: 1,
    },
  })
}

const getUserFollowing = (store, { id = get(store, 'state.profile.id'), resource, resourceType = '', } = {}) => {
  return store.dispatch('GET_FOLLOWING_BY_USER', {
    id: id,
    resource: resource,
    resource_type: resourceType,
  })
}

export default {
  components: {
    TagItem,
  },
  computed: {
    ...mapState({
      tags: state => state.publicTags,
    }),
  },
  beforeMount () {
    getTags(this.$store, { stats: false, })
    getUserFollowing(this.$store, { resource: 'tag', })
  },
}
</script>

<style lang="stylus" scoped>
.tag-nav-aside
  padding 11.5px 15.5px 11.5px 31px
  width 100%
  &__list
    list-style none
    margin 0
    padding 0
    width 100%
  &__tag-item
    display flex !important
    & + &
      margin 14px 0 0 0
</style>

