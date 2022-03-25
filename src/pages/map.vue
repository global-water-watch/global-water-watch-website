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
