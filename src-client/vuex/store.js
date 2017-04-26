import Vue from 'vue'
import Vuex from 'vuex'
import * as actions from './actions'
import * as getters from './getters'

Vue.use(Vuex)

const state = {
  user: null,
  articles: [],
  article: null
}

const mutations = {
  [actions.TYPES.ARTICLE_LIST]: (state, articles) => {
    state.articles = articles
  },
  [actions.TYPES.CLEAR_ARTICLES]: (state) => {
    state.articles = []
  },
  [actions.TYPES.ARTICLE]: (state, article) => {
    state.article = article
  },
  [actions.TYPES.CLEAR_ARTICLE]: (state) => {
    state.article = null
  },
  [actions.TYPES.SET_USER]: (state, user) => {
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
