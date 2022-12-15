<template>
  <div class="comparison-map">
    <div id="comparison-map-container" class="comparison-map__map-container">
      <ComparisonDetailMap
        v-if="reservoirs.length"
        :reservoirs="reservoirs"
        :date="oldDate"
        class="comparison-map__detail-map"
        @setMap="onSetOldMap"
        @loading="onLoadingSatelliteImage"
      />

      <ComparisonDetailMap
        v-if="reservoirs.length"
        :reservoirs="reservoirs"
        :date="date"
        class="comparison-map__detail-map"
        @setMap="onSetCurrentMap"
        @loading="onLoadingSatelliteImage"
      />
    </div>

    <div class="comparison-map__dates">
      <div>
        <v-btn
          icon
          color="primary"
          :disabled="!previousOldDate || isLoadingSatelliteImages"
          :title="parseDate(previousOldDate)"
          @click="() => oldDateIndex = previousOldDateIndex"
        >
          <v-icon>mdi-chevron-left</v-icon>
        </v-btn>
        <span>{{ parseDate(oldDate) }}</span>
        <v-btn
          icon
          color="primary"
          :disabled="!nextOldDate || isLoadingSatelliteImages"
          :title="parseDate(nextOldDate)"
          @click="() => oldDateIndex = nextOldDateIndex"
        >
          <v-icon>mdi-chevron-right</v-icon>
        </v-btn>
      </div>
      <div class="comparison-map__loading">
        <div>
          Loading satellite images
          <v-progress-circular indeterminate :size="18" :width="2" class="comparison-map__loading-icon" :aria-hidden="true" />
        </div>
        This feature is not optimized for larger reservoirs.
      </div>
      <div>
        <v-btn
          icon
          color="primary"
          :disabled="!previousDate || isLoadingSatelliteImages"
          :title="parseDate(previousDate)"
          @click="() => dateIndex = previousDateIndex"
        >
          <v-icon>mdi-chevron-left</v-icon>
        </v-btn>
        <span>{{ parseDate(date) }}</span>
        <v-btn
          icon
          color="primary"
          :disabled="!nextDate || isLoadingSatelliteImages"
          :title="parseDate(nextDate)"
          @click="() => dateIndex = nextDateIndex"
        >
          <v-icon>mdi-chevron-right</v-icon>
        </v-btn>
      </div>
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
      timeSeries: {
        type: Array,
        default: () => [],
      },
    },

    data () {
      return {
        dateIndex: -1,
        oldDateIndex: -1,
        isLoadingSatelliteImages: false,
      }
    },

    computed: {
      date () {
        return this.timeSeriesDates[this.dateIndex]
      },
      oldDate () {
        return this.timeSeriesDates[this.oldDateIndex]
      },
      timeSeriesDates () {
        return this.timeSeries.map(item => new Date(item[0]))
      },
      previousDateIndex () {
        return this.dateIndex - 1
      },
      nextDateIndex () {
        return this.dateIndex + 1
      },
      previousDate () {
        return this.timeSeriesDates[this.previousDateIndex]
      },
      nextDate () {
        return this.timeSeriesDates[this.nextDateIndex]
      },
      previousOldDateIndex () {
        return this.oldDateIndex - 1
      },
      nextOldDateIndex () {
        return this.oldDateIndex + 1
      },
      previousOldDate () {
        return this.timeSeriesDates[this.previousOldDateIndex]
      },
      nextOldDate () {
        return this.timeSeriesDates[this.nextOldDateIndex]
      },
    },

    // On mounted, `date` is the last date in the time series
    // `oldDate` is the closest date in the time series one year before `date`
    async mounted () {
      const date = this.timeSeriesDates[this.timeSeriesDates.length - 1]
      const oldDate = new Date(date.getTime())
      oldDate.setFullYear(date.getFullYear() - 1)
      this.dateIndex = this.timeSeriesDates.length - 1
      this.oldDateIndex = this.getNearestDateIndex(oldDate)

      await this.initializeMap()
    },

    methods: {
      parseDate (date) {
        const options = { year: 'numeric', month: 'long', day: 'numeric' }
        return date?.toLocaleDateString('en-EN', options)
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
