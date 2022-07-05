<template>
  <div class="map-layers-panel">
    <ul>
      <li
        v-for="layer in reservoirLayers"
        :key="layer.id"
      >
        <v-checkbox
          v-model="activeLayerName"
          :value="layer.name"
          :label="layer.name"
          dense
          hide-details
          @change="toggleReservoirLayer($event, layer)"
        />
      </li>
      <li
        v-for="layer in basinLayers"
        :key="layer.name"
      >
        <v-checkbox
          v-model="activeLayerName"
          :value="layer.name"
          :label="layer.name"
          dense
          hide-details
          @change="toggleZoomableLayer($event, layer)"
        />
      </li>
      <li>
        <v-checkbox
          v-model="activeLayerName"
          :value="'Regions'"
          :label="'Regions'"
          dense
          hide-details
          disabled
        />
      </li>
    </ul>
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
      if (initiallySelectedReservoirLayer) {
        this.$store.commit('reservoir-layers/ADD_LAYER', initiallySelectedReservoirLayer)
      }
      if (initiallySelectedBasinLayer) {
        this.$store.commit('zoomable-layers/ADD_LAYER', initiallySelectedBasinLayer)
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
        const map = evt.target
        const basin = evt.features?.[0]
        if (!basin) {
          return
        }
        const { HYBAS_ID } = basin.properties
        const lala = map.queryRenderedFeatures({
          layers: ['BasinATLAS_v10_lev03-fill'],
          // filter: ['==', 'id', HYBAS_ID.toString()],
        }).filter(({ id }) => id === HYBAS_ID)?.[0]?.geometry
        console.log(lala)
        // this.$router.push({ path: `/basin/${HYBAS_ID}` })
      },
    },
  }
</script>

<style src="./MapLayersPanel.scss" lang="scss"/>
