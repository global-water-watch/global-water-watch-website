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
      console.log(this.$route)
      if (this.$route.query.ids) {
        const ids = this.$route.query.ids.split(',')

        console.log('ids', ids)

        try {
          this.timeSeries = this.$repo.reservoir.getTimeSeries()
          this.reservoirs = await Promise.all(ids.map(async (id) => {
            const reservoir = await this.$repo.reservoir.getReservoirById(id)
            return reservoir
          }))

          console.log('this.reservoirs', this.reservoirs)
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
