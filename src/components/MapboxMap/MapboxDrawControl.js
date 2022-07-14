import MapboxDraw from '@mapbox/mapbox-gl-draw'
import '@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css'

export default {
  name: 'v-mapbox-draw-control',

  inject: ['getMap'],

  render: () => null,

  methods: {
    initialize () {
      const map = this.getMap()

      const mbDraw = new MapboxDraw({
        displayControlsDefault: false,
        controls: {
          polygon: true,
          trash: true,
        },
      })

      this.mbDraw = mbDraw
      this.$root.$mbDraw = mbDraw
      map.addControl(mbDraw, 'bottom-right')

      const onChangeFn = () => {
        const { features } = this.mbDraw.getAll()
        this.$store.commit('drawn-geometry/SET_DRAWN_FEATURES', features)
      }

      const onModeChangeFn = ({ mode }) => {
        if (mode === 'simple_select') {
          this.$store.commit('drawn-geometry/SET_IS_DRAWING', false)
        } else {
          this.$store.commit('drawn-geometry/SET_IS_DRAWING', true)
        }
      }

      map
        .on('draw.modechange', onModeChangeFn)
        .on('draw.create', onChangeFn)
        .on('draw.delete', onChangeFn)
        .on('draw.update', onChangeFn)

      this.addPreviousFeatures()
      this.isInitialized = true
    },

    deferredMountedTo () {
      if (!this.isInitialized) {
        this.initialize()
      }
    },

    addPreviousFeatures () {
      const features = this.$store.getters['drawn-geometry/drawnFeatures']
      features.forEach((feature) => {
        this.mbDraw.add(feature)
      })
    },
  },

  mounted () {
    const map = this.getMap()
    // We can immediately initialize if we have the map ready
    if (map && map.isStyleLoaded()) {
      this.initialize()
    }
  },
}
