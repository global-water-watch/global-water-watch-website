<template>
  <div class="mapbox-map">
    <v-mapbox
      ref="vmapbox"
      class="mapbox-map__map"
      :access-token="accessToken"
      :center="center"
      :map-style="mapboxStyle"
      :zoom="zoom"
    >
      <slot />

      <!-- Controls -->
      <v-mapbox-navigation-control position="bottom-right" />
    </v-mapbox>
  </div>
</template>

<script>
  const MAP_ZOOM = 7
  const NETHERLANDS_CENTER_LATITUDE = 52.1326
  const NETHERLANDS_CENTER_LONGITUDE = 5.2913
  const MAP_CENTER = [NETHERLANDS_CENTER_LONGITUDE, NETHERLANDS_CENTER_LATITUDE]
  const MAPBOX_STYLE = 'mapbox://styles/mapbox/light-v9'

  export default {
    props: {
      accessToken: {
        type: String,
        required: true,
      },
      center: {
        type: Array,
        default: () => MAP_CENTER,
      },
      mapboxStyle: {
        type: String,
        default: MAPBOX_STYLE,
      },
      zoom: {
        type: Number,
        default: MAP_ZOOM,
      },
    },
    mounted () {
      const { map } = this.$refs.vmapbox

      // Map events: https://docs.mapbox.com/mapbox-gl-js/api/map/#map-events
      map.on('resize', event => this.$emit('resize', event))
      map.on('remove', event => this.$emit('remove', event))

      // Lifecycle events: https://docs.mapbox.com/mapbox-gl-js/api/map/#events-lifecycle
      map.on('load', event => this.$emit('load', event))
      map.on('render', event => this.$emit('render', event))
      map.on('idle', event => this.$emit('idle', event))
      map.on('error', event => this.$emit('error', event))

      // Data loading events: https://docs.mapbox.com/mapbox-gl-js/api/map/#events-data-loading
      map.on('data', event => this.$emit('data', event))
      map.on('styledata', event => this.$emit('styledata', event))
      map.on('sourcedata', event => this.$emit('sourcedata', event))
    },
  }
</script>

<style src="./MapboxMap.scss" lang="scss"></style>
