import { MAP_CENTER, MAP_ZOOM } from '@/lib/constants'

export const state = () => ({
  latestSelectedReservoirCoordinates: {
    zoom: MAP_ZOOM,
    center: MAP_CENTER,
  },
})

export const getters = {
  latestSelectedReservoirCoordinates: state => state.latestSelectedReservoirCoordinates,
}

export const mutations = {
  SET_LATEST_SELECTED_RESERVOIR_COORDINATES (state, payload) {
    state.latestSelectedReservoirCoordinates = payload
  },
  RESET_LATEST_SELECTED_RESERVOIR_COORDINATES (state) {
    state.latestSelectedReservoirCoordinates = {
      zoom: MAP_ZOOM,
      center: MAP_CENTER,
    }
  },
}
