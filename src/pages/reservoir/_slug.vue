<template>
  <client-only>
    <Fragment v-if="!$fetchState.pending && reservoir">
      <PageHeroesDetailHero :title="title">
        <p class="p">
          {{ reservoirId }}
        </p>
      </PageHeroesDetailHero>
      <ReservoirPageSection :reservoir="reservoir" :time-series="timeSeries" />
    </Fragment>
  </client-only>
</template>

<script>
  export default {
    data: () => ({
      reservoir: {},
      timeSeries: {
        xAxis: [],
        yAxis: [],
        series: [],
      },
    }),

    async fetch () {
      if (this.$route.params.slug) {
        const TEMP_SINGLE_RESERVOIR_WITH_TS = 1
        try {
          [this.reservoir, this.timeSeries] = await Promise.all([
            this.$repo.reservoir.getById(this.$route.params.slug),
            this.$repo.reservoir.getTimeSeriesById(TEMP_SINGLE_RESERVOIR_WITH_TS),
          ])
        } catch (e) {
          console.error(e)
        }
      }
    },

    fetchOnServer: false,

    computed: {
      title () {
        return this.reservoir?.properties?.name ?? 'Nameless reservoir'
      },

      reservoirId () {
        return this.reservoir.id ? `#${this.reservoir.id}` : ''
      },
    },
  }
</script>
