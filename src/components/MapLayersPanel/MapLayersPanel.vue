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
                  'fill-opacity': 0.2,
                },
              },
              {
                type: 'line',
                paint: {
                  'line-color': '#8fdfef',
                  'line-width': 1,
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
            ],
            style: {
              type: 'fill',
              paint: {
                'fill-color': '#0080ff',
                'fill-opacity': 0.5,
              },
            },
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
        if (!evt.features.length) {
          return
        }
        const [reservoir] = evt.features
        if (reservoir) {
          const { fid } = reservoir.properties
          this.$router.push({ path: `/reservoir/${fid}` })
        }
      },

      onBasinClick (evt) {
        console.log('you clicked a basin', evt)
      },
    },
  }
</script>

<style src="./MapLayersPanel.scss" lang="scss"/>
