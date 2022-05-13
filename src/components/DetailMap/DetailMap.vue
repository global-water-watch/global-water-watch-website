<template>
  <v-mapbox
    v-if="mapConfig"
    class="detail-map"
    :access-token="mapConfig.token"
    :center="mapConfig.center"
    :zoom="mapConfig.zoom"
    :map-style="mapConfig.style"
    @mb-created="onMapCreated"
  >
    <!-- Controls -->
    <v-mapbox-navigation-control position="bottom-right" />
    <v-mapbox-layer v-for="layer in layers" :key="layer.reservoir_id" :options="layer" />
  </v-mapbox>
</template>

<script>
  const MAP_ZOOM = 7
  const NETHERLANDS_CENTER_LATITUDE = 52.1326
  const NETHERLANDS_CENTER_LONGITUDE = 5.2913
  const MAP_CENTER = [NETHERLANDS_CENTER_LONGITUDE, NETHERLANDS_CENTER_LATITUDE]
  const MAPBOX_STYLE = 'mapbox://styles/mapbox/light-v9'

  export default {
    props: {
      reservoirs: {
        type: Array,
        required: true,
      },
    },

    data () {
      return {
        mapConfig: {
          token: this.$config.mapBoxToken,
          center: MAP_CENTER,
          zoom: MAP_ZOOM,
          style: MAPBOX_STYLE,
        },
      }
    },

    computed: {
      layers () {
        return this.reservoirs.map(reservoir => ({
          id: reservoir.reservoir_id,
          type: 'fill',
          properties: {},
          geometry: {
            type: 'MultiPolygon',
            coordinates: reservoir.geom,
          },
        }))
      },
    },

    methods: {
      onMapCreated (map) {
        console.log(this.reservoirs)
        map.removeControl(map._logoControl)
        map.addControl(map._logoControl, 'top-right')
      },
    },
  }
</script>

<style src="./DetailMap.scss" lang="scss"/>
