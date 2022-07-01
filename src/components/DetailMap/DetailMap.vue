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
        return this.reservoirs.map((reservoir) => {
          return {
            type: 'geojson',
            data: {
              ...reservoir,
            },
          }
        })
      },
    },

    methods: {
      addReservoirsToMap (event) {
        const map = event.target
        console.log('event', event)

        console.log('this.reservoirs', this.reservoirs)

        console.log('this.transformedReservoirs', this.transformedReservoirs)

        if (this.transformedReservoirs.length > 0) {
          this.transformedReservoirs.forEach((reservoir) => {
            console.log('reservoir', reservoir)
            const reservoirName = `reservoir-${reservoir?.data?.id}`

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
          })
        }

        if (this.transformedReservoirs.length > 1) {
          const allFeatures = featureCollection(this.transformedReservoirs.map(reservoir => reservoir.data))
          const boundingBox = bbox(allFeatures)
          map.fitBounds(boundingBox, { padding: 40 })
        } else {
          const boundingBox = bbox(this.transformedReservoirs[0].data)
          map.fitBounds(boundingBox, { padding: 40 })
        }
      },

      onMapCreated (map) {
        map.removeControl(map._logoControl)
        map.addControl(map._logoControl, 'top-right')
      },
    },
  }
</script>

<style src="./DetailMap.scss" lang="scss"/>
