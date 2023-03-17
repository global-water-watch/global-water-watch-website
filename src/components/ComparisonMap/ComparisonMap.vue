<template>
  <v-skeleton-loader
    v-if="isLoading"
    class="comparison-map__skeleton-loader"
    type="image"
  />
  <div v-else class="comparison-map">
    <div id="comparison-map-container" class="comparison-map__map-container">
      <ComparisonDetailMap
        v-if="reservoirs"
        :reservoirs="reservoirs"
        :date="oldDate"
        class="comparison-map__detail-map"
        @setMap="onSetOldMap"
        @loading="onLoadingSatelliteImage"
      />

      <ComparisonDetailMap
        v-if="reservoirs"
        :reservoirs="reservoirs"
        :date="date"
        class="comparison-map__detail-map"
        @setMap="onSetCurrentMap"
        @loading="onLoadingSatelliteImage"
      />
    </div>

    <div id="comparison-map" class="comparison-map__dates ma-3">
      <ComparisonDatePicker
        :available-dates="timeSeriesDates"
        :date="oldDate"
        class="comparison-map__date-picker"
        @dateChanged="onOldDateChanged"
      />
      <div v-if="isLoadingSatelliteImages" class="comparison-map__loading">
        <div>
          Loading satellite images
          <v-progress-circular indeterminate :size="18" :width="2" class="comparison-map__loading-icon" :aria-hidden="true" />
        </div>
        This feature is not optimized for larger reservoirs.
      </div>
      <ComparisonDatePicker
        :available-dates="timeSeriesDates"
        :date="date"
        class="comparison-map__date-picker comparison-map__date-picker--right"
        @dateChanged="onDateChanged"
      />
    </div>
  </div>
</template>

<script>
  let oldMap, currentMap

  export default {
    props: {
      reservoirs: {
        type: Object,
        required: true,
      },
      timeSeries: {
        type: Array,
        default: () => [],
      },
      isLoading: {
        type: Boolean,
        default: false,
      },
    },

    data () {
      return {
        isLoadingSatelliteImages: false,
        date: new Date(),
        oldDate: new Date(),
      }
    },

    computed: {
      timeSeriesDates () {
        return this.timeSeries[0].data.map(item => new Date(item[0]))
      },
    },

    watch: {
      // isLoading is false while the reservoir information is being queried
      // we need to wait until we have that information to initialize the map
      // the initialization is async because we need to wait for 'mapbox-gl-compare' to be imported
      async isLoading (newValue) {
        if (!newValue) {
          this.initializeDates()
          await this.initializeMap()
        }
      },
    },

    methods: {
      initializeDates () {
        // On mounted, `date` is the last date in the time series
        // `oldDate` is the closest date in the time series one year before `date`
        this.date = this.timeSeriesDates[this.timeSeriesDates.length - 1]
        const oldDate = new Date(this.date.getTime())
        oldDate.setFullYear(this.date.getFullYear() - 1)
        this.oldDate = this.timeSeriesDates[this.getNearestDateIndex(oldDate)]
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
      onLoadingSatelliteImage (isLoading) {
        this.isLoadingSatelliteImages = isLoading
      },
      onOldDateChanged (date) {
        this.oldDate = date
      },
      onDateChanged (date) {
        this.date = date
      },
      getNearestDateIndex (target) {
        let bestDate = this.timeSeriesDates.length

        let bestDiff = Infinity
        let currDiff = 0

        this.timeSeriesDates.forEach((date, index) => {
          currDiff = Math.abs(target - date)
          if (currDiff < bestDiff) {
            bestDate = index
            bestDiff = currDiff
          }
        })

        return bestDate
      },
    },
  }
</script>

<style src="./ComparisonMap.scss" lang="scss"/>
