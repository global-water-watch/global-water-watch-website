<template>
  <div class="map-layers-panel">
    <v-radio-group
      v-model="activeLayerName"
      :disabled="!mapReady || isDrawing || isTransitioningLayer"
    >
      <v-radio
        v-for="layer in filteredLayers"
        :key="layer.name"
        :label="layer.name"
        :value="layer.name"
        @change="activateLayer(layer)"
      />
    </v-radio-group>

    <v-btn
      small
      :disabled="!mapReady || isDrawing"
      @click="onDrawButtonClick"
    >
      {{ drawButtonText }}
    </v-btn>
  </div>
</template>

<script>
  import qs from 'qs'
  import { LAYER_FADE_DURATION_MS } from '@/lib/constants'

  export default {
    data () {
      return {
        reservoirLayer: Object.freeze({
          name: 'Reservoirs',
          type: 'reservoir',
          id: 'reservoirsv10',
          checked: true,
          source: {
            type: 'vector',
            url: 'mapbox://global-water-watch.reservoirs-v10',
          },
          styles: [
            {
              type: 'fill',
              paint: {
                'fill-color': '#8fdfef',
                'fill-opacity': 0.4,
              },
            },
            {
              type: 'line',
              paint: {
                'line-color': '#8fdfef',
                'line-width': 0.8,
              },
            },
          ],
          clickFn: this.onReservoirClick,
        }),
        layers: [
          Object.freeze({
            name: 'Reservoirs',
            type: 'reservoir',
            id: 'reservoirsv10',
            checked: true,
            source: {
              type: 'vector',
              url: 'mapbox://global-water-watch.reservoirs-v10',
            },
            styles: [
              {
                type: 'fill',
                paint: {
                  'fill-color': '#8fdfef',
                  'fill-opacity': 0.4,
                },
              },
              {
                type: 'line',
                paint: {
                  'line-color': '#8fdfef',
                  'line-width': 0.8,
                },
              },
            ],
            clickFn: this.onReservoirClick,
          }),
          Object.freeze({
            name: 'Basins',
            type: 'zoomable',
            promoteId: 'HYBAS_ID', // this id is used to identify the hover id in the map.
            experimentalFeature: true, // disable this feature when you want to display it default
            layers: [
              {
                id: 'BasinATLAS_v10_lev01',
                zoomLevels: [0, 1, 2],
                source: {
                  type: 'vector',
                  url: 'mapbox://global-water-watch.BasinATLAS_v10_lev01',
                },
              },
              {
                id: 'BasinATLAS_v10_lev02',
                zoomLevels: [3],
                source: {
                  type: 'vector',
                  url: 'mapbox://global-water-watch.BasinATLAS_v10_lev02',
                },
              },
              {
                id: 'BasinATLAS_v10_lev03',
                zoomLevels: [4],
                source: {
                  type: 'vector',
                  url: 'mapbox://global-water-watch.BasinATLAS_v10_lev03',
                },
              },
              {
                id: 'BasinATLAS_v10_lev04',
                zoomLevels: [5],
                source: {
                  type: 'vector',
                  url: 'mapbox://global-water-watch.BasinATLAS_v10_lev04',
                },
              },
              {
                id: 'BasinATLAS_v10_lev05',
                zoomLevels: [6],
                source: {
                  type: 'vector',
                  url: 'mapbox://global-water-watch.BasinATLAS_v10_lev05',
                },
              },
              {
                id: 'BasinATLAS_v10_lev06',
                zoomLevels: [
                  7,
                  // Extra zoom levels so it always stays active
                  8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22,
                ],
                source: {
                  type: 'vector',
                  url: 'mapbox://global-water-watch.BasinATLAS_v10_lev06',
                },
              },
              // Basins above zoom level 6 are currently too expensive to use
              // {
              //   id: 'BasinATLAS_v10_lev10',
              //   zoomLevels: [8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22],
              //   source: {
              //     type: 'vector',
              //     url: 'mapbox://global-water-watch.BasinATLAS_v10_lev10',
              //   },
              // },
            ],
            styles: [
              {
                type: 'fill',
                paint: {
                  'fill-color': '#8fdfef',
                  'fill-opacity': [
                    'case',
                    ['boolean', ['feature-state', 'hover'], false],
                    0.75,
                    0,
                  ],
                  'fill-opacity-transition': {
                    duration: LAYER_FADE_DURATION_MS,
                  },
                },
              },
              {
                type: 'line',
                paint: {
                  'line-color': '#8fdfef',
                  'line-width': 0.8,
                  'line-opacity': 0,
                  'line-opacity-transition': {
                    duration: LAYER_FADE_DURATION_MS,
                  },
                },
              },
            ],
            clickFn: this.onBasinClick,
          }),
          Object.freeze({
            name: 'Administrative regions',
            type: 'zoomable',
            attribution: '<a href="https://www.geoboundaries.org" target="_blank" rel="noopener noreferrer">geoBoundaries</a>', // this id is used to identify the hover id in the map.
            promoteId: 'shapeID', // this id is used to identify the hover id in the map.
            experimentalFeature: true, // disable this feature when you want to display it default
            layers: [
              {
                id: 'geoBoundariesCGAZ_ADM0',
                zoomLevels: [0, 1, 2, 3],
                source: {
                  type: 'vector',
                  url: 'mapbox://global-water-watch.geoBoundariesCGAZ_ADM0',
                },
              },
              {
                id: 'geoBoundariesCGAZ_ADM1',
                zoomLevels: [4, 5, 6, 7],
                source: {
                  type: 'vector',
                  url: 'mapbox://global-water-watch.geoBoundariesCGAZ_ADM1',
                },
              },
              {
                id: 'geoBoundariesCGAZ_ADM2',
                zoomLevels: [8, 9, 10, 11, 12],
                source: {
                  type: 'vector',
                  url: 'mapbox://global-water-watch.geoBoundariesCGAZ_ADM2',
                },
              },
            ],
            styles: [
              {
                type: 'fill',
                paint: {
                  'fill-color': '#d78200',
                  'fill-opacity': [
                    'case',
                    ['boolean', ['feature-state', 'hover'], false],
                    0.75,
                    0,
                  ],
                  'fill-opacity-transition': {
                    duration: LAYER_FADE_DURATION_MS,
                  },
                },
              },
              {
                type: 'line',
                paint: {
                  'line-color': '#d78200',
                  'line-width': 0.8,
                  'line-opacity': 0,
                  'line-opacity-transition': {
                    duration: LAYER_FADE_DURATION_MS,
                  },
                },
              },
            ],
            clickFn: this.onRegionLayerClick,
          }),
        ],
        isTransitioningLayer: false,
      }
    },

    computed: {
      mapReady () {
        return this.$store.getters['ui/mapReady']
      },
      activeLayerName: {
        get () {
          return this.$store.getters['ui/activeLayerName']
        },
        set (layerName) {
          this.$store.commit('ui/SET_ACTIVE_LAYER_NAME', layerName)
        },
      },
      showExperimentalFeatures () {
        return this.$store.getters['ui/showExperimentalFeatures']
      },
      filteredLayers () {
        return this.showExperimentalFeatures ? this.layers : this.layers.filter(layer => !layer.experimentalFeature)
      },
      drawnFeatures () {
        return this.$store.getters['drawn-geometry/drawnFeatures']
      },
      isDrawing () {
        return this.$store.getters['drawn-geometry/isDrawing']
      },
      drawButtonText () {
        if (this.isDrawing) { return 'Drawing geometry' }
        if (this.drawnFeatures.length) { return 'View geometry details' }
        return 'Draw custom geometry'
      },
    },

    watch: {
      // Set layer back to 'Reservoirs' when drawing
      isDrawing (isDrawing) {
        if (isDrawing) {
          const firstLayer = this.reservoirLayer
          this.clearAll()
          this.$store.commit(`${firstLayer.type}-layers/ADD_LAYER`, firstLayer)
        }
      },
    },

    created () {
      this.$store.commit('zoomable-layers/SET_CACHED_GEOMETRY', null)
    },

    mounted () {
      const initiallyReservoirLayer = this.reservoirLayer
      const initiallySelectedLayer = this.layers
        .find(({ name }) => name === this.activeLayerName)

      if (initiallyReservoirLayer && initiallySelectedLayer) {
        this.$store.commit(`${initiallyReservoirLayer.type}-layers/ADD_LAYER`, initiallyReservoirLayer)
        this.$store.commit(`${initiallySelectedLayer.type}-layers/ADD_LAYER`, initiallySelectedLayer)
      }
    },

    methods: {
      clearAll () {
        this.$store.commit('zoomable-layers/REMOVE_ALL_LAYERS')
      },

      clearMbDraw () {
        const { $mbDraw } = this.$root
        if (!$mbDraw) { return }
        $mbDraw.deleteAll()
        // Manually deleting from mb draw does not trigger
        // delete event, so deleting manually too
        this.$store.commit('drawn-geometry/SET_DRAWN_FEATURES', [])
      },

      activateLayer (layer) {
        this.isTransitioningLayer = true
        this.clearAll()
        this.clearMbDraw()
        this.$store.commit(`${layer.type}-layers/ADD_LAYER`, layer)
        setTimeout(() => {
          this.isTransitioningLayer = false
        }, LAYER_FADE_DURATION_MS)
      },

      onReservoirClick (evt) {
        // If we click on a reservoir while drawing, do nothing
        if (this.isDrawing) { return }
        const reservoir = evt.features?.[0]
        if (!reservoir) {
          return
        }
        const { fid } = reservoir.properties
        this.$router.push({ path: `/reservoir/${fid}` })
      },

      onBasinClick (evt) {
        const basin = evt.features?.[0]
        const UID = basin?.properties.HYBAS_ID
        if (!UID) { return }

        const { source, geometry } = basin
        this.$store.commit('zoomable-layers/SET_CACHED_GEOMETRY', Object.freeze({ UID, geometry }))

        const zoom = Math.round(evt.target.getZoom())
        const { lng, lat } = evt.target.getCenter()

        this.$router.push({ path: `/basin/${source}--${zoom}--${lng}--${lat}--${UID}` })
      },

      onRegionLayerClick (evt) {
        const region = evt.features?.[0]
        const UID = region?.properties.shapeID
        if (!UID) { return }

        const { source, geometry } = region
        this.$store.commit('zoomable-layers/SET_CACHED_GEOMETRY', Object.freeze({ UID, geometry }))

        const zoom = Math.round(evt.target.getZoom())
        const { lng, lat } = evt.target.getCenter()

        this.$router.push({ path: `/boundary/${source}--${zoom}--${lng}--${lat}--${UID}` })
      },

      onDrawButtonClick () {
        if (this.drawnFeatures.length) {
          const coordinates = this.drawnFeatures.map(({ geometry }) => geometry.coordinates)
          const geometry = { type: 'MultiPolygon', coordinates }
          const query = qs.stringify(geometry)
          this.$router.push({ path: `/custom-selection/?${query}` })
        } else {
          const { $mbDraw } = this.$root
          if (!$mbDraw) { return }
          $mbDraw.changeMode('draw_polygon')
          // Manually setting the mode of mb draw does not trigger
          // modechange event, so setting it here manually too
          this.$store.commit('drawn-geometry/SET_IS_DRAWING', true)
        }
      },
    },
  }
</script>

<style src="./MapLayersPanel.scss" lang="scss"/>
