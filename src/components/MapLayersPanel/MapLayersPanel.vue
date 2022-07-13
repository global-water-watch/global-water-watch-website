<template>
  <div class="map-layers-panel">
    <v-radio-group
      v-model="activeLayerName"
      :disabled="!mapReady"
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
      v-if="showExperimentalFeatures"
      small
      @click="onDrawClick"
    >
      {{ drawnFeatures.length ? 'View geometry details' : 'Draw custom geometry' }}
    </v-btn>
  </div>
</template>

<script>
  import qs from 'qs'

  export default {
    data () {
      return {
        layers: [
          Object.freeze({
            name: 'Reservoirs',
            type: 'reservoir',
            id: 'reservoirsv10',
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
                zoomLevels: [7],
                source: {
                  type: 'vector',
                  url: 'mapbox://global-water-watch.BasinATLAS_v10_lev06',
                },
              },
              {
                id: 'BasinATLAS_v10_lev10',
                zoomLevels: [8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22],
                source: {
                  type: 'vector',
                  url: 'mapbox://global-water-watch.BasinATLAS_v10_lev10',
                },
              },
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
                },
              },
              {
                type: 'line',
                paint: {
                  'line-color': '#8fdfef',
                  'line-width': 0.8,
                  'line-opacity': 0,
                  'line-opacity-transition': {
                    duration: 2000,
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
                },
              },
              {
                type: 'line',
                paint: {
                  'line-color': '#d78200',
                  'line-width': 0.8,
                  'line-opacity': 0,
                  'line-opacity-transition': {
                    duration: 2000,
                  },
                },
              },
            ],
            clickFn: this.onRegionLayerClick,
          }),
        ],
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
    },

    mounted () {
      const initiallySelectedLayer = this.layers
        .find(({ name }) => name === this.activeLayerName)
      if (initiallySelectedLayer) {
        this.$store.commit(`${initiallySelectedLayer.type}-layers/ADD_LAYER`, initiallySelectedLayer)
      }
    },

    methods: {
      clearAll () {
        this.$store.commit('zoomable-layers/REMOVE_ALL_LAYERS')
        this.$store.commit('reservoir-layers/REMOVE_ALL_LAYERS')
      },

      activateLayer (layer) {
        this.clearAll()
        this.$store.commit(`${layer.type}-layers/ADD_LAYER`, layer)
      },

      onReservoirClick (evt) {
        const reservoir = evt.features?.[0]
        if (!reservoir) {
          return
        }
        const { fid } = reservoir.properties
        this.$router.push({ path: `/reservoir/${fid}` })
      },

      onBasinClick (evt) {
        const basin = evt.features?.[0]
        if (!basin) {
          return
        }
        const zoom = Math.round(evt.target.getZoom())
        const { lng, lat } = evt.target.getCenter()
        const { source } = basin
        const { HYBAS_ID } = basin.properties
        this.$router.push({ path: `/basin/${source}--${zoom}--${lng}--${lat}--${HYBAS_ID}` })
      },

      onRegionLayerClick (evt) {
        const region = evt.features?.[0]
        if (!region) { return }
        const { source } = region
        const { shapeID } = region.properties
        if (!shapeID) { return }
        const zoom = Math.round(evt.target.getZoom())
        const { lng, lat } = evt.target.getCenter()

        this.$router.push({ path: `/boundary/${source}--${zoom}--${lng}--${lat}--${shapeID}` })
      },

      onDrawClick () {
        if (this.drawnFeatures.length) {
          const coordinates = this.drawnFeatures.map(({ geometry }) => geometry.coordinates)
          const geometry = { type: 'MultiPolygon', coordinates }
          const query = qs.stringify(geometry)
          this.$router.push({ path: `/custom-selection/?${query}` })
        }
      },
    },
  }
</script>

<style src="./MapLayersPanel.scss" lang="scss"/>
