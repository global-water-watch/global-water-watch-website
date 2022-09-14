export const state = () => ({
  layers: [],
  cachedGeometry: null,
})

export const getters = {
  layers: state => state.layers,
  cachedGeometry: state => state.cachedGeometry,
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
  SET_CACHED_GEOMETRY (state, geom) {
    state.cachedGeometry = geom
  },
}
