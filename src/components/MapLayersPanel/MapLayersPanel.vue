<template>
  <div class="map-layers-panel">
    <v-radio-group
      v-model="activeLayerName"
    >
      <v-radio
        v-for="layer in reservoirLayers"
        :key="layer.name"
        :label="layer.name"
        :value="layer.name"
        @change="toggleReservoirLayer(activeLayerName, layer)"
      />
      <v-radio
        v-for="layer in basinLayers"
        :key="layer.name"
        :label="layer.name"
        :value="layer.name"
        @change="toggleZoomableLayer(activeLayerName, layer)"
      />
      <v-radio
        v-for="layer in administrativeRegionLayers"
        :key="layer.name"
        :label="layer.name"
        :value="layer.name"
        @change="toggleZoomableLayer(activeLayerName, layer)"
      />
    </v-radio-group>
  </div>
</template>

<script>
  export default {
    data () {
      return {
        reservoirLayers: [
          Object.freeze({
            name: 'Reservoirs',
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
        ],
        basinLayers: [
          Object.freeze({
            name: 'Basins',
            promoteId: 'HYBAS_ID', // this id is used to identify the hover id in the map.
            layers: [
              {
                id: 'BasinATLAS_v10_lev03',
                zoomLevels: [1, 2, 3],
                source: {
                  type: 'vector',
                  url: 'mapbox://global-water-watch.BasinATLAS_v10_lev03',
                },
              },
              {
                id: 'BasinATLAS_v10_lev04',
                zoomLevels: [4],
                source: {
                  type: 'vector',
                  url: 'mapbox://global-water-watch.BasinATLAS_v10_lev04',
                },
              },
              {
                id: 'BasinATLAS_v10_lev05',
                zoomLevels: [5, 6, 7, 8],
                source: {
                  type: 'vector',
                  url: 'mapbox://global-water-watch.BasinATLAS_v10_lev05',
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
                },
              },
            ],
            clickFn: this.onBasinClick,
          }),
        ],
        administrativeRegionLayers: [
          Object.freeze({
            name: 'Administrative regions',
            promoteId: 'shapeID', // this id is used to identify the hover id in the map.
            layers: [
              {
                id: 'geoBoundariesCGAZ_ADM0',
                zoomLevels: [0, 1, 2, 3],
                source: {
                  type: 'vector',
                  url: 'mapbox://global-water-watch.geoboundaries-adm0',
                },
              },
              {
                id: 'geoBoundariesCGAZ_ADM1',
                zoomLevels: [4, 5, 6, 7],
                source: {
                  type: 'vector',
                  url: 'mapbox://global-water-watch.geoboundaries-adm1',
                },
              },
              {
                id: 'geoBoundariesCGAZ_ADM2',
                zoomLevels: [8, 9, 10, 11, 12],
                source: {
                  type: 'vector',
                  url: 'mapbox://global-water-watch.geoboundaries-adm2',
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
                },
              },
            ],
            clickFn: this.onRegionLayerClick,
          }),
        ],
      }
    },

    computed: {
      activeLayerName: {
        get () {
          return this.$store.getters['ui/activeLayerName']
        },
        set (layerName) {
          this.$store.commit('ui/SET_ACTIVE_LAYER_NAME', layerName)
        },
      },
    },

    mounted () {
      // @TODO :: Very PoC, much refactor
      const initiallySelectedReservoirLayer = this.reservoirLayers
        .find(({ name }) => name === this.activeLayerName)
      const initiallySelectedBasinLayer = this.basinLayers
        .find(({ name }) => name === this.activeLayerName)
      const initiallySelectedAdministrativeRegionLayer = this.administrativeRegionLayers
        .find(({ name }) => name === this.activeLayerName)

      if (initiallySelectedReservoirLayer) {
        this.$store.commit('reservoir-layers/ADD_LAYER', initiallySelectedReservoirLayer)
      }
      if (initiallySelectedBasinLayer) {
        this.$store.commit('zoomable-layers/ADD_LAYER', initiallySelectedBasinLayer)
      }
      if (initiallySelectedAdministrativeRegionLayer) {
        this.$store.commit('zoomable-layers/ADD_LAYER', initiallySelectedAdministrativeRegionLayer)
      }
    },

    methods: {
      toggleReservoirLayer (showLayer, layer) {
        // Clear all other types of layers
        this.$store.commit('zoomable-layers/REMOVE_ALL_LAYERS')

        if (showLayer) {
          this.$store.commit('reservoir-layers/ADD_LAYER', layer)
        } else {
          this.$store.commit('reservoir-layers/REMOVE_LAYER', layer.id)
        }
      },

      toggleZoomableLayer (showLayer, layer) {
        // Clear all other types of layers
        this.$store.commit('reservoir-layers/REMOVE_ALL_LAYERS')

        const [activeLayer] = this.$store.getters['zoomable-layers/layers']

        if (activeLayer) {
          this.$store.commit('zoomable-layers/REMOVE_LAYER', activeLayer.id)
        }

        if (showLayer) {
          this.$store.commit('zoomable-layers/ADD_LAYER', layer)
        } else {
          this.$store.commit('zoomable-layers/REMOVE_LAYER', layer.id)
        }
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
        const { source } = basin
        const { HYBAS_ID } = basin.properties
        this.$router.push({ path: `/basin/${source}--${HYBAS_ID}` })
      },

      onRegionLayerClick (evt) {
        const region = evt.features?.[0]
        if (!region) {
          return
        }
        const { source } = region
        const { shapeID } = region.properties

        this.$router.push({ path: `/boundaries/${source}--${shapeID}` })
      },
    },
  }
</script>

<style src="./MapLayersPanel.scss" lang="scss"/>
