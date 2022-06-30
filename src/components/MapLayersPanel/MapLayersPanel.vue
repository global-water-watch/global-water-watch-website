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
            :label="layer.id"
            @change="toggleReservoirLayer($event, layer)"
          />
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
  export default {
    data: () => ({
      reservoirLayers: [
        Object.freeze({
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
              clickable: true,
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
    }),

    methods: {
      toggleReservoirLayer (showLayer, layer) {
        if (showLayer) {
          this.$store.commit('reservoir-layers/ADD_LAYER', layer)
        } else {
          this.$store.commit('reservoir-layers/REMOVE_LAYER', layer.id)
        }
      },
    },
  }
</script>

<style src="./MapLayersPanel.scss" lang="scss"/>
