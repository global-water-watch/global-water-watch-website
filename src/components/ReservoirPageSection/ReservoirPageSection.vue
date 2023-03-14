<template>
  <section class="reservoir-page-section layout-section layout-section--lined">
    <div class="layout-container">
      <DetailMap
        :reservoirs="reservoirs"
        :geometry="geometry"
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
          v-else-if="reservoirs.type === 'Feature'"
          message="Select a data point in the graph to generate a satellite image"
          type="info"
          icon="mdi-information-outline"
          :is-loading="isLoading"
        />
      </div>

      <data-chart
        v-if="(hasReservoirs && timeSeries) || isLoading || isLoadingChart"
        :title="chartTitle"
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
        v-if="showComparisonMap && (hasReservoirs || isLoading)"
        :reservoirs="reservoirs"
        :time-series="series"
        :is-loading="isLoading"
      />

      <PageExport
        v-if="hasReservoirs"
        :is-loading="isLoading"
        :area-type="areaType"
        :reservoirs="reservoirs"
        :time-series="timeSeries"
      />

      <FeedbackForm
        v-if="showFeedbackForm && !isLoading"
        :reservoir="reservoirs"
      />
    </div>
  </section>
</template>

<script>
  export default {
    props: {
      reservoirs: {
        type: Object,
        default: () => {},
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
      geometry: {
        type: Object,
        default: () => {},
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
        if (this.reservoirs.type === 'FeatureCollection') {
          return ''
        }

        return this.reservoirs.properties?.name ? `Reservoir area of ${this.reservoirs.properties.name}` : ''
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

      hasReservoirs () {
        return (this.reservoirs.type === 'FeatureCollection' && this.reservoirs.features.length > 0) || this.reservoirs.type === 'Feature'
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
