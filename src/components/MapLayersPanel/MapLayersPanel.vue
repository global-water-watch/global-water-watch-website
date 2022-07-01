<template>
  <div class="map-layers-panel">
    <h3>Layers</h3>
    <div class="map-layers-panel__content">
      <ul>
        <li
          v-for="layer in reservoirLayers"
          :key="layer.id"
        >
          <v-checkbox
            :label="layer.name"
            @change="toggleReservoirLayer($event, layer)"
          />
        </li>
        <li
          v-for="layer in basinLayers"
          :key="layer.name"
        >
          <v-checkbox
            :label="layer.name"
            @change="toggleZoomableLayer($event, layer)"
          />
        </li>
      </ul>
    </div>
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
                id: 'BasinATLAS_v10_lev05',
                zoomLevels: [5],
                source: {
                  type: 'vector',
                  url: 'mapbox://global-water-watch.BasinATLAS_v10_lev05',
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
            ],
            styles: [
              {
                type: 'fill',
                paint: {
                  'fill-color': '#0080ff',
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
                  'line-color': '#0080ff',
                  'line-width': 0.8,
                },
              },
            ],
            clickFn: this.onBasinClick,
          }),
        ],
      }
    },

    methods: {
      toggleReservoirLayer (showLayer, layer) {
        if (showLayer) {
          this.$store.commit('reservoir-layers/ADD_LAYER', layer)
        } else {
          this.$store.commit('reservoir-layers/REMOVE_LAYER', layer.id)
        }
      },

      toggleZoomableLayer (showLayer, layer) {
        if (showLayer) {
          this.$store.commit('zoomable-layers/ADD_LAYER', layer)
        } else {
          this.$store.commit('zoomable-layers/REMOVE_LAYER', layer.id)
        }
      },

      onReservoirClick (evt) {
        const reservoir = evt.features?.[0]
        if (reservoir) {
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
        const { HYBAS_ID } = basin.properties
        // TODO :: Handle basins properly
        console.log(HYBAS_ID)
      },
    },
  }
</script>

<style src="./MapLayersPanel.scss" lang="scss"/>
