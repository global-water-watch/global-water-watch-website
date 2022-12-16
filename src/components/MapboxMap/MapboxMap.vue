<template>
  <v-mapbox
    class="mapbox-map"
    :access-token="mapConfig.token"
    :center="mapConfig.center"
    :zoom="mapConfig.zoom"
    :map-style="mapConfig.style"
    :custom-attribution="mapConfig.customAttribution"
    @mb-created="onMapCreated"
    @mb-load="onMapLoaded"
  >
    <!-- Geocoder -->
    <v-mapbox-geocoder />
    <!-- Controls -->
    <v-mapbox-navigation-control position="bottom-right" />

    <map-layer-reservoirs
      v-for="layer in reservoirLayers"
      :key="layer.id"
      :options="layer"
    />

    <map-layer-zoomable
      v-for="layer in zoomableLayers"
      :key="layer.name"
      :options="layer"
    />

    <mapbox-draw-control v-if="showExperimentalFeatures" />
  </v-mapbox>
</template>

<script>
  import { MAP_ZOOM, MAP_CENTER, MAP_CUSTOM_ATTRIBUTIONS, MAPBOX_STYLE_LIGHT } from '@/lib/constants'

  export default {
    data () {
      return {
        mapConfig: {
          token: this.$config.mapBoxToken,
          center: MAP_CENTER,
          zoom: MAP_ZOOM,
          style: this.$config.mapBoxStyle || MAPBOX_STYLE_LIGHT,
          customAttribution: MAP_CUSTOM_ATTRIBUTIONS,
        },
      }
    },

    computed: {
      showExperimentalFeatures () {
        return this.$store.getters['ui/showExperimentalFeatures']
      },
      mapCoordinates () {
        return this.$store.getters['ui/mapCoordinates']
      },
      reservoirLayers () {
        return this.$store.getters['reservoir-layers/layers']
      },
      zoomableLayers () {
        return this.$store.getters['zoomable-layers/layers']
      },
    },

    methods: {
      onMapCreated (map) {
        map.removeControl(map._logoControl)
        map.addControl(map._logoControl, 'top-right')

        this.mapConfig = {
          ...this.mapConfig,
          zoom: this.mapCoordinates.zoom,
          center: this.mapCoordinates.center,
        }
      },

      onMapLoaded () {
        this.$store.commit('ui/SET_MAP_READY', true)
      },
    },

    // Events
    //
    // Map events: https://docs.mapbox.com/mapbox-gl-js/api/map/#map-events
    // resize, remove
    // Lifecycle events: https://docs.mapbox.com/mapbox-gl-js/api/map/#events-lifecycle
    // load, render, idle, error
    // Data loading events: https://docs.mapbox.com/mapbox-gl-js/api/map/#events-data-loading
    // data, styledata, sourcedata
  }
</script>

<style src="./MapboxMap.scss" lang="scss"></style>
