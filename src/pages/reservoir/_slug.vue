<template>
  <Fragment v-if="!$fetchState.pending && reservoir">
    <client-only>
      <PageHeroesDetailHero :title="title">
        <p class="p">
          {{ reservoirId }}
        </p>
      </PageHeroesDetailHero>
      <ReservoirPageSection :reservoirs="[reservoir]" :time-series="timeSeries" />
    </client-only>
  </Fragment>
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
      const { slug } = this.$route.params
      if (slug) {
        try {
          [this.reservoir, this.timeSeries] = await Promise.all([
            this.$repo.reservoir.getById(slug),
            this.$repo.reservoir.getTimeSeriesById(slug),
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
