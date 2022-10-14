import { MAP_CENTER, MAP_ZOOM } from '@/lib/constants'

export const state = () => ({
  mapReady: false,
  activeLayerName: 'Reservoirs',
  showExperimentalFeatures: process.env.IS_DEV,
  mapCoordinates: {
    zoom: MAP_ZOOM,
    center: MAP_CENTER,
  },
})

export const getters = {
  mapReady: state => state.mapReady,
  activeLayerName: state => state.activeLayerName,
  showExperimentalFeatures: state => state.showExperimentalFeatures,
  mapCoordinates: state => state.mapCoordinates,
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
  SET_MAP_COORDINATES (state, payload) {
    state.mapCoordinates = payload
  },
}
