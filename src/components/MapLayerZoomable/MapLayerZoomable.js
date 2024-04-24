import { LAYER_FADE_DURATION_MS } from '@/lib/constants'
import { difference } from '@/lib/array-helpers'
import { mouseEnterGeometry, mouseMoveGeometry, mouseLeaveGeometry } from '@/lib/map-hover-helpers'

export default {
  name: 'v-mapbox-zoomable-layer',

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
    mouseEnterFnMap: {},
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
      console.info('Zoom:', this.zoom)
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
      const { styles, clickFn, promoteId, attribution } = this.options

      // add source only if it doesn't exist
      // this prevents an error that makes the app unusable
      if (!map.getSource(layerId)) {
        map.addSource(layerId, {
          id: layerId,
          promoteId,
          attribution: attribution || '',
          ...layer.source,
        })
      }

      styles.forEach((style) => {
        const layerUniqueId = `${layerId}-${style.type}`

        // remove layer if it already exists
        // this prevents an error that makes the app unusable
        if (map.getLayer(layerUniqueId)) {
          map.removeLayer(layerUniqueId)
        }

        map.addLayer({
          id: layerUniqueId,
          type: style.type,
          source: layerId,
          'source-layer': layerId,
          layout: {},
          paint: style.paint,
        })

        if (style.type === 'line' && typeof (style.paint['line-opacity']) !== 'undefined') {
          map.setPaintProperty(layerUniqueId, 'line-opacity', 1)
        }

        if (style.type === 'fill') {
          this.mouseEnterFnMap[layerUniqueId] = () => {
            mouseEnterGeometry({ map })
          }

          this.mouseMoveFnMap[layerUniqueId] = (evt) => {
            mouseMoveGeometry({ map, evt, source: layerId, sourceLayer: layerId, currentHoveredFeatureId: this.hoveredFeatureId })
            const newHoveredFeatureId = evt.features?.[0]?.id
            if (newHoveredFeatureId && newHoveredFeatureId !== this.hoveredFeatureId) {
              this.hoveredFeatureId = newHoveredFeatureId
            }
          }

          this.mouseLeaveFnMap[layerUniqueId] = () => {
            mouseLeaveGeometry({ map, source: layerId, sourceLayer: layerId, currentHoveredFeatureId: this.hoveredFeatureId })
            this.hoveredFeatureId = null
          }

          map.on('mouseenter', layerUniqueId, this.mouseEnterFnMap[layerUniqueId])
          map.on('mousemove', layerUniqueId, this.mouseMoveFnMap[layerUniqueId])
          map.on('mouseleave', layerUniqueId, this.mouseLeaveFnMap[layerUniqueId])
        }

        if (clickFn) {
          map.on('click', layerUniqueId, clickFn)
          // Workaround for https://github.com/mapbox/mapbox-gl-draw/issues/1019
          map.on('touchend', layerUniqueId, clickFn)
        }
      })
    },

    removeLayerById (layerId) {
      const map = this.getMap()
      if (!map) { return }

      const { styles, clickFn } = this.options
      styles.forEach((style) => {
        const layerUniqueId = `${layerId}-${style.type}`

        // 1. We first set the opacity to 0
        if (style.type === 'line' && typeof (style.paint['line-opacity']) !== 'undefined') {
          map.setPaintProperty(layerUniqueId, 'line-opacity', 0)
        }
        if (style.type === 'fill') {
          const unHoverFunction = this.mouseLeaveFnMap[layerUniqueId]
          if (unHoverFunction) { unHoverFunction() }
        }

        // 2. Only after finishing the opacity transition do we fully remove the layer
        setTimeout(() => {
          if (!map || !map.isStyleLoaded()) { return }

          if (map.getLayer(layerUniqueId)) {
            map.removeLayer(layerUniqueId)
          }

          // Only remove source when no other layers depend on it
          if (map.getSource(layerId) && !map.getStyle().layers.some(({ source }) => source === layerId)) {
            map.removeSource(layerId)
          }
        }, LAYER_FADE_DURATION_MS)

        if (this.mouseEnterFnMap[layerUniqueId]) {
          map.off('mouseenter', layerUniqueId, this.mouseEnterFnMap[layerUniqueId])
          delete this.mouseEnterFnMap[layerUniqueId]
        }

        if (this.mouseMoveFnMap[layerUniqueId]) {
          map.off('mousemove', layerUniqueId, this.mouseMoveFnMap[layerUniqueId])
          delete this.mouseMoveFnMap[layerUniqueId]
        }

        if (this.mouseLeaveFnMap[layerUniqueId]) {
          map.off('mouseleave', layerUniqueId, this.mouseLeaveFnMap[layerUniqueId])
          delete this.mouseLeaveFnMap[layerUniqueId]
        }

        if (clickFn) {
          map.off('click', layerUniqueId, clickFn)
        }
      })
    },

    removeAllLayers () {
      this.activeLayerIds.forEach(this.removeLayerById)
    },
  },

  mounted () {
    const map = this.getMap()
    const tryInitialize = () => {
      if (map && map.isStyleLoaded()) {
        // We can immediately initialize if we have the map ready
        this.initalize()
        this.isInitialized = true
      } else {
        setTimeout(tryInitialize, 200)
      }
    }
    tryInitialize()
  },

  destroyed () {
    const map = this.getMap()
    map.off('zoomend', this.onZoomEnd)
    this.removeAllLayers()
  },
}
