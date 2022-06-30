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
                clickFn: this.onReservoirClick,
              },
              {
                type: 'line',
                paint: {
                  'line-color': '#8fdfef',
                  'line-width': 1,
                },
              },
            ],
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
    },
  }
</script>

<style src="./MapLayersPanel.scss" lang="scss"/>
