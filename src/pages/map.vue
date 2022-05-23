<template>
  <div class="map-wrapper">
    <client-only>
      <mapbox-map
        :layers="layers"
        :sources="sources"
      />
      <map-side-bar-new />
    </client-only>
  </div>
</template>

<script>
  export default {
    computed: {
      layers () {
        return this.$store.getters['layers.store/getSelectedLayers']
      },
      sources () {
        return this.$store.getters['sources.store/getSelectedSources']
      },
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
