export const state = () => ({
  activeLayerName: 'Reservoirs',
})

export const getters = {
  activeLayerName: state => state.activeLayerName,
}

export const mutations = {
  SET_ACTIVE_LAYER_NAME (state, payload) {
    state.activeLayerName = payload
  },
}
