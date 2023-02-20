<template>
  <v-skeleton-loader
    v-if="isLoading"
    class="mb-6 detail-map__skeleton-loader"
    type="image"
  />
  <v-mapbox
    v-else-if="mapConfig"
    class="detail-map"
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
  import { bbox, featureCollection } from '@turf/turf'
  import { MAP_CENTER, MAP_ZOOM, MAP_CUSTOM_ATTRIBUTIONS, MAPBOX_STYLE_DARK } from '@/lib/constants'

  let map

  export default {
    props: {
      reservoirs: {
        type: Array,
        required: true,
      },
      geometry: {
        type: Object,
        default: () => {},
      },
      satelliteImageUrl: {
        type: String,
        default: '',
      },
      isLoading: {
        type: Boolean,
        default: false,
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
      onMapCreated (map) {
        map.removeControl(map._logoControl)
        map.addControl(map._logoControl, 'top-right')
      },

      onMapLoaded (event) {
        map = event.target

        this.addTransformedReservoirsToMap(map)
        this.addOtherReservoirsToMap(map)
        if (this.geometry) {
          this.addGeometryToMap(map)
        }
      },

      addTransformedReservoirsToMap (map) {
        this.transformedReservoirs.forEach((reservoir) => {
          const reservoirName = `reservoir-${reservoir.data.id}`

          map.addSource(reservoirName, reservoir)
          map.addLayer({
            id: `${reservoirName}-fill`,
            type: 'fill',
            source: reservoirName,
            layout: {},
            paint: {
              'fill-color': '#0AB6FF',
              'fill-opacity': 0.7,
            },
          })
          map.addLayer({
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
          map.fitBounds(boundingBox, { padding: 40 })
        })
      },

      addOtherReservoirsToMap (map) {
        map.addSource('reservoirsv10', {
          type: 'vector',
          url: 'mapbox://global-water-watch.reservoirs-v10',
          promoteId: 'fid',
        })

        map.addLayer({
          id: 'reservoirsv10-fill',
          type: 'fill',
          source: 'reservoirsv10',
          'source-layer': 'reservoirsv10',
          layout: {},
          paint: {
            'fill-color': '#8fdfef',
            'fill-opacity': 0.4,
          },
        })

        map.addLayer({
          id: 'reservoirsv10-line',
          type: 'line',
          source: 'reservoirsv10',
          'source-layer': 'reservoirsv10',
          layout: {},
          paint: {
            'line-color': '#8fdfef',
            'line-width': 0.8,
          },
        })

        map.on('click', 'reservoirsv10-fill', (evt) => {
          this.onReservoirClick(evt)
        })

        map.on('click', 'reservoirsv10-line', (evt) => {
          this.onReservoirClick(evt)
        })

        if (this.reservoirs.length === 1) {
          map.setFilter('reservoirsv10-fill', ['!=', 'fid', this.reservoirs[0]?.id])
          map.setFilter('reservoirsv10-line', ['!=', 'fid', this.reservoirs[0]?.id])
        } else {
          map.setFilter('reservoirsv10-fill', ['in', 'fid', ''])
          map.setFilter('reservoirsv10-line', ['in', 'fid', ''])
        }
      },

      addGeometryToMap (map) {
        map.addSource('selected-geometry', {
          type: 'geojson',
          data: {
            type: 'Feature',
            geometry: this.geometry,
          },
        })

        map.addLayer({
          id: 'selected-geometry-fill',
          type: 'fill',
          source: 'selected-geometry',
          layout: {},
          paint: {
            'fill-color': '#fbb03b',
            'fill-opacity': 0.1,
          },
        })

        map.addLayer({
          id: 'selected-geometry-outline',
          type: 'line',
          source: 'selected-geometry',
          layout: {},
          paint: {
            'line-color': '#fbb03b',
            'line-width': 2,
            'line-opacity': 0.5,
            'line-dasharray': [2, 1],
          },
        })
      },

      onReservoirClick (evt) {
        const reservoir = evt.features?.[0]
        if (!reservoir) {
          return
        }
        const { fid } = reservoir.properties

        this.$router.push({ path: `/reservoir/${fid}` })
      },
    },
  }
</script>

<style src="./DetailMap.scss" lang="scss"/>
