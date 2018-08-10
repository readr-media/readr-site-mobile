// const debug = require('debug')('CLIENT:mutations:tag')

const SET_PUBLIC_TAGS = (state, { tags, }) => {
  state['publicTags'] = tags || []
}

const SET_TAGS = (state, { tags, }) => {
  state['tags'] = tags || []
}

const SET_TAGS_COUNT = (state, { meta, }) => {
  state['tagsCount'] = meta.total
}

export {
  SET_PUBLIC_TAGS,
  SET_TAGS,
  SET_TAGS_COUNT,
}
