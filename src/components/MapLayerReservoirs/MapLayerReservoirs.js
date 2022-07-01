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
        this.addLayer()
        this.isInitialized = true
      }
    },

    addLayer () {
      const map = this.getMap()
      const { id, source, clickFn } = this.options

      map.addSource(id, { id, ...source })

      this.renderLayers.forEach((layer) => {
        map.addLayer(layer)
        if (clickFn) {
          map.on('click', layer.id, clickFn)
        }
      })
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
