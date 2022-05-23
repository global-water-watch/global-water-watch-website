import {
  BASIN_LAYER_05,
  BASIN_TILE_SET_ID_05,
  RESERVOIRS_LAYER,
  RESERVOIR_TILE_SET_ID,
} from '@/lib/constants'

export const state = () => ({
  selectedSources: [
    RESERVOIRS_LAYER,
    BASIN_LAYER_05,
  ],
  sources: [
    {
      id: RESERVOIRS_LAYER,
      type: 'vector',
      url: `mapbox://${RESERVOIR_TILE_SET_ID}`,
    },
    {
      id: BASIN_LAYER_05,
      type: 'vector',
      url: `mapbox://${BASIN_TILE_SET_ID_05}`,
    },
  ],
})

export const getters = {
  selectedSources: state => state.selectedSources,
  getAllSources: state => state.sources,
  getSelectedSources: (state) => {
    return state.sources.filter((source) => {
      return state.selectedSources.includes(source.id)
    })
  },
}

export const mutations = {
  SET_SELECTED_SOURCES (state, sources) {
    state.selectedSources = sources
  },
}

export const actions = {
  setSelectedSources ({ commit }, sources) {
    commit('SET_SELECTED_SOURCES', sources)
  },
}
