<template>
  <Fragment v-if="!$fetchState.pending && reservoir">
    <client-only>
      <PageHeroesDetailHero :title="title">
        <p class="p">
          {{ reservoirId }}
        </p>
      </PageHeroesDetailHero>
      <ReservoirPageSection :reservoir="reservoir" :time-series="timeSeries" />
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
      if (this.$route.params.slug) {
        try {
          [this.reservoir, this.timeSeries] = await Promise.all([
            this.$repo.reservoir.getReservoirById(this.$route.params.slug),
            this.$repo.reservoir.getTimeSeries(),
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
