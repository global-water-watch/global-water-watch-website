<template>
  <div class="map-wrapper">
    <client-only>
      <mapbox-map />
      <map-layers-panel />
    </client-only>
  </div>
</template>

<script>
  export default {
    destroyed () {
      this.$store.commit('zoomable-layers/REMOVE_ALL_LAYERS')
      this.$store.commit('reservoir-layers/REMOVE_ALL_LAYERS')
    },
  }
</script>

<style lang="scss">
  .map-wrapper {
    position: relative;
    width: 100%;
    height: 100%;
  }
</style>
