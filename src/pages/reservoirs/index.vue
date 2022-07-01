<template>
  <Fragment v-if="!$fetchState.pending && reservoirs">
    <client-only>
      <PageHeroesDetailHero title="Reservoirs">
        <p class="p">
          ids: {{ reservoirIds }}
        </p>
      </PageHeroesDetailHero>
      <ReservoirPageSection :reservoirs="reservoirs" :time-series="timeSeries" />
    </client-only>
  </Fragment>
</template>

<script>
  export default {
    data: () => ({
      reservoirs: [],
      timeSeries: {
        xAxis: [],
        yAxis: [],
        series: [],
      },
    }),

    async fetch () {
      if (this.$route.query.ids) {
        const ids = this.$route.query.ids.split(',')

        try {
          this.timeSeries = this.$repo.reservoir.getTimeSeries()
          this.reservoirs = await Promise.all(ids.map((id) => {
            return this.$repo.reservoir.getReservoirById(id)
          }))
        } catch (e) {
          console.error(e)
        }
      }
    },

    computed: {
      reservoirIds () {
        return this.reservoirs.map(r => r.id).join(', ')
      },
    },
  }
</script>
