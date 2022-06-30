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
        clickable: style.clickable,
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
      const { id, source } = this.options

      map.addSource(id, { id, ...source })

      this.renderLayers.forEach((layer) => {
        map.addLayer(layer)
        if (layer.clickable) {
          map.on('click', layer.id, this.clickFn)
        }
      })
    },

    removeLayer () {
      const map = this.getMap()
      if (!map) { return }

      this.renderLayers.forEach((layer) => {
        const layerOnMap = map.getLayer(layer.id)
        const layerSource = layerOnMap.source
        map.removeLayer(layerOnMap)
        if (layerSource && !map.getStyle().layers.some(({ source }) => source === layerSource)) {
          map.removeSource(layerSource)
        }
        if (layer.clickable) {
          map.off('click', layer.id, this.clickFn)
        }
      })
    },

    clickFn (e) {
      if (!e.features.length) {
        return
      }
      const [reservoir] = e.features
      if (reservoir) {
        const { fid } = reservoir.properties
        console.log(fid)
      }
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
