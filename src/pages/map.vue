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

  }
</script>

<style lang="scss">
  .map-wrapper {
    position: relative;
    width: 100%;
    height: 100%;
  }
</style>
