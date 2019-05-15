import Vue from 'vue'

export default {
  namespaced: true,
  state () {
    return {
      width: 0,
      height: 0
    }
  },
  mutations: {
    SET_VIEWPORT: (state, { width = 0, height = 0 }) => {
      Vue.set(state, 'width', width)
      Vue.set(state, 'height', height)
    }
  },
  actions: {
    UPDATE_VIEWPORT: ({ commit }, viewport) => {
      commit('SET_VIEWPORT', viewport)
    }
  }
}
