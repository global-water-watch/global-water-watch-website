<template>
  <section class="reservoir-page-section layout-section layout-section--lined">
    <div class="layout-container">
      <DetailMap
        v-if="reservoirs.length || isLoading"
        :reservoirs="reservoirs"
        :satellite-image-url="satelliteImageUrl"
        :satellite-video="satelliteVideo"
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
        :use-toolbox="false"
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
        title="Share this page"
        :is-loading="isLoading"
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
      satelliteVideo: {
        type: Object,
        default: null,
      },
      showComparisonMap: {
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
    },
  }
</script>

<style src="./ReservoirPageSection.scss" lang="scss" />
