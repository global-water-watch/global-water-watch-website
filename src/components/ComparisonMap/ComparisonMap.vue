<template>
  <v-skeleton-loader
    v-if="isLoading"
    class="comparison-map__skeleton-loader"
    type="image"
  />
  <div v-else class="comparison-map">
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

    <div class="comparison-map__dates ma-3">
      <div>
        <v-menu
          transition="scale-transition"
          offset-y
          max-width="290px"
          min-width="auto"
        >
          <template #activator="{ on, attrs }">
            <v-text-field
              v-model="formattedOldDate"
              readonly
              v-bind="attrs"
              v-on="on"
            />
          </template>
          <v-date-picker
            v-model="isoOldDate"
            :allowed-dates="allowedDates"
            no-title
            scrollable
          />
        </v-menu>
      </div>
      <div v-if="isLoadingSatelliteImages" class="comparison-map__loading">
        <div>
          Loading satellite images
          <v-progress-circular indeterminate :size="18" :width="2" class="comparison-map__loading-icon" :aria-hidden="true" />
        </div>
        This feature is not optimized for larger reservoirs.
      </div>
      <div>
        <v-menu
          :close-on-content-click="true"
          transition="scale-transition"
          location="bottom center"
          origin="overlap"
          offset-y
          max-width="290px"
          min-width="auto"
        >
          <template #activator="{ on, attrs }">
            <v-text-field
              v-model="formattedDate"
              readonly
              v-bind="attrs"
              v-on="on"
            />
          </template>
          <v-date-picker
            v-model="isoDate"
            :allowed-dates="allowedDates"
            no-title
            scrollable
          />
        </v-menu>
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
      isLoading: {
        type: Boolean,
        default: false,
      },
    },

    data () {
      return {
        isoDate: (new Date()).toISOString().substring(0, 10),
        isoOldDate: (new Date()).toISOString().substring(0, 10),
        isLoadingSatelliteImages: false,
      }
    },

    computed: {
      timeSeriesDates () {
        return this.timeSeries[0].data.map(item => new Date(item[0]))
      },
      isoTimeSeriesDates () {
        return this.timeSeriesDates.map(date => date.toISOString().substring(0, 10))
      },
      date () {
        return new Date(this.isoDate)
      },
      oldDate () {
        return new Date(this.isoOldDate)
      },
      formattedDate () {
        return this.formatDate(this.isoDate)
      },
      formattedOldDate () {
        return this.formatDate(this.isoOldDate)
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
        const date = this.timeSeriesDates[this.timeSeriesDates.length - 1]
        this.isoDate = date.toISOString().substring(0, 10)
        const oldDate = new Date(date.getTime())
        oldDate.setFullYear(date.getFullYear() - 1)
        this.isoOldDate = this.timeSeriesDates[this.getNearestDateIndex(oldDate)].toISOString().substring(0, 10)
      },
      formatDate (date) {
        if (!date) { return null }

        const [year, month, day] = date.split('-')
        return `${day}/${month}/${year}`
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
      allowedDates (date) {
        return this.isoTimeSeriesDates.includes(date)
      },
    },
  }
</script>

<style src="./ComparisonMap.scss" lang="scss"/>
