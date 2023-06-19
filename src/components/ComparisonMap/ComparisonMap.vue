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
        </p>
        <p class="small">
          On the advanced settings panel, on the left top corner of the map, you can change the buffer size of the satellite images.
          This will allow you to see more or less of the surrounding area of the reservoir. The default value is 300m.
          The bigger the buffer size, the longer it will take to load the satellite images.
        </p>
        <h3>Embed the map</h3>
        <p class="small">
          You can embed the comparison map on your website by copying the code below. The dates will be fixed to the ones currently selected, same for any advanced settings.
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
        :extra-buffer="satelliteImageExtraBuffer"
        class="comparison-map__detail-map"
        @setMap="onSetOldMap"
        @generatingSatelliteImage="onGeneratingSatelliteImage"
      />

      <ComparisonDetailMap
        v-if="reservoirs"
        :reservoirs="reservoirs"
        :date="date"
        :extra-buffer="satelliteImageExtraBuffer"
        class="comparison-map__detail-map"
        @setMap="onSetCurrentMap"
        @generatingSatelliteImage="onGeneratingSatelliteImage"
      />

      <v-expansion-panels v-if="!isEmbedded" class="comparison-map__settings">
        <v-expansion-panel>
          <v-expansion-panel-header>
            <h3>Advanced settings</h3>
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
      <div v-if="generatingSatelliteImageUrl.loading.state" class="comparison-map__loading">
        <div>
          Generating satellite images
          <v-progress-circular indeterminate :size="18" :width="2" class="comparison-map__loading-icon" :aria-hidden="true" />
        </div>
        This feature is not optimized for larger reservoirs.
      </div>
      <MessageBox
        v-else-if="generatingSatelliteImageUrl.error.state"
        :message="generatingSatelliteImageUrl.error.message"
        type="error"
        icon="mdi-alert"
      />
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
      embeddedExtraBuffer: {
        type: Number,
        default: 0,
      },
    },

    data () {
      return {
        date: new Date(),
        oldDate: new Date(),
        satelliteImageExtraBuffer: 0,
        sliderValue: 0,
        generatingSatelliteImageUrl: {
          loading: {
            state: false,
          },
          error: {
            state: false,
            message: '',
          },
        },
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
        return `<iframe src="${window.location.origin}/comparison-map?reservoir=${this.reservoirs.id}&date=${this.isoDate}&oldDate=${this.isoOldDate}&extraBuffer=${this.satelliteImageExtraBuffer}" width='800' height='500'></iframe>`
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
        if (this.isEmbedded) {
          this.satelliteImageExtraBuffer = this.embeddedExtraBuffer
        }

        // Importing mapbox-gl-compare here to avoid https://github.com/mapbox/mapbox-gl-compare/issues/1
        const MapboxCompare = (await import('mapbox-gl-compare')).default
        // eslint-disable-next-line no-new
        new MapboxCompare(oldMap, currentMap, '#comparison-map-container')
      },
      onGeneratingSatelliteImage (generatingSatelliteImageUrl) {
        this.generatingSatelliteImageUrl = generatingSatelliteImageUrl
      },
      onOldDateChanged (date) {
        this.oldDate = date
      },
      onDateChanged (date) {
        this.date = date
      },
      // By setting the value here we avoid making calls when the user is sliding the slider
      onSatelliteImageExtraBufferChanged (value) {
        // The default buffer is 300m, the extra buffer is added to that
        // For clarity, we want to display the total buffer size
        this.satelliteImageExtraBuffer = value < 300 ? value : value - 300
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
