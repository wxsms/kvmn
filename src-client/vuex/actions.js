import axios from 'axios'

export const TYPES = {
  TOPICS_LIST: 'TOPICS_LIST',
  CLEAR_TOPICS: 'CLEAR_TOPICS',
  SET_USER: 'SET_USER',
  LOGIN: 'LOGIN',
  LOGOUT: 'LOGOUT'
}

export const getTopics = ({commit}) => {
  return axios.get('http://jsonplaceholder.typicode.com/posts')
    .then((response) => {
      if (response.statusText === 'OK') {
        commit(TYPES.TOPICS_LIST, response.data)
      }
    })
    .catch((error) => {
      console.log(error)
    })
}
export const clearTopics = ({commit}) => commit(TYPES.CLEAR_TOPICS)

export const setUser = ({commit}, user) => commit(TYPES.DECREMENT, user)
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
