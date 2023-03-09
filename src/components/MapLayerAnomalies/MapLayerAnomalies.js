import { LAYER_FADE_DURATION_MS } from '@/lib/constants'

export default {
  name: 'v-mapbox-anomalies-layer',

  inject: ['getMap'],

  render: () => null,

  props: {
    options: {
      type: Object,
      default: () => ({}),
    },
  },

  computed: {
    layerDate () {
      return this.$store.getters['anomalies-layers/anomaliesDate']
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
      if (this.layerId) {
        this.addLayerByDate(this.layerDate)
      }
    },

    layerId (layerDate) {
      const [year, month] = layerDate.split('-')
      return `concat_anomaly_${year}_${parseInt(month)}`
    },

    addLayerByDate (layerDate) {
      const map = this.getMap()
      if (!map) { return }
      const { firstLayerDate, lastLayerDate, styles, clickFn } = this.options

      if (layerDate < firstLayerDate || layerDate > lastLayerDate) {
        return
      }

      const layerId = this.layerId(layerDate)

      map.addSource(layerId, {
        id: layerId,
        type: 'vector',
        url: `mapbox://global-water-watch.${layerId}`,
      })

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

        if (style.type === 'circle' && typeof (style.paint['circle-opacity']) !== 'undefined') {
          map.setPaintProperty(layerUniqueId, 'circle-opacity', 1)
        }

        if (clickFn) {
          map.on('click', layerUniqueId, clickFn)
          map.on('mouseenter', layerUniqueId, this.mouseEnterFn)
          map.on('mouseleave', layerUniqueId, this.mouseLeaveFn)
        }
      })
    },

    removeLayerByDate (layerDate) {
      const map = this.getMap()
      if (!map) { return }

      const layerId = this.layerId(layerDate)
      const { styles, clickFn } = this.options
      styles.forEach((style) => {
        const layerUniqueId = `${layerId}-${style.type}`

        // 1. We first set the opacity to 0
        if (style.type === 'circle' && typeof (style.paint['circle-opacity']) !== 'undefined') {
          map.setPaintProperty(layerUniqueId, 'circle-opacity', 0)
        }

        // 2. Only after finishing the opacity transition do we fully remove the layer
        setTimeout(() => {
          map.removeLayer(layerUniqueId)

          // Only remove source when no other layers depend on it
          if (!map.getStyle().layers.some(({ source }) => source === layerId)) {
            map.removeSource(layerId)
          }
        }, LAYER_FADE_DURATION_MS)

        if (clickFn) {
          map.off('click', layerUniqueId, clickFn)
          map.off('mouseenter', layerUniqueId, this.mouseEnterFn)
          map.off('mouseleave', layerUniqueId, this.mouseLeaveFn)
        }
      })
    },

    mouseEnterFn () {
      const map = this.getMap()
      map.getCanvas().style.cursor = 'pointer'
    },

    mouseLeaveFn () {
      const map = this.getMap()
      map.getCanvas().style.cursor = ''
    },

  },

  watch: {
    layerDate (newLayerDate, oldLayerDate) {
      if (newLayerDate !== oldLayerDate) {
        this.removeLayerByDate(oldLayerDate)
        this.addLayerByDate(newLayerDate)
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
    this.removeLayerByDate(this.layerDate)
  },
}
