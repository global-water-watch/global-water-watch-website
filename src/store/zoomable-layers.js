export const state = () => ({
  layers: [],
})

export const getters = {
  layers: state => state.layers,
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
}
