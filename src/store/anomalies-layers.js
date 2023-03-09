export const state = () => ({
  layers: [],
  anomaliesDate: null,
})

export const getters = {
  layers: state => state.layers,
  anomaliesDate: state => state.anomaliesDate,
}

export const mutations = {
  ADD_LAYER (state, newLayer) {
    const layerExists = state.layers.some(storedLayer => storedLayer.id === newLayer.id)
    if (!layerExists) {
      state.layers = [
        ...state.layers,
        Object.freeze({ ...newLayer }),
      ]
    }
  },
  REMOVE_LAYER (state, layerId) {
    state.layers = state.layers.filter(({ id }) => id !== layerId)
  },
  REMOVE_ALL_LAYERS (state) {
    state.layers = []
  },
  SET_ANOMALIES_DATE (state, date) {
    state.anomaliesDate = date
  },
}
