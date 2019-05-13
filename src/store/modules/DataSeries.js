import { PROJECT_STATUS, PROJECT_PUBLISH_STATUS } from '../../../api/config'
import {
  getPublicProjectsList
} from 'src/api'

export default {
  namespaced: true,
  state: {
    series: []
  },
  actions: {
    GET_SERIES ({ commit }, {
      maxResult = 10,
      page = 1,
      sort = 'project_order,-updated_at'
    }) {
      return getPublicProjectsList({
        params: {
          max_result: maxResult,
          page: page,
          sort: sort,
          where: {
            status: [ PROJECT_STATUS.DONE, PROJECT_STATUS.WIP ],
            publish_status: PROJECT_PUBLISH_STATUS.PUBLISHED
          }
        }
      })
        .then(response => {
          commit('SET_SERIES', response.body.items)
          return response.body.items
        })
    }
  },
  mutations: {
    SET_SERIES (state, series) {
      state.series = series
    }
  }
}
