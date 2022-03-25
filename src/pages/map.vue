<template>
  <client-only>
    <mapbox-map
      ref="map"
      :access-token="accessToken"
      :mapbox-style="mapBoxStyle"
    />
  </client-only>
</template>

<script>
  export default {
    layout: 'map',
    data () {
      return {
        accessToken: this.$config.mapBoxToken,
        mapBoxStyle: this.$config.mapBoxStyle,
      }
    },
  }
</script>

<style lang="scss">
  .social-share {
    left: 6px;
    bottom: 34px;
  }
</style>
