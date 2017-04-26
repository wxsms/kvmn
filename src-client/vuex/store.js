import Vue from 'vue'
import Vuex from 'vuex'
import * as actions from './actions'
import * as getters from './getters'

Vue.use(Vuex)

const state = {
  user: null,
  topics: [],
  count: 0
}

const mutations = {
  [actions.TYPES.TOPICS_LIST]: (state, topics) => {
    state.topics = topics
  },
  [actions.TYPES.INCREMENT]: (state) => {
    state.count++
  },
  [actions.TYPES.DECREMENT]: (state) => {
    state.count--
  },
  [actions.TYPES.CURRENT_USER]: (state, user) => {
    state.user = user
  },
  [actions.TYPES.LOGIN]: (state, user) => {
    state.user = user
  },
  [actions.TYPES.LOGOUT]: (state) => {
    state.user = null
  }
}

export default new Vuex.Store({
  state,
  actions,
  mutations,
  getters
})
