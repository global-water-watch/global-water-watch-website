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

  methods: {
    deferredMountedTo () {
      if (!this.isInitialized) {
        this.renderLayer()
        this.isInitialized = true
      }
    },

    renderLayer () {
      console.log('render the reservoirs layer', this.options)
    },
  },

  mounted () {
    const map = this.getMap()
    // We can immediately initialize if we have the map ready
    if (map && map.isStyleLoaded()) {
      this.renderLayer()
      this.isInitialized = true
    }
  },
}
