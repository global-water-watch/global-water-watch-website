<template>
  <v-mapbox
    class="mapbox-map"
    :access-token="mapConfig.token"
    :center="mapConfig.center"
    :zoom="mapConfig.zoom"
    :map-style="mapConfig.style"
    @mb-created="onMapCreated"
  >
    <!-- Controls -->
    <v-mapbox-navigation-control position="bottom-right" />
  </v-mapbox>
</template>

<script>
  const MAP_ZOOM = 3
  const WORLD_CENTER_LONGITUDE = 78.836854
  const WORLD_CENTER_LATITUDE = 22.662175
  const MAP_CENTER = [WORLD_CENTER_LONGITUDE, WORLD_CENTER_LATITUDE]
  const MAPBOX_STYLE = 'mapbox://styles/mapbox/light-v9'
  const RESERVOIRS_LAYER = 'reservoirsv10'

  export default {
    data () {
      return {
        mapConfig: {
          token: this.$config.mapBoxToken,
          center: MAP_CENTER,
          zoom: MAP_ZOOM,
          style: this.$config.mapBoxStyle || MAPBOX_STYLE,
        },
      }
    },

    methods: {
      onMapCreated (map) {
        map.on('click', ({ point }) => {
          const reservoir = map.queryRenderedFeatures(point)
            .filter(({ layer }) => layer.id === RESERVOIRS_LAYER)[0]
          if (reservoir) {
            this.$router.push({ path: `/reservoir/${reservoir?.properties?.fid}` })
          }
          // this.$store.dispatch('geo-data/setSelectedReservoir', reservoir?.properties)
        })
        map.removeControl(map._logoControl)
        map.addControl(map._logoControl, 'top-right')
      },
    },

    // Events
    //
    // Map events: https://docs.mapbox.com/mapbox-gl-js/api/map/#map-events
    // resize, remove
    // Lifecycle events: https://docs.mapbox.com/mapbox-gl-js/api/map/#events-lifecycle
    // load, render, idle, error
    // Data loading events: https://docs.mapbox.com/mapbox-gl-js/api/map/#events-data-loading
    // data, styledata, sourcedata
  }
</script>

<style src="./MapboxMap.scss" lang="scss"></style>
