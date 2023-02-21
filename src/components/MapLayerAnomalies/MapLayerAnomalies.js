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
      const { firstLayerDate, lastLayerDate, styles } = this.options

      if (layerDate < firstLayerDate || layerDate > lastLayerDate) {
        console.warn('Layer date is out of range:', layerDate)
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
      })
    },

    removeLayerByDate (layerDate) {
      const map = this.getMap()
      if (!map) { return }

      const layerId = this.layerId(layerDate)
      const { styles } = this.options
      styles.forEach((style) => {
        const layerUniqueId = `${layerId}-${style.type}`

        setTimeout(() => {
          map.removeLayer(layerUniqueId)

          // Only remove source when no other layers depend on it
          if (!map.getStyle().layers.some(({ source }) => source === layerId)) {
            map.removeSource(layerId)
          }
        }, LAYER_FADE_DURATION_MS)
      })
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
