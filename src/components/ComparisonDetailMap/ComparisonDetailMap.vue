<template>
  <v-mapbox
    v-if="mapConfig"
    class="comparison-detail-map"
    :access-token="mapConfig.token"
    :center="mapConfig.center"
    :zoom="mapConfig.zoom"
    :map-style="mapConfig.style"
    :custom-attribution="mapConfig.customAttribution"
    @mb-created="onMapCreated"
    @mb-load="onMapLoaded"
  >
    <!-- Controls -->
    <v-mapbox-navigation-control position="bottom-right" />
  </v-mapbox>
</template>

<script>
  import { bbox } from '@turf/turf'
  import { MAP_CENTER, MAP_ZOOM, MAP_CUSTOM_ATTRIBUTIONS, MAPBOX_STYLE_DARK } from '@/lib/constants'

  export default {
    props: {
      reservoirs: {
        type: Object,
        required: true,
      },
      date: {
        type: Date,
        default: null,
      },
    },

    data () {
      return {
        mapConfig: {
          token: this.$config.mapBoxToken,
          center: MAP_CENTER,
          zoom: MAP_ZOOM,
          style: MAPBOX_STYLE_DARK,
          customAttribution: MAP_CUSTOM_ATTRIBUTIONS,
        },
        map: undefined,
        isLoadingSatelliteImage: false,
      }
    },

    computed: {
      transformedReservoirs () {
        return {
          type: 'geojson',
          data: {
            ...this.reservoirs,
          },
        }
      },
    },

    watch: {
      date () {
        if (this.map) {
          this.addSatelliteImageToMap()
        }
      },

      isLoadingSatelliteImage (newVal) {
        this.$emit('loading', newVal)
      },
    },

    methods: {
      async addSatelliteImageToMap () {
        this.isLoadingSatelliteImage = true
        const geometry = {
          ...this.reservoirs,
          properties: {
            t: Math.floor(this.date.getTime() / 1000),
          },
        }

        const data = await this.$repo.image.getSatelliteImage(geometry)

        const layers = this.map.getStyle().layers
        const layerId = layers.find(layer => layer.id.includes('reservoir') && layer.id.includes('line')).id

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
          tiles: [data.url],
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
        this.isLoadingSatelliteImage = false
      },

      addReservoirsToMap () {
        const reservoir = this.transformedReservoirs
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

        const boundingBox = bbox(this.reservoirs)
        this.map.fitBounds(boundingBox, { padding: 40 })
      },

      onMapCreated (map) {
        map.removeControl(map._logoControl)
        map.addControl(map._logoControl, 'top-right')
        this.$emit('setMap', map)
      },

      onMapLoaded (event) {
        this.map = event.target
        this.addReservoirsToMap()
        this.addSatelliteImageToMap()
      },
    },
  }
</script>

<style src="./ComparisonDetailMap.scss" lang="scss"/>
