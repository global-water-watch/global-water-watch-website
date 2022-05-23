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

    <!-- Sources -->
    <v-mapbox-source
      v-for="source in sources"
      :key="source.id"
      :options="source"
    />

    <!--- Layers -->
    <v-mapbox-layer
      v-for="layer in layers"
      :key="layer.id"
      :options="layer"
    />
  </v-mapbox>
</template>

<script>
  import { BASIN_LAYER_05, RESERVOIRS_LAYER } from '@/lib/constants'

  const MAP_ZOOM = 7
  const NETHERLANDS_CENTER_LATITUDE = 52.1326
  const NETHERLANDS_CENTER_LONGITUDE = 5.2913
  const MAP_CENTER = [NETHERLANDS_CENTER_LONGITUDE, NETHERLANDS_CENTER_LATITUDE]
  const MAPBOX_STYLE = 'mapbox://styles/mapbox/light-v9'

  export default {
    props: {
      layers: {
        type: Array,
        required: true,
      },
      sources: {
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
          style: this.$config.mapBoxStyle || MAPBOX_STYLE,
        },
      }
    },

    methods: {
      onMapCreated (map) {
        map.on('click', `${RESERVOIRS_LAYER}-fill`, (e) => {
          map.removeControl(map._logoControl)
          map.addControl(map._logoControl, 'top-right')

          if (!e.features.length) {
            return
          }

          const [reservoir] = e.features

          if (reservoir) {
            const { fid } = reservoir.properties
            this.$router.push({ path: `/reservoir/${fid}` })
          }
          // TODO: check if needed??
          // this.$store.dispatch('geo-data/setSelectedReservoir', reservoir?.properties)
        })

        map.on('click', `${BASIN_LAYER_05}-fill`, (e) => {
          if (!e.features.length) {
            return
          }

          const [basin] = e.features

          if (basin) {
            const { HYBAS_ID } = basin.properties
            console.log(HYBAS_ID)
            // TODO: create basins page for this route
            // this.$router.push({ path: `/basins/${HYBAS_ID}` })
          }
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
