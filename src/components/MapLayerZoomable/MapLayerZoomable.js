const difference = (arr1, arr2) => arr1.filter(x => !arr2.includes(x))

export default {
  name: 'v-mapbox-reservoirs-layer',

  inject: ['getMap'],

  render: () => null,

  props: {
    options: {
      type: Object,
      default: () => ({}),
    },
  },

  data: () => ({
    zoom: 0,
    activeLayerIds: [],
  }),

  methods: {
    deferredMountedTo () {
      if (!this.isInitialized) {
        this.initalize()
        this.isInitialized = true
      }
    },

    initalize () {
      const map = this.getMap()
      map.on('zoomend', this.onZoomEnd)
      this.onZoomEnd({ target: map })
    },

    onZoomEnd ({ target: map }) {
      this.zoom = Math.round(map.getZoom())
      const matchingLayers = this.options.layers
        .filter(({ zoomLevels }) => zoomLevels.includes(this.zoom))
      const matchingLayerIds = matchingLayers.map(({ id }) => id)
      const layersToAdd = difference(matchingLayerIds, this.activeLayerIds)
      const layersToRemove = difference(this.activeLayerIds, matchingLayerIds)
      layersToAdd.forEach(this.addLayerById)
      layersToRemove.forEach(this.removeLayerById)
      this.activeLayerIds = matchingLayerIds
    },

    addLayerById (layerId) {
      const map = this.getMap()
      if (!map) { return }
      const layer = this.options.layers.find(({ id }) => id === layerId)
      const { style, clickFn } = this.options

      map.addSource(layerId, { id: layerId, ...layer.source })

      map.addLayer({
        id: layerId,
        type: style.type,
        source: layerId,
        'source-layer': layerId,
        layout: {},
        paint: style.paint,
      })

      if (clickFn) {
        map.on('click', layerId, clickFn)
      }
    },

    removeLayerById (layerId) {
      console.log('remove layer', layerId)
      const map = this.getMap()
      if (!map) { return }
      map.removeLayer(layerId)
      map.removeSource(layerId)
      const { clickFn } = this.options
      if (clickFn) {
        map.on('click', layerId, clickFn)
      }
    },
  },

  mounted () {
    const map = this.getMap()
    // We can immediately initialize if we have the map ready
    if (map && map.isStyleLoaded()) {
      this.initalize()
      this.isInitialized = true
    }
  },

  destroyed () {
    this.removeLayer()
  },
}
