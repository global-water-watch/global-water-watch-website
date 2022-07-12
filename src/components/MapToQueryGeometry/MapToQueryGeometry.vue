<template>
  <div class="map-hidden">
    <div ref="map" class="map-hidden__child" />
  </div>
</template>

<script>
  import mapboxgl from 'mapbox-gl'

  const AREA_KEY_MAP = {
    basin: 'HYBAS_ID',
    boundary: 'shapeID',
  }

  export default {
    props: {
      id: {
        type: String,
        required: true,
      },
      areaType: {
        type: String,
        required: true,
      },
      layer: {
        type: String,
        required: true,
      },
      zoom: {
        type: Number,
        required: true,
      },
      center: {
        type: Object,
        required: true,
      },
    },

    mounted () {
      mapboxgl.accessToken = this.$config.mapBoxToken

      const map = new mapboxgl.Map({
        container: this.$refs.map,
        zoom: this.zoom,
        center: this.center,
        style: 'mapbox://styles/mapbox/light-v9',
      })

      map.on('load', () => {
        map.addSource(this.layer, {
          id: this.layer,
          type: 'vector',
          url: `mapbox://global-water-watch.${this.layer}`,
        })
        map.addLayer({
          id: this.layer,
          type: 'line',
          source: this.layer,
          'source-layer': this.layer,
          layout: {},
          paint: {
            'line-color': '#8fdfef',
            'line-width': 0.8,
          },
        })
      })

      map.on('idle', () => {
        if (!map.getLayer(this.layer)) { return }
        const AREA_KEY = AREA_KEY_MAP[this.areaType]
        const geometry = map.queryRenderedFeatures({
          layers: [this.layer],
        })
          // Forcing a string here by doing `+ ''`
          .find(({ properties }) => properties?.[AREA_KEY] + '' === this.id)
          ?.geometry
        this.$emit('found-geometry', geometry)
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
