export const state = () => ({
  layers: [
    {
      id: 'reservoirsv10',
      source: {
        type: 'vector',
        url: 'mapbox://\'global-water-watch.reservoirs-v10\'',
      },
      styles: [
        {
          type: 'fill',
          paint: {
            'fill-color': '#8fdfef',
            'fill-opacity': 0.2,
          },
        },
        {
          type: 'line',
          paint: {
            'line-color': '#8fdfef',
            'line-width': 1,
          },
        },
      ],
    },
  ],
})

export const getters = {
  layers: state => state.layers,
}

export const mutations = {
  ADD_LAYER (state, newLayer) {

  },
  REMOVE_LAYER (state, layerId) {

  },
}

export const actions = {

}
