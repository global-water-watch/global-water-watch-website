<template>
  <section class="reservoir-page-section layout-section layout-section--lined">
    <div class="layout-container">
      <DetailMap
        v-if="reservoirs.length"
        :reservoirs="reservoirs"
        :satellite-image-url="satelliteImageUrl"
      />

      <div class="reservoir-page-section__loader">
        <Loader
          v-if="generatingSatelliteImageUrl.loading.state"
          :loading="generatingSatelliteImageUrl.loading.state"
          :message="generatingSatelliteImageUrl.loading.message"
          no-margin
        />
        <Message
          v-else-if="generatingSatelliteImageUrl.error.state"
          :message="generatingSatelliteImageUrl.error.message"
          type="error"
        />
      </div>

      <data-chart
        v-if="timeSeries"
        :title="chartTitle"
        :x-axis="xAxis"
        :y-axis="yAxis"
        :series="series"
        :show-tooltip="true"
        :show-legend="true"
        :use-zoom="true"
        :use-toolbox="false"
        @selectedTimeChanged="onSelectedTimeChanged"
      />

      <!-- Temporary hide share project for custom selection since this url isn't nice to share -->
      <ProjectShare v-if="areaType !== 'custom-selection'" title="Share this project" />
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
    },

    computed: {
      chartTitle () {
        // @TODO :: Fix this
        return this.reservoir?.name ? `Reservoir area of ${this.reservoir.name}` : ''
      },

      xAxis () {
        return this.timeSeries.xAxis
      },

      yAxis () {
        return this.timeSeries.yAxis
      },

      series () {
        return this.timeSeries.series
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
