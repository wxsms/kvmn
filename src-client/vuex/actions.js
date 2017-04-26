import axios from 'axios'

export const TYPES = {
  TOPICS_LIST: 'TOPICS_LIST',
  INCREMENT: 'INCREMENT',
  DECREMENT: 'DECREMENT',
  CURRENT_USER: 'CURRENT_USER',
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

export const increment = ({commit}) => commit(TYPES.INCREMENT)
export const decrement = ({commit}) => commit(TYPES.DECREMENT)

export const getCurrentUser = ({commit}) => {
  return axios.get('/api/auth/user')
    .then((response) => {
      if (response.data && response.data._id) {
        commit(TYPES.CURRENT_USER, response.data)
      }
    })
    .catch((error) => {
      console.log(error)
    })
}

export const login = ({commit}, data) => {
  return new Promise((resolve, reject) => {
    axios.post('/api/auth/login', data)
      .then(response => {
        commit(TYPES.LOGIN, response.data)
        resolve()
      })
      .catch(err => {
        reject(err)
      })
  })
}

export const logout = ({commit}) => commit(TYPES.LOGOUT)
