import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)
const state = {
  currentUerName: ''
}
const mutations = {
  setUserName (state, value) {
    state.currentUerName = value
  }
}
const actions = {
  setUserNameAction: ({ commit }, value) => {
    commit('setUserName', value)
  }
}
const getters = {
  getUserName (state) {
    return state.currentUerName
  }
}
export default new Vuex.Store({
  state,
  getters,
  actions,
  mutations
})
