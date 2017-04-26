import axios from 'axios'

export const TYPES = {
  ARTICLE_LIST: 'ARTICLE_LIST',
  ARTICLE: 'ARTICLE',
  CLEAR_ARTICLES: 'CLEAR_ARTICLES',
  CLEAR_ARTICLE: 'CLEAR_ARTICLE',
  SET_USER: 'SET_USER',
  LOGIN: 'LOGIN',
  LOGOUT: 'LOGOUT'
}

export const getArticles = ({commit}) => {
  return axios.get('http://localhost:3000/api/articles/')
    .then((response) => {
      commit(TYPES.ARTICLE_LIST, response.data)
    })
    .catch((error) => {
      console.log(error)
    })
}
export const clearArticles = ({commit}) => commit(TYPES.CLEAR_ARTICLES)

export const getArticleById = ({commit}, id) => {
  return axios.get('http://localhost:3000/api/articles/' + id)
    .then((response) => {
      commit(TYPES.ARTICLE, response.data)
    })
    .catch((error) => {
      console.log(error)
    })
}
export const clearArticle = ({commit}) => commit(TYPES.CLEAR_ARTICLE)

export const setUser = ({commit}, user) => commit(TYPES.SET_USER, user)
export const login = ({commit}, data) => {
  axios.post('/api/auth/login', data)
    .then(response => {
      commit(TYPES.LOGIN, response.data)
    })
    .catch(err => {
      console.error(err)
    })
}
export const logout = ({commit}) => {
  return axios.post('/api/auth/logout')
    .then(response => {
      commit(TYPES.LOGOUT)
    })
    .catch(err => {
      console.error(err)
    })
}
