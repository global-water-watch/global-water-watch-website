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
  const MAP_ZOOM = 7
  const NETHERLANDS_CENTER_LATITUDE = 52.1326
  const NETHERLANDS_CENTER_LONGITUDE = 5.2913
  const MAP_CENTER = [NETHERLANDS_CENTER_LONGITUDE, NETHERLANDS_CENTER_LATITUDE]
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
          const reservoirs = map.queryRenderedFeatures(point)
            .filter(({ layer }) => layer.id === RESERVOIRS_LAYER)
            .map((reservoir) => {
              console.log(reservoir)
              return reservoir
            })
            .reduce((accObj, { properties: { name, fid } }) => ({
              ...accObj,
              [name]: fid,
            }), {})
          console.log(reservoirs)
        })
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
