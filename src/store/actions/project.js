import _ from 'lodash'
import { PROJECT_STATUS, } from 'api/config'
import { getPublicProjectsList, } from 'src/api'

const debug = require('debug')('CLIENT:store:actions:project')

// need sync readr-site version
const GET_PROJECTS_LIST = ({ commit, }, { params, }) => {
  return new Promise((resolve) => {
    getPublicProjectsList({ params, })
    .then(({ status, body, }) => {
      if (status === 200) {
        commit('SET_PROJECTS_LIST', { projectsList: body, })
      }
      resolve(body)
    })
    .catch((res) => {
      // reject(res)
      resolve(res)
    })
  }) 
}

const GET_PUBLIC_PROJECT = ({ commit, }, { params, }) => {
  return getPublicProjectsList({ params, }).then(({ status, body, }) => {
    debug('Get single pro!', status, body)
    if (status === 200) {
      commit('SET_PUBLIC_PROJECT_SINGLE', { item: _.get(body, [ 'items', 0, ]), })
      return _.get(body, [ 'items', 0, ])
    } else {
      return { status, }
    }
  })
}

// need sync readr-site version
const GET_PUBLIC_PROJECTS = ({ commit, state, }, { params, }) => {
  const projectStatus = _.get(params, [ 'where', 'status', ])
  return getPublicProjectsList({ params, })
    .then(({ status, body, }) => {
      if (status === 200) {
        const loadmoreItems = body.items
        let orig
        switch (projectStatus) {
          case PROJECT_STATUS.WIP:
            if (params.page > 1) {
              orig = _.values(_.get(state, [ 'publicProjects', 'inProgress', ], []))
              body.items =  _.concat(orig, body.items)
            }
            commit('SET_PUBLIC_PROJECTS', { status: 'inProgress', publicProjects: body.items, })
            return loadmoreItems
          case PROJECT_STATUS.DONE:
            if (params.page > 1) {
              orig = _.values(_.get(state, [ 'publicProjects', 'done', ], []))
              body.items =  _.concat(orig, body.items)
            }
            commit('SET_PUBLIC_PROJECTS', { status: 'done', publicProjects: body.items, })
            return loadmoreItems
          default:
            if (params.page > 1) {
              orig = _.values(_.get(state, [ 'publicProjects', 'normal', ], []))
              body.items =  _.concat(orig, body.items)
            }
            commit('SET_PUBLIC_PROJECTS', { status: 'normal', publicProjects: body.items, })
            return loadmoreItems
        }
      }
    })
}

export {
  GET_PROJECTS_LIST,
  GET_PUBLIC_PROJECT,
  GET_PUBLIC_PROJECTS,
}

