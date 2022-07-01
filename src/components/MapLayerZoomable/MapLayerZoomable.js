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
  }),

  computed: {
    renderLayers () {
      // const { id, styles } = this.options
      // return styles.map(style => ({
      //   id: `${id}-${style.type}`,
      //   type: style.type,
      //   source: id,
      //   'source-layer': id,
      //   layout: {},
      //   paint: style.paint,
      //   clickFn: style.clickFn,
      // }))
    },
  },

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
    },

    addLayer () {
      const map = this.getMap()
      // const { id, source } = this.options

      // map.addSource(id, { id, ...source })

      // this.renderLayers.forEach((layer) => {
      //   map.addLayer(layer)
      //   if (layer.clickFn) {
      //     map.on('click', layer.id, layer.clickFn)
      //   }
      // })
    },

    removeLayer () {
      // const map = this.getMap()
      // if (!map) { return }

      // this.renderLayers.forEach((layer) => {
      //   const layerSource = this.options.id
      //   map.removeLayer(layer.id)
      //   // Only remove source when no other layers depend on it
      //   if (!map.getStyle().layers.some(({ source }) => source === layerSource)) {
      //     map.removeSource(layerSource)
      //   }
      //   if (layer.clickFn) {
      //     map.off('click', layer.id, layer.clickFn)
      //   }
      // })
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
