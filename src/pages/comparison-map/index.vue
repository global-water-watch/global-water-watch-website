<template>
  <ComparisonMap
    :reservoirs="reservoir"
    :time-series="series"
    :is-loading="isLoading"
    :is-embedded="true"
    :embedded-date="date"
    :embedded-old-date="oldDate"
    :embedded-extra-buffer="extraBuffer"
    class="comparison-map--embedded"
  />
</template>

<script>
  export default {
    layout: 'empty',
    data: () => ({
      reservoir: {},
      timeSeries: {
        xAxis: [],
        yAxis: [],
        series: [],
      },
      date: new Date(),
      oldDate: new Date(),
      extraBuffer: 0,
    }),

    async fetch () {
      const { reservoir, date, oldDate, extraBuffer } = this.$route.query
      if (!reservoir || !date || !oldDate) { return }

      this.date = new Date(date)
      this.oldDate = new Date(oldDate)

      if (extraBuffer) {
        this.extraBuffer = Number(extraBuffer)
      }

      try {
        [this.reservoir, this.timeSeries] = await Promise.all([
          this.$repo.reservoir.getById(reservoir),
          this.$repo.reservoir.getTimeSeriesById(reservoir),
        ])
      } catch (e) {
        console.error(e)
      }
    },

    fetchOnServer: false,

    computed: {
      isLoading () {
        return this.$fetchState.pending || !this.reservoir
      },

      series () {
        return this.timeSeries?.series
      },
    },
  }
</script>

<style>
  html {
    overflow: hidden;
  }

  .comparison-map--embedded {
    width: 100%;
    height: 100%;
    overflow: hidden;
  }

  .comparison-map--embedded .comparison-map__map-container {
    height: 100%
  }

  .comparison-map--embedded .comparison-detail-map {
    height: 100%;
  }
</style>
