<template>
  <v-mapbox
    v-if="mapConfig"
    class="detail-map"
    :access-token="mapConfig.token"
    :center="mapConfig.center"
    :zoom="mapConfig.zoom"
    :map-style="mapConfig.style"
    @mb-created="onMapCreated"
    @mb-load="addReservoirsToMap"
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

    methods: {
      addReservoirsToMap (event) {
        const map = event.target
        this.reservoirs.forEach((reservoir) => {
          const reservoirName = `reservoir-${reservoir.reservoir_id}`

          map.addSource(reservoirName, {
            type: 'geojson',
            data: {
              type: 'Feature',
              properties: {},
              geometry: {
                type: 'MultiPolygon',
                coordinates: reservoir.geom,
              },
            },
          })
          map.addLayer({
            id: `${reservoirName}-fill`,
            type: 'fill',
            source: reservoirName,
            layout: {},
            paint: {
              'fill-color': '#0080ff',
              'fill-opacity': 0.5,
            },
          })
          map.addLayer({
            id: `${reservoirName}-line`,
            type: 'line',
            source: reservoirName,
            layout: {},
            paint: {
              'line-color': '#000',
              'line-width': 3,
            },
          })
        })
      },

      onMapCreated (map) {
        map.removeControl(map._logoControl)
        map.addControl(map._logoControl, 'top-right')
      },
    },
  }
</script>

<style src="./DetailMap.scss" lang="scss"/>
