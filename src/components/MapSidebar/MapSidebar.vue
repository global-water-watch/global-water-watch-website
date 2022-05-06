<template>
  <aside class="map-sidebar">
    <h2 class="h3">
      {{ title }}
    </h2>
    <p class="p">
      #{{ reservoir.fid }}
    </p>
    <p class="p">
      Source: {{ reservoir.source_nam }}
    </p>
    <data-chart
      :title="'Reservoir area'"
      :x-axis="xAxis"
      :y-axis="yAxis"
      :series="series"
      :show-tooltip="true"
      :show-legend="true"
      :use-zoom="true"
      :use-toolbox="false"
    />

    <br>
    <VBtn type="button" @click="getMonthly">
      See monthly data
    </VBtn>
  </aside>
</template>

<script>
  import reservoirRepo from '@/repo/reservoirRepo'

  export default {
    props: {
      reservoir: {
        type: Object,
        default: null,
      },
    },

    data: () => ({
      xAxis: [],
      yAxis: [],
      series: [],
    }),

    computed: {
      title () {
        return this.reservoir?.name ?? 'Nameless reservoir'
      },
    },

    created () {
      const timeSeries = reservoirRepo.getTimeSeries()
      this.xAxis = Object.freeze(timeSeries.xAxis)
      this.yAxis = Object.freeze(timeSeries.yAxis)
      this.series = Object.freeze(timeSeries.series)
    },

    methods: {
      getMonthly () {
        const timeSeries = reservoirRepo.getTimeSeriesMonthly()
        this.xAxis = Object.freeze(timeSeries.xAxis)
        this.yAxis = Object.freeze(timeSeries.yAxis)
        this.series = Object.freeze(timeSeries.series)
      },
    },
  }
</script>

<style src="./MapSidebar.scss" lang="scss"></style>
