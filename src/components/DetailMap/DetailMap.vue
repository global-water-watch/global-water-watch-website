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
  import { bbox } from '@turf/turf'

  const MAP_ZOOM = 3
  const WORLD_CENTER_LONGITUDE = 78.836854
  const WORLD_CENTER_LATITUDE = 22.662175
  const MAP_CENTER = [WORLD_CENTER_LONGITUDE, WORLD_CENTER_LATITUDE]
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
          const geoJson = {
            type: 'geojson',
            data: {
              type: 'Feature',
              properties: {},
              geometry: {
                type: 'MultiPolygon',
                coordinates: reservoir.geom,
              },
            },
          }

          if (geoJson?.data?.geometry?.coordinates) {
            const boundingBox = bbox(geoJson.data)
            map.fitBounds(boundingBox, { padding: 40 })
          }

          map.addSource(reservoirName, geoJson)
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
