<template>
  <section class="reservoir-page-section layout-section layout-section--lined">
    <div class="layout-container">
      <DetailMap
        v-if="reservoirs.length || isLoading"
        :reservoirs="reservoirs"
        :satellite-image-url="satelliteImageUrl"
        :is-loading="isLoading"
      />

      <div class="reservoir-page-section__loader">
        <Loader
          v-if="generatingSatelliteImageUrl.loading.state"
          :loading="generatingSatelliteImageUrl.loading.state"
          :message="generatingSatelliteImageUrl.loading.message"
          no-margin
        />
        <MessageBox
          v-else-if="generatingSatelliteImageUrl.error.state"
          :message="generatingSatelliteImageUrl.error.message"
          type="error"
          icon="mdi-alert"
          :is-loading="isLoading"
        />
        <MessageBox
          v-else-if="reservoirs.length === 1"
          message="Select a data point in the graph to generate a satellite image"
          type="info"
          icon="mdi-information-outline"
          :is-loading="isLoading"
        />
      </div>

      <data-chart
        v-if="timeSeries || isLoading || isLoadingChart"
        :title="chartTitle"
        :show-export-button="showExportButton"
        :x-axis="xAxis"
        :y-axis="yAxis"
        :series="series"
        :show-tooltip="true"
        :show-legend="true"
        :use-zoom="true"
        :use-toolbox="true"
        :is-loading="isLoading || isLoadingChart"
        @selectedTimeChanged="onSelectedTimeChanged"
      />

      <ComparisonMap
        v-if="showComparisonMap && (reservoirs.length || isLoading)"
        :reservoirs="reservoirs"
        :time-series="series"
        :is-loading="isLoading"
      />

      <!-- Temporary hide share page for custom selection since this url isn't nice to share -->
      <PageShare
        v-if="areaType !== 'custom-selection'"
        :is-loading="isLoading"
        :single-reservoir="reservoirs.length === 1"
        @exportTimeSeries="exportTimeSeries"
        @exportGeometry="exportGeometry"
      />

      <FeedbackForm
        v-if="showFeedbackForm && !isLoading"
        :reservoir="reservoirs[0]"
      />
    </div>
  </section>
</template>

<script>
  export default {
    props: {
      reservoirs: {
        type: Array,
        default: () => [],
      },
      timeSeries: {
        type: [Object, null],
        default: null,
      },
      generatingSatelliteImageUrl: {
        type: Object,
        default: () => {
          return {
            loading: {
              state: false,
              message: '',
            },
            error: {
              state: false,
              message: '',
            },
          }
        },
      },
      areaType: {
        type: String,
        default: '',
      },
      satelliteImageUrl: {
        type: String,
        default: '',
      },
      showComparisonMap: {
        type: Boolean,
        default: false,
      },
      showFeedbackForm: {
        type: Boolean,
        default: false,
      },
      showExportButton: {
        type: Boolean,
        default: false,
      },
      isLoading: {
        type: Boolean,
        default: false,
      },
      isLoadingChart: {
        type: Boolean,
        default: false,
      },
    },

    computed: {
      chartTitle () {
        if (this.reservoirs.length > 1) {
          return ''
        }

        return this.reservoirs[0]?.properties?.name ? `Reservoir area of ${this.reservoirs[0].properties.name}` : ''
      },

      xAxis () {
        return this.timeSeries?.xAxis
      },

      yAxis () {
        return this.timeSeries?.yAxis
      },

      series () {
        return this.timeSeries?.series
      },
    },

    methods: {
      onSelectedTimeChanged (time) {
        this.$emit('onSelectedTimeChanged', time)
      },
      exportTimeSeries () {
        let csv = `${this.xAxis[0].type},${this.yAxis[0].name}\n`
        this.series[0].data.forEach((row) => {
          csv += row.join(',')
          csv += '\n'
        })

        const anchor = document.createElement('a')
        anchor.href = 'data:text/csv;charset=utf-8,' + encodeURIComponent(csv)
        anchor.target = '_blank'
        anchor.download = `${this.chartTitle || 'reservoir'}.csv`
        anchor.click()
      },
      exportGeometry () {
        const geometry = JSON.stringify(this.reservoirs[0])

        const anchor = document.createElement('a')
        anchor.href = 'data:application/geo+json;charset=utf-8,' + encodeURIComponent(geometry)
        anchor.target = '_blank'
        anchor.download = `${this.reservoirs[0].properties.name || 'reservoir'}.geojson`
        anchor.click()
      },
    },
  }
</script>

<style src="./ReservoirPageSection.scss" lang="scss" />
