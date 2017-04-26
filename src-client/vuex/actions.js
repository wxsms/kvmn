import request from 'axios'

export const getTopics = ({ commit, state }) => {
  return request.get('http://jsonplaceholder.typicode.com/posts').then((response) => {
    if (response.statusText === 'OK') {
      commit('TOPICS_LIST', response.data)
    }
  }).catch((error) => {
    console.log(error)
  })
}

export const increment = ({ commit }) => commit('INCREMENT')
export const decrement = ({ commit }) => commit('DECREMENT')
