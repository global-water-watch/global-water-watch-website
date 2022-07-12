<template>
  <div class="map-layers-panel">
    <v-radio-group
      v-model="activeLayerName"
      :disabled="!mapReady"
    >
      <v-radio
        v-for="layer in layers"
        :key="layer.name"
        :label="layer.name"
        :value="layer.name"
        @change="activateLayer(layer)"
      />
    </v-radio-group>
  </div>
</template>

<script>
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
          Object.freeze({
            name: 'Administrative regions',
            type: 'zoomable',
            promoteId: 'shapeID',
            attribution: '<a href="https://www.geoboundaries.org" target="_blank" rel="noopener noreferrer">geoBoundaries</a>', // this id is used to identify the hover id in the map.
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
        const { source } = basin
        const { HYBAS_ID } = basin.properties
        this.$router.push({ path: `/basin/${source}--${HYBAS_ID}` })
      },

      onRegionLayerClick (evt) {
        const region = evt.features?.[0]
        if (!region) { return }
        const { source } = region
        const { shapeID } = region.properties
        if (!shapeID) { return }

        this.$router.push({ path: `/boundary/${source}--${shapeID}` })
      },
    },
  }
</script>

<style src="./MapLayersPanel.scss" lang="scss"/>
