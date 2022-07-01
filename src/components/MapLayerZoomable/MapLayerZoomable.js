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
    hoveredFeatureId: null,
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
      console.log(this.zoom)
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
      const { styles, clickFn } = this.options

      map.addSource(layerId, { id: layerId, ...layer.source, promoteId: 'HYBAS_ID' })

      styles.forEach((style) => {
        const layerUniqueId = `${layerId}-${style.type}`
        map.addLayer({
          id: layerUniqueId,
          type: style.type,
          source: layerId,
          'source-layer': layerId,
          layout: {},
          paint: style.paint,
        })

        if (style.type === 'fill') {
          map.on('mousemove', layerUniqueId, (evt) => {
            const newHoveredFeatureId = evt.features?.[0]?.id
            if (!newHoveredFeatureId) {
              return
            }
            // Reset previous hover state
            if (this.hoveredFeatureId !== null) {
              map.setFeatureState(
                {
                  source: layerId,
                  sourceLayer: layerId,
                  id: this.hoveredFeatureId,
                },
                { hover: false },
              )
            }
            console.log(this.hoveredFeatureId, newHoveredFeatureId)
            // Set new hover state
            this.hoveredFeatureId = newHoveredFeatureId
            map.setFeatureState(
              {
                source: layerId,
                sourceLayer: layerId,
                id: this.hoveredFeatureId,
              },
              { hover: true },
            )
          })
        }

        if (clickFn) {
          map.on('click', layerId, clickFn)
        }
      })
    },

    removeLayerById (layerId) {
      const map = this.getMap()
      if (!map) { return }
      map.removeLayer(layerId)
      map.removeSource(layerId)
      const { clickFn } = this.options
      if (clickFn) {
        map.off('click', layerId, clickFn)
      }
    },

    removeAllLayers () {
      this.activeLayerIds.forEach(this.removeLayerById)
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
    this.removeAllLayers()
  },
}
