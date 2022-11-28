<template>
  <v-mapbox
    v-if="mapConfig"
    class="comparison-detail-map"
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
  import { MAP_CENTER, MAP_ZOOM, MAPBOX_STYLE_DARK } from '@/lib/constants'

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
          style: MAPBOX_STYLE_DARK,
        },
        map: undefined,
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
        const layers = this.map.getStyle().layers
        const layerId = layers.find(layer => layer.id.includes('reservoir') && layer.id.includes('line')).id

        // check if the new URL is different from the old one
        if (newURL !== oldURL) {
          // remove the old layer
          if (this.map.getLayer('satellite')) {
            this.map.removeLayer('satellite')
          }
          // remove the old source
          if (this.map.getSource('satellite')) {
            this.map.removeSource('satellite')
          }

          // add satellite source as raster to the map
          this.map.addSource('satellite', {
            type: 'raster',
            tiles: [newURL],
            tileSize: 256,
          })

          // add satellite layer to the map
          this.map.addLayer({
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
        this.map = event.target

        this.transformedReservoirs.forEach((reservoir) => {
          const reservoirName = `reservoir-${reservoir.data.id}`

          this.map.addSource(reservoirName, reservoir)
          this.map.addLayer({
            id: `${reservoirName}-fill`,
            type: 'fill',
            source: reservoirName,
            layout: {},
            paint: {
              'fill-color': '#0AB6FF',
              'fill-opacity': 0.7,
            },
          })
          this.map.addLayer({
            id: `${reservoirName}-line`,
            type: 'line',
            source: reservoirName,
            layout: {},
            paint: {
              'line-color': '#0AB6FF',
              'line-width': 1,
            },
          })

          const allFeatures = featureCollection(this.transformedReservoirs.map(reservoir => reservoir.data))
          const boundingBox = bbox(allFeatures)
          this.map.fitBounds(boundingBox, { padding: 40 })
        })
      },

      onMapCreated (map) {
        map.removeControl(map._logoControl)
        map.addControl(map._logoControl, 'top-right')
        this.$emit('setMap', map)
      },
    },
  }
</script>

<style src="./ComparisonDetailMap.scss" lang="scss"/>
