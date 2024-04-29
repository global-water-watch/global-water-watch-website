<template>
  <div class="map-hidden">
    <div ref="map" class="map-hidden__child" />
  </div>
</template>

<script>
  import mapboxgl from 'mapbox-gl'
  import { mergeFeatures } from '~/lib/geojson-helpers'

  const AREA_KEY_MAP = {
    basin: 'HYBAS_ID',
    boundary: 'shapeID',
  }

  export default {
    props: {
      // id: {
      //   type: String,
      //   required: true,
      // },
      areaType: {
        type: String,
        required: true,
      },
      mapboxQueryData: {
        type: Object,
        required: true,
      },
      // layer: {
      //   type: String,
      //   required: true,
      // },
      // zoom: {
      //   type: Number,
      //   required: true,
      // },
      // center: {
      //   type: Object,
      //   required: true,
      // },
    },

    mounted () {
      const { layer, zoom, center } = this.mapboxQueryData
      mapboxgl.accessToken = this.$config.mapBoxToken

      const map = new mapboxgl.Map({
        container: this.$refs.map,
        zoom,
        center,
        style: 'mapbox://styles/mapbox/light-v9',
      })

      map.on('load', () => {
        map.addSource(layer, {
          id: layer,
          type: 'vector',
          url: `mapbox://global-water-watch.${layer}`,
        })
        map.addLayer({
          id: layer,
          type: 'line',
          source: layer,
          'source-layer': layer,
          layout: {},
          paint: {
            'line-color': 'red',
            'line-width': 1.4,
          },
        })
      })

      map.on('idle', () => {
        const { layer, id } = this.mapboxQueryData
        if (!map.getLayer(layer)) { return }
        const AREA_KEY = String(AREA_KEY_MAP[this.areaType])

        const features = map.querySourceFeatures(layer, {
          sourceLayer: layer,
          filter: ['==', ['string', ['get', AREA_KEY]], id],
        })

        this.$emit('found-geometry', mergeFeatures(features).geometry)
      })
    },
  }
</script>

<style lang="scss">
.map-hidden {
  height: 0;
  overflow: hidden;

  &__child {
    width: 100%;
    padding-bottom: 100%;
  }
}
</style>
