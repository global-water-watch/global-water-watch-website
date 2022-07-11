export const state = () => ({
  mapReady: false,
  activeLayerName: 'Reservoirs',
})

export const getters = {
  mapReady: state => state.mapReady,
  activeLayerName: state => state.activeLayerName,
}

export const mutations = {
  SET_MAP_READY (state, payload) {
    state.mapReady = payload
  },
  SET_ACTIVE_LAYER_NAME (state, payload) {
    state.activeLayerName = payload
  },
}
