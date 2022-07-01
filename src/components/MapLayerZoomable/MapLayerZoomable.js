import { difference } from '@/lib/array-helpers'

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
    mouseMoveFnMap: {},
    mouseLeaveFnMap: {},
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
      console.info(this.zoom)
      const matchingLayers = this.options.layers
        .filter(({ zoomLevels }) => zoomLevels.includes(this.zoom))
      const matchingLayerIds = matchingLayers.map(({ id }) => id)
      const layersToAdd = difference(matchingLayerIds, this.activeLayerIds)
      const layersToRemove = difference(this.activeLayerIds, matchingLayerIds)
      layersToRemove.forEach(this.removeLayerById)
      layersToAdd.forEach(this.addLayerById)
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
          this.mouseMoveFnMap[layerUniqueId] = (evt) => {
            const newHoveredFeatureId = evt.features?.[0]?.id
            if (!newHoveredFeatureId || newHoveredFeatureId === this.hoveredFeatureId) {
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
          }

          this.mouseLeaveFnMap[layerUniqueId] = () => {
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
            this.hoveredFeatureId = null
          }

          map.on('mousemove', layerUniqueId, this.mouseMoveFnMap[layerUniqueId])
          map.on('mouseleave', layerUniqueId, this.mouseLeaveFnMap[layerUniqueId])
        }

        if (clickFn) {
          map.on('click', layerUniqueId, clickFn)
        }
      })
    },

    removeLayerById (layerId) {
      const map = this.getMap()
      if (!map) { return }

      const { styles } = this.options
      styles.forEach((style) => {
        const layerUniqueId = `${layerId}-${style.type}`
        map.removeLayer(layerUniqueId)

        // Only remove source when no other layers depend on it
        if (!map.getStyle().layers.some(({ source }) => source === layerId)) {
          map.removeSource(layerId)
        }

        if (this.mouseMoveFnMap[layerUniqueId]) {
          map.off('mousemove', layerUniqueId, this.mouseMoveFnMap[layerUniqueId])
          delete this.mouseMoveFnMap[layerUniqueId]
        }

        if (this.mouseLeaveFnMap[layerUniqueId]) {
          map.off('mouseleave', layerUniqueId, this.mouseLeaveFnMap[layerUniqueId])
          delete this.mouseLeaveFnMap[layerUniqueId]
        }

        const { clickFn } = this.options
        if (clickFn) {
          map.off('click', layerId, clickFn)
        }
      })
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
