export const state = () => ({
  mapReady: false,
  activeLayerName: 'Basins',
  showExperimentalFeatures: process.env.IS_DEV,
})

export const getters = {
  mapReady: state => state.mapReady,
  activeLayerName: state => state.activeLayerName,
  showExperimentalFeatures: state => state.showExperimentalFeatures,
}

export const mutations = {
  SET_MAP_READY (state, payload) {
    state.mapReady = payload
  },
  SET_ACTIVE_LAYER_NAME (state, payload) {
    state.activeLayerName = payload
  },
  SET_SHOW_EXPERIMENTAL_FEATURES (state, payload) {
    state.showExperimentalFeatures = payload
  },
}
