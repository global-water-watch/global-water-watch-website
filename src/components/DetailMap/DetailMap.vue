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
  import { bbox, featureCollection } from '@turf/turf'

  let map

  const MAP_ZOOM = 3
  const WORLD_CENTER_LONGITUDE = 78.836854
  const WORLD_CENTER_LATITUDE = 22.662175
  const MAP_CENTER = [WORLD_CENTER_LONGITUDE, WORLD_CENTER_LATITUDE]
  const MAPBOX_STYLE = 'mapbox://styles/mapbox/dark-v9'

  export default {
    props: {
      reservoirs: {
        type: Array,
        required: true,
      },
      satelliteImageUrl: {
        type: String,
        default: '',
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
      transformedReservoirs () {
        return this.reservoirs.map(reservoir => ({
          type: 'geojson',
          data: {
            ...reservoir,
          },
        }))
      },
    },

    watch: {
      satelliteImageUrl (newURL, oldURL) {
        // check if there is a layer id that contains the words 'reservoir' and 'line'
        const layers = map.getStyle().layers
        const layerId = layers.find(layer => layer.id.includes('reservoir') && layer.id.includes('line')).id

        // check if the new URL is different from the old one
        if (newURL !== oldURL) {
          // remove the old layer
          if (map.getLayer('satellite')) {
            map.removeLayer('satellite')
          }
          // remove the old source
          if (map.getSource('satellite')) {
            map.removeSource('satellite')
          }

          // add satellite source as raster to the map
          map.addSource('satellite', {
            type: 'raster',
            tiles: [newURL],
            tileSize: 256,
          })

          // add satellite layer to the map
          map.addLayer({
            id: 'satellite',
            type: 'raster',
            source: 'satellite',
            paint: {
              'raster-opacity': 1,
            },
          }, layerId)
        }
      },
    },

    methods: {
      addReservoirsToMap (event) {
        map = event.target

        this.transformedReservoirs.forEach((reservoir) => {
          const reservoirName = `reservoir-${reservoir.data.id}`

          map.addSource(reservoirName, reservoir)
          map.addLayer({
            id: `${reservoirName}-fill`,
            type: 'fill',
            source: reservoirName,
            layout: {},
            paint: {
              'fill-color': '#8fdfef',
              'fill-opacity': 0.2,
            },
          })
          map.addLayer({
            id: `${reservoirName}-line`,
            type: 'line',
            source: reservoirName,
            layout: {},
            paint: {
              'line-color': '#8fdfef',
              'line-width': 1,
            },
          })

          const allFeatures = featureCollection(this.transformedReservoirs.map(reservoir => reservoir.data))
          const boundingBox = bbox(allFeatures)
          map.fitBounds(boundingBox, { padding: 40 })
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
