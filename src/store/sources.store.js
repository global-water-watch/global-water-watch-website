const RESERVOIRS_LAYER = 'reservoirsv10'
const RESERVOIR_TILE_SET_ID = 'global-water-watch.reservoirs-v10'
const BASIN_LAYER = 'BasinATLAS_v10_lev05'
const BASIN_TILE_SET_ID = 'global-water-watch.BasinATLAS_v10_lev05'

export const state = () => ({
  selectedSources: [
    RESERVOIRS_LAYER,
    BASIN_LAYER,
  ],
  sources: [
    {
      id: RESERVOIRS_LAYER,
      type: 'vector',
      url: `mapbox://${RESERVOIR_TILE_SET_ID}`,
    },
    {
      id: BASIN_LAYER,
      type: 'vector',
      url: `mapbox://${BASIN_TILE_SET_ID}`,
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
