<template>
  <div class="map-layers-panel">
    <h3>Layers</h3>
    <div class="map-layers-panel__content">
      Lalala
    </div>
  </div>
</template>

<script>
  export default {
    created () {
      const layer = 'poep'
      this.$store.commit('reservoir-layers/ADD_LAYER', layer)
    },
  }

//   export default function buildGeojsonLayer({ id, data, type, paint={}, layout={} }) {
//   return {
//     id,
//     type,
//     source: {
//       tolerance: 3.5,
//       type: 'geojson',
//       data
//     },
//     layout,
//     paint
//   };
// }

</script>

<style src="./MapLayersPanel.scss" lang="scss"/>
