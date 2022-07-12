<template>
  <div ref="map" style="display: none" />
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
    },

    mounted () {
      mapboxgl.accessToken = this.$config.mapBoxToken

      const map = new mapboxgl.Map({
        container: this.$refs.map,
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
          type: 'fill',
          source: this.layer,
          'source-layer': this.layer,
          layout: {},
          paint: {
            'fill-color': '#8fdfef',
            'fill-opacity': 0.4,
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
