<template>
  <div class="comparison-map">
    <div id="comparison-map-container" class="comparison-map__map-container">
      <ComparisonDetailMap
        v-if="reservoirs.length"
        :reservoirs="reservoirs"
        :satellite-image-url="oldSatelliteImageUrl"
        class="comparison-map__detail-map"
        @setMap="onSetOldMap"
      />

      <ComparisonDetailMap
        v-if="reservoirs.length"
        :reservoirs="reservoirs"
        :satellite-image-url="satelliteImageUrl"
        class="comparison-map__detail-map"
        @setMap="onSetCurrentMap"
      />
    </div>

    <div class="comparison-map__dates">
      <span>{{ parseDate(oldDate) }}</span>
      <span>{{ parseDate(date) }}</span>
    </div>
  </div>
</template>

<script>
  import debounce from 'lodash.debounce'

  const DEBOUNCE_TIME = 1000
  let oldMap, currentMap

  export default {
    props: {
      reservoirs: {
        type: Array,
        required: true,
      },
    },

    data () {
      return {
        showComparison: false,
        oldSatelliteImageUrl: '',
        satelliteImageUrl: '',
      }
    },

    computed: {
      date () {
        return new Date()
      },
      oldDate () {
        const date = new Date()
        date.setFullYear(date.getFullYear() - 1)
        return date
      },
    },

    async mounted () {
      this.loadSatelliteImages()
      await this.initializeMap()
    },

    methods: {
      parseDate (date) {
        const options = { year: 'numeric', month: 'long', day: 'numeric' }
        return date.toLocaleDateString('en-EN', options)
      },
      onSetCurrentMap (map) {
        currentMap = map
      },
      onSetOldMap (map) {
        oldMap = map
      },
      async initializeMap () {
        const MapboxCompare = (await import('mapbox-gl-compare')).default
        // eslint-disable-next-line no-new
        new MapboxCompare(oldMap, currentMap, '#comparison-map-container')
      },
      loadSatelliteImages () {
        debounce(async () => {
          if (this.reservoirs[0]) {
            const geometry = {
              ...this.reservoirs[0],
              properties: {
                t: Math.floor(this.date.getTime() / 1000),
              },
            }

            const oldGeometry = {
              ...this.reservoirs[0],
              properties: {
                t: Math.floor(this.oldDate.getTime() / 1000),
              },
            }

            const data = await this.$repo.image.getSatelliteImage(geometry)
            const oldData = await this.$repo.image.getSatelliteImage(oldGeometry)

            this.satelliteImageUrl = data.url
            this.oldSatelliteImageUrl = oldData.url
          }
        }, DEBOUNCE_TIME)()
      },
    },
  }
</script>

<style src="./ComparisonMap.scss" lang="scss"/>
