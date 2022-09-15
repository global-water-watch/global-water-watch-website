<template>
  <section class="reservoir-page-section layout-section layout-section--lined">
    <div class="layout-container">
      <DetailMap
        v-if="reservoirs.length"
        :reservoirs="reservoirs"
        :satellite-image-url="satelliteImageUrl"
      />

      <div class="reservoir-page-section__loader">
        <Loader :loading="generatingSatelliteImageUrl" message="Generating satellite image from the selected data point" no-margin />
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
      areaType: {
        type: String,
        default: '',
      },
      satelliteImageUrl: {
        type: String,
        default: '',
      },
      generatingSatelliteImageUrl: {
        type: Boolean,
        default: false,
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
