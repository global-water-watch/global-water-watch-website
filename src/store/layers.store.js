import {
  BASIN_LAYER_05,
  RESERVOIRS_LAYER,
} from '@/lib/constants'

export const state = () => ({
  selectedLayers: [],
  layers: [
    {
      id: `${RESERVOIRS_LAYER}-fill`,
      type: 'fill',
      source: RESERVOIRS_LAYER,
      'source-layer': RESERVOIRS_LAYER,
      layout: {},
      paint: {
        'fill-color': '#8fdfef',
        'fill-opacity': 0.2,
      },
    },
    {
      id: `${RESERVOIRS_LAYER}-line`,
      type: 'line',
      source: RESERVOIRS_LAYER,
      'source-layer': RESERVOIRS_LAYER,
      layout: {},
      paint: {
        'line-color': '#8fdfef',
        'line-width': 1,
      },
    },
    {
      id: `${BASIN_LAYER_05}-fill`,
      type: 'fill',
      source: BASIN_LAYER_05,
      'source-layer': BASIN_LAYER_05,
      layout: {},
      paint: {
        'fill-color': '#0080ff',
        'fill-opacity': 0.5,
      },
    },
  ],
})

export const getters = {
  selectedLayers: state => state.selectedLayers,
  getAllLayers: state => state.layers,
  getSelectedLayers: (state) => {
    return state.layers.filter(layer => state.selectedLayers.includes(layer.id))
  },
}

export const mutations = {
  SET_SELECTED_LAYERS (state, layers) {
    state.selectedLayers = layers
  },
}

export const actions = {
  setSelectedLayers ({ commit }, layers) {
    commit('SET_SELECTED_LAYERS', layers)
  },
}
