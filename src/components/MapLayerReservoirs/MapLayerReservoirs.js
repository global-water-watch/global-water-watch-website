import { MAP_CENTER, MAP_ZOOM } from '@/lib/constants'

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
    zoom: MAP_ZOOM || 0,
    center: MAP_CENTER || [0, 0],
  }),

  computed: {
    renderLayers () {
      const { id, styles } = this.options
      return styles.map(style => ({
        id: `${id}-${style.type}`,
        type: style.type,
        source: id,
        'source-layer': id,
        layout: {},
        paint: style.paint,
      }))
    },
  },

  methods: {
    deferredMountedTo () {
      if (!this.isInitialized) {
        this.initialize()
        this.addLayer()
        this.isInitialized = true
      }
    },

    initialize () {
      const map = this.getMap()
      map.on('zoomend', this.onZoomEnd)
      map.on('moveend', this.onMoveEnd)

      this.onZoomEnd({ target: map })
      this.onMoveEnd({ target: map })
    },

    onZoomEnd ({ target: map }) {
      this.setMapCoordinates(map)
    },

    onMoveEnd ({ target: map }) {
      this.setMapCoordinates(map)
    },

    setMapCoordinates (map) {
      // get zoom and center of the current map when zooming ended
      this.zoom = map.getZoom()
      this.center = map.getCenter().toArray()

      // set the current zoom and center to the store
      this.$store.commit('ui/SET_MAP_COORDINATES', { zoom: this.zoom, center: this.center })
    },

    addLayer () {
      const map = this.getMap()
      const { id, source, promoteId, clickFn } = this.options

      map.addSource(id, { id, promoteId, ...source })

      this.renderLayers.forEach((layer) => {
        map.addLayer(layer)
        if (clickFn) {
          map.on('click', layer.id, clickFn)

          if (layer.type === 'fill') {
            map.on('mouseenter', layer.id, this.mouseEnterFn)
            map.on('mousemove', layer.id, this.mouseMoveFn)
            map.on('mouseleave', layer.id, this.mouseLeaveFn)
          }
        }
      })
    },

    mouseEnterFn () {
      const map = this.getMap()
      map.getCanvas().style.cursor = 'pointer'
    },

    mouseMoveFn (evt) {
      const map = this.getMap()
      const { id } = this.options
      const newHoveredFeatureId = evt.features?.[0]?.id
      if (!newHoveredFeatureId || newHoveredFeatureId === this.hoveredFeatureId) {
        return
      }
      // Reset previous hover state
      if (this.hoveredFeatureId !== null) {
        map.setFeatureState(
          {
            source: id,
            sourceLayer: id,
            id: this.hoveredFeatureId,
          },
          { hover: false },
        )
      }
      // Set new hover state
      this.hoveredFeatureId = newHoveredFeatureId
      map.setFeatureState(
        {
          source: id,
          sourceLayer: id,
          id: this.hoveredFeatureId,
        },
        { hover: true })
    },

    mouseLeaveFn () {
      const map = this.getMap()
      map.getCanvas().style.cursor = ''

      const { id } = this.options
      if (this.hoveredFeatureId !== null) {
        map.setFeatureState(
          {
            source: id,
            sourceLayer: id,
            id: this.hoveredFeatureId,
          },
          { hover: false },
        )
      }
      this.hoveredFeatureId = null
    },

    removeLayer () {
      const map = this.getMap()
      if (!map) { return }
      const { clickFn, id: layerSource } = this.options

      this.renderLayers.forEach((layer) => {
        map.removeLayer(layer.id)
        // Only remove source when no other layers depend on it
        if (!map.getStyle().layers.some(({ source }) => source === layerSource)) {
          map.removeSource(layerSource)
        }
        if (clickFn) {
          map.off('click', layer.id, clickFn)

          if (layer.type === 'fill') {
            map.off('mouseenter', layer.id, this.mouseEnterFn)
            map.on('mousemove', layer.id, this.mouseMoveFn)
            map.off('mouseleave', layer.id, this.mouseLeaveFn)
          }
        }
      })
    },
  },

  mounted () {
    const map = this.getMap()
    // We can immediately initialize if we have the map ready
    if (map && map.isStyleLoaded()) {
      this.addLayer()
      this.isInitialized = true
    }
  },

  destroyed () {
    this.removeLayer()
  },
}
