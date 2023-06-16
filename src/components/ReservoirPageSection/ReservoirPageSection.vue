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
        v-if="(hasReservoirs && surfaceArea) || isLoading || isLoadingChart"
        :title="surfaceAreaChartTitle"
        :x-axis="surfaceAreaXAxis"
        :y-axis="surfaceAreaYAxis"
        :series="surfaceAreaSeries"
        :show-tooltip="true"
        :show-legend="true"
        :use-zoom="true"
        :use-toolbox="true"
        :is-loading="isLoading || isLoadingChart"
        @selectedTimeChanged="onSelectedTimeChanged"
      />

      <data-chart
        v-if="surfaceVolume"
        :title="surfaceVolumeChartTitle"
        :x-axis="surfaceVolume.xAxis"
        :y-axis="surfaceVolume.yAxis"
        :series="surfaceVolume.series"
        :show-tooltip="true"
        :show-legend="true"
        :use-zoom="true"
        :use-toolbox="true"
        :is-loading="isLoading || isLoadingChart"
        color="#fac858"
        class="reservoir-page-section__volume-chart"
      />
      <MessageBox
        v-else-if="!surfaceVolume && !isLoading"
        message="No volume estimation available"
        type="info"
        icon="mdi-information-outline"
        class="reservoir-page-section__volume-chart"
      />

      <ComparisonMap
        v-if="showComparisonMap && (hasReservoirs || isLoading)"
        :reservoirs="reservoirs"
        :time-series="surfaceArea.series"
        :is-loading="isLoading"
      />

      <PageExport
        v-if="hasReservoirs"
        :is-loading="isLoading"
        :area-type="areaType"
        :reservoirs="reservoirs"
        :surface-area="surfaceArea"
        :surface-volume="surfaceVolume"
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
      surfaceArea: {
        type: [Object, null],
        default: null,
      },
      surfaceVolume: {
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
      surfaceAreaChartTitle () {
        if (this.reservoirs.type === 'FeatureCollection') {
          return ''
        }

        return this.reservoirs.properties?.preferred_name ? `Reservoir area of ${this.reservoirs.properties.preferred_name}` : ''
      },

      surfaceVolumeChartTitle () {
        if (this.reservoirs.type === 'FeatureCollection') {
          return ''
        }

        return this.reservoirs.properties?.preferred_name ? `Reservoir volume of ${this.reservoirs.properties.preferred_name}` : ''
      },

      hasReservoirs () {
        return (this.reservoirs.type === 'FeatureCollection' && this.reservoirs.features.length > 0) || this.reservoirs.type === 'Feature'
      },

      surfaceAreaXAxis () {
        return this.surfaceArea?.xAxis
      },

      surfaceAreaYAxis () {
        return this.surfaceArea?.yAxis
      },

      surfaceAreaSeries () {
        return this.surfaceArea?.series
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
