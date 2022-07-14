export const state = () => ({
  drawnFeatures: [],
  isDrawing: false,
})

export const getters = {
  drawnFeatures: state => state.drawnFeatures,
  isDrawing: state => state.isDrawing,
}

export const mutations = {
  SET_DRAWN_FEATURES (state, payload) {
    state.drawnFeatures = Object.freeze(payload)
  },
  SET_IS_DRAWING (state, payload) {
    state.isDrawing = payload
  },
}
