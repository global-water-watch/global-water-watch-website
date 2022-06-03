<template>
  <Fragment>
    <p v-if="$fetchState.pending">
      Fetching reservoirs...
    </p>
    <p v-else-if="$fetchState.error">
      Error fetching reservoirs...
    </p>
    <div v-else>
      <PageHeroesDetailHero :title="title">
        <p class="p">
          {{ reservoirId }}
        </p>
      </PageHeroesDetailHero>
      <ReservoirPageSection :reservoir="reservoir" :time-series="timeSeries" />
    </div>
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
      try {
        [this.reservoir, this.timeSeries] = await Promise.all([
          this.$repo.reservoir.getReservoirById(this.$route.params.slug),
          this.$repo.reservoir.getTimeSeries(),
        ])
      } catch (e) {
        throw new Error(e)
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
