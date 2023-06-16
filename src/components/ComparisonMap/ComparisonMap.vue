<template>
  <v-skeleton-loader
    v-if="isLoading && !isEmbedded"
    class="comparison-map__skeleton-loader"
    type="image"
  />
  <div v-else-if="!isLoading" class="comparison-map">
    <div v-if="!isEmbedded" class="layout-section mb-10">
      <div class="layout-container">
        <h2>Comparison map</h2>
        <p>
          Here we represent the state of the reservoir at the selected "before" and "after" times. We do this by creating a composite image of different satellite missions (Landsat 4, 5, 7, 8, 9 and Sentinel-2).
          The composite is constructed using images from the selected date, going back 30 days to gather enough images . The more recent images are displayed on top.
        </p>

        <h3>Interact with the map</h3>
        <p class="small">
          Click on the date at the bottom left to change the "before" date, and the date on the bottom right to change the "after" date.
          You can use the slider on the plot to compare the situation at the "before" date, shown on the left of the slider, and the "after" situation of the reservoir on the right of the slider.
          Increase the buffer size to expand the area of the composite image, by default we use a buffer size of 300m.
          The larger the buffer size, the longer it will take to load.
        </p>

        <h3>Embed the map</h3>
        <p class="small">
          You can embed the comparison map on your website by copying the code below. The dates will be fixed to the ones currently selected.
        </p>
        <v-row class="ma-0 mb-3">
          <v-btn
            color="blue-grey darken-3"
            class="mr-2"
            @click="copyToClipBoard(iframeCode)"
          >
            Copy iframe
            <v-icon right>
              mdi-content-copy
            </v-icon>
          </v-btn>
          <input type="text" class="long-input" :value="iframeCode" readonly>
        </v-row>
      </div>
    </div>

    <div id="comparison-map-container" class="comparison-map__map-container" :style="{'--date': `'${formattedDate}'`, '--oldDate': `'${formattedOldDate}'`}">
      <ComparisonDetailMap
        v-if="reservoirs"
        :reservoirs="reservoirs"
        :date="oldDate"
        :buffer-size="satelliteImageBufferSize"
        class="comparison-map__detail-map"
        @setMap="onSetOldMap"
        @loading="onLoadingSatelliteImage"
      />

      <ComparisonDetailMap
        v-if="reservoirs"
        :reservoirs="reservoirs"
        :date="date"
        :buffer-size="satelliteImageBufferSize"
        class="comparison-map__detail-map"
        @setMap="onSetCurrentMap"
        @loading="onLoadingSatelliteImage"
      />

      <v-expansion-panels v-if="!isEmbedded" class="comparison-map__settings">
        <v-expansion-panel>
          <v-expansion-panel-header>
            <h3>Extra settings</h3>
          </v-expansion-panel-header>
          <v-expansion-panel-content>
            <v-slider
              v-model="sliderValue"
              hint="Slide to select the buffer size"
              :persistent-hint="true"
              :max="1e+5"
              :min="0"
              :step="1000"
              @end="onSatelliteImageExtraBufferChanged"
            >
              <template #label>
                <span class="bold">Buffer size</span>
              </template>
              <template #append>
                {{ sliderValue/1000 }}km
              </template>
            </v-slider>
          </v-expansion-panel-content>
        </v-expansion-panel>
      </v-expansion-panels>
    </div>

    <div v-if="!isEmbedded" class="comparison-map__dates ma-3 mt-6">
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
        :left-aligned="true"
        @dateChanged="onDateChanged"
      />
    </div>
  </div>
</template>

<script>
  import { formatDate, isoFormatDate } from '@/lib/primitive-helpers'

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
      isEmbedded: {
        type: Boolean,
        default: false,
      },
      embeddedDate: {
        type: Date,
        default: () => new Date(),
      },
      embeddedOldDate: {
        type: Date,
        default: () => new Date(),
      },
    },

    data () {
      return {
        isLoadingSatelliteImages: false,
        date: new Date(),
        oldDate: new Date(),
        satelliteImageExtraBuffer: 0,
        sliderValue: 0,
      }
    },

    computed: {
      timeSeriesDates () {
        return this.timeSeries[0].data.map(item => new Date(item[0]))
      },

      formattedDate () {
        return formatDate(this.isoDate)
      },

      formattedOldDate () {
        return formatDate(this.isoOldDate)
      },

      isoDate () {
        return isoFormatDate(this.date)
      },

      isoOldDate () {
        return isoFormatDate(this.oldDate)
      },

      iframeCode () {
        return `<iframe src="${window.location.origin}/comparison-map?reservoir=${this.reservoirs.id}&date=${this.isoDate}&oldDate=${this.isoOldDate}" width='800' height='500'></iframe>`
      },

      satelliteImageBufferSize () {
        // The default buffer is 300m, the extra buffer is added to that
        // For clarity, we want to display the total buffer size
        return this.satelliteImageExtraBuffer < 300 ? this.satelliteImageExtraBuffer : this.satelliteImageExtraBuffer - 300
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
        if (this.isEmbedded) {
          this.date = this.embeddedDate
          this.oldDate = this.embeddedOldDate
        } else {
          // On mounted, `date` is the last date in the time series
          // `oldDate` is the closest date in the time series one year before `date`
          this.date = this.timeSeriesDates[this.timeSeriesDates.length - 1]
          const oldDate = new Date(this.date.getTime())
          oldDate.setFullYear(this.date.getFullYear() - 1)
          this.oldDate = this.timeSeriesDates[this.getNearestDateIndex(oldDate)]
        }
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
      onSatelliteImageExtraBufferChanged (value) {
        this.satelliteImageExtraBuffer = value
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
      async copyToClipBoard (url) {
        try {
          await navigator.clipboard.writeText(url)
        } catch (err) {
          throw new Error('Error: Copy to clipboard')
        }
      },
    },
  }
</script>

<style src="./ComparisonMap.scss" lang="scss"/>
