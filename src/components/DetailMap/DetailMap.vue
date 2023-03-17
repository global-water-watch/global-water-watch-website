<template>
  <v-skeleton-loader
    v-if="isLoading"
    class="mb-6 detail-map__skeleton-loader"
    type="image"
  />
  <div v-else class="detail-map">
    <v-mapbox
      v-if="mapConfig"
      class="detail-map__map"
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

    <div v-if="satelliteVideo" class="detail-map__layers-panel">
      <v-switch
        v-model="showSatelliteImage"
        inset
        label="Satellite image"
        :disabled="!satelliteImageUrl"
      />
      <v-switch
        v-if="satelliteVideo"
        v-model="showSatelliteVideo"
        inset
        label="Satellite video"
      />
      <v-btn
        v-if="satelliteVideo"
        color="blue-grey darken-3"
        class="mr-2"
        :href="satelliteVideo.properties.url"
        target="_blank"
      >
        Satellite video
        <v-icon right>
          mdi-open-in-new
        </v-icon>
      </v-btn>
    </div>
  </div>
</template>

<script>
  import { bbox } from '@turf/turf'
  import { MAP_CENTER, MAP_ZOOM, MAP_CUSTOM_ATTRIBUTIONS, MAPBOX_STYLE_DARK } from '@/lib/constants'
  import { hoveredStyle, mouseEnterGeometry, mouseLeaveGeometry, mouseMoveGeometry } from '@/lib/map-hover-helpers'

  let map

  export default {
    props: {
      reservoirs: {
        type: Object,
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
      satelliteVideo: {
        type: Object,
        default: null,
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
        showSatelliteImage: false,
        showSatelliteVideo: true,
        hoveredFeatureId: null,
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
      latestSelectedReservoirCoordinates () {
        return this.$store.getters['reservoir/latestSelectedReservoirCoordinates']
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
            layout: {
              visibility: 'visible',
            },
          }, layerId)
        }

        // if this is the first satellite image to be loaded, show it by default
        if (oldURL === '') {
          this.showSatelliteImage = true
        }
      },
      showSatelliteImage (newVal) {
        if (map.getLayer('satellite')) {
          map.setLayoutProperty('satellite', 'visibility', newVal ? 'visible' : 'none')
        }
      },
      showSatelliteVideo (newVal) {
        if (map.getLayer('video')) {
          map.setLayoutProperty('video', 'visibility', newVal ? 'visible' : 'none')
        }
      },
    },

    methods: {
      onMapCreated (map) {
        map.removeControl(map._logoControl)
        map.addControl(map._logoControl, 'top-right')

        this.mapConfig = {
          ...this.mapConfig,
          zoom: this.latestSelectedReservoirCoordinates.zoom,
          center: this.latestSelectedReservoirCoordinates.center,
        }
      },

      onMapLoaded (event) {
        map = event.target

        this.addTransformedReservoirsToMap(map)
        this.addOtherReservoirsToMap(map)
        if (this.geometry) {
          this.addGeometryToMap(map)
        }
        this.setBoundingBox(map)
        if (this.satelliteVideo) { this.addSatelliteVideoToMap(map) }
      },

      addTransformedReservoirsToMap (map) {
        const reservoir = this.transformedReservoirs
        const reservoirName = `reservoir-${reservoir.data.id}`

        map.addSource(reservoirName, reservoir)
        map.addLayer({
          id: `${reservoirName}-fill`,
          type: 'fill',
          source: reservoirName,
          layout: {},
          paint: {
            'fill-color': '#0AB6FF',
            ...hoveredStyle(0.7),
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

        map.on('click', `${reservoirName}-fill`, this.onReservoirClick)
        map.on('mouseenter', `${reservoirName}-fill`, () => {
          mouseEnterGeometry({ map })
        })
        map.on('mousemove', `${reservoirName}-fill`, (evt) => {
          mouseMoveGeometry({ map, evt, source: reservoirName, currentHoveredFeatureId: this.hoveredFeatureId })
          const newHoveredFeatureId = evt.features?.[0]?.id
          if (newHoveredFeatureId && newHoveredFeatureId !== this.hoveredFeatureId) {
            this.hoveredFeatureId = newHoveredFeatureId
          }
        })
        map.on('mouseleave', `${reservoirName}-fill`, () => {
          mouseLeaveGeometry({ map, source: reservoirName, currentHoveredFeatureId: this.hoveredFeatureId })
          this.hoveredFeatureId = null
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
            ...hoveredStyle(0.4),
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

        map.on('click', 'reservoirsv10-fill', this.onReservoirClick)
        map.on('click', 'reservoirsv10-line', this.onReservoirClick)

        map.on('mouseenter', 'reservoirsv10-fill', () => {
          mouseEnterGeometry({ map })
        })
        map.on('mousemove', 'reservoirsv10-fill', (evt) => {
          mouseMoveGeometry({ map, evt, source: 'reservoirsv10', sourceLayer: 'reservoirsv10', currentHoveredFeatureId: this.hoveredFeatureId })
          const newHoveredFeatureId = evt.features?.[0]?.id
          if (newHoveredFeatureId && newHoveredFeatureId !== this.hoveredFeatureId) {
            this.hoveredFeatureId = newHoveredFeatureId
          }
        })
        map.on('mouseleave', 'reservoirsv10-fill', () => {
          mouseLeaveGeometry({ map, source: 'reservoirsv10', sourceLayer: 'reservoirsv10', currentHoveredFeatureId: this.hoveredFeatureId })
          this.hoveredFeatureId = null
        })

        if (this.reservoirs.id) {
          map.setFilter('reservoirsv10-fill', ['!=', 'fid', this.reservoirs.id])
          map.setFilter('reservoirsv10-line', ['!=', 'fid', this.reservoirs.id])
        } else {
          map.setFilter('reservoirsv10-fill', ['in', 'fid', ''])
          map.setFilter('reservoirsv10-line', ['in', 'fid', ''])
        }
      },

      addSatelliteVideoToMap (map) {
        // add satellite source as raster to the map
        map.addSource('video', {
          type: 'video',
          urls: [this.satelliteVideo.properties.url],
          coordinates: this.satelliteVideo.geometry.coordinates[0].slice(0, 4),
        })

        // add satellite layer to the map
        map.addLayer({
          id: 'video',
          type: 'raster',
          source: 'video',
          paint: {
            'raster-opacity': 0.5,
          },
          layout: {
            visibility: 'visible',
          },
        })
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

      setBoundingBox (map) {
        const isEmptyFeatureCollection = this.reservoirs.type === 'FeatureCollection' && this.reservoirs.features.length === 0
        const boundingBox = bbox(isEmptyFeatureCollection ? this.geometry : this.reservoirs)

        map.fitBounds(boundingBox, { padding: 40 })
      },

      setLatestSelectedReservoirCoordinates (map) {
        // get zoom and center of the current map when zooming ended
        this.zoom = map.getZoom()
        this.center = map.getCenter().toArray()

        // set the current zoom and center to the store
        this.$store.commit('reservoir/SET_LATEST_SELECTED_RESERVOIR_COORDINATES', { zoom: this.zoom, center: this.center })
      },

      onReservoirClick (evt) {
        const reservoir = evt.features?.[0]
        if (!reservoir) {
          return
        }
        const fid = reservoir.properties?.fid || reservoir.id

        this.setLatestSelectedReservoirCoordinates(map)
        this.$router.push({ path: `/reservoir/${fid}` })
      },
    },
  }
</script>

<style src="./DetailMap.scss" lang="scss"/>
