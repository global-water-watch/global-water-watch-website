<template>
  <section class="reservoir-page-section layout-section layout-section--lined">
    <div class="layout-container">
      <client-only>
        <DetailMap :reservoirs="reservoir ? [reservoir] : reservoirs" />
      </client-only>
      <data-chart
        :title="chartTitle"
        :x-axis="xAxis"
        :y-axis="yAxis"
        :series="series"
        :show-tooltip="true"
        :show-legend="true"
        :use-zoom="true"
        :use-toolbox="false"
      />
    </div>
  </section>
</template>

<script>
  export default {
    props: {
      reservoir: {
        type: Object,
        default: () => {},
      },
      reservoirs: {
        type: Array,
        default: () => [],
      },
      timeSeries: {
        type: Object,
        required: true,
      },
    },

    computed: {
      chartTitle () {
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
  }
</script>

<style src="./ReservoirPageSection.scss" lang="scss" />
