export const state = () => ({
  selectedReservoir: null,
})

export const getters = {
  selectedReservoir: state => state.selectedReservoir,
}

export const mutations = {
  SET_SELECTED_RESERVOIR (state, payload) {
    state.selectedReservoir = payload
  },
}

export const actions = {
  setSelectedReservoir ({ commit }, reservoir) {
    commit('SET_SELECTED_RESERVOIR', reservoir)
  },
}
