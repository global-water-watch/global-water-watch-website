export const state = () => ({
  drawnFeatures: [],
})

export const getters = {
  drawnFeatures: state => state.drawnFeatures,
}

export const mutations = {
  SET_DRAWN_FEATURES (state, payload) {
    state.drawnFeatures = Object.freeze(payload)
  },
}
