<template>
  <client-only>
    <mapbox-map />
  </client-only>
</template>

<script>
  export default {
    layout: 'map',
  }
</script>

<style lang="scss">
  // Move social share to not be over Mapbox attribution
  .social-share {
    left: 6px;
    bottom: 34px;
  }
</style>
