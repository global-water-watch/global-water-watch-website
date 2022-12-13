<template>
  <div class="comparison-map">
    <div id="comparison-map-container" class="comparison-map__map-container">
      <ComparisonDetailMap
        v-if="reservoirs.length"
        :reservoirs="reservoirs"
        :date="oldDate"
        class="comparison-map__detail-map"
        @setMap="onSetOldMap"
      />

      <ComparisonDetailMap
        v-if="reservoirs.length"
        :reservoirs="reservoirs"
        :date="date"
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
        // Importing mapbox-gl-compare here to avoid https://github.com/mapbox/mapbox-gl-compare/issues/1
        const MapboxCompare = (await import('mapbox-gl-compare')).default
        // eslint-disable-next-line no-new
        new MapboxCompare(oldMap, currentMap, '#comparison-map-container')
      },
    },
  }
</script>

<style src="./ComparisonMap.scss" lang="scss"/>
