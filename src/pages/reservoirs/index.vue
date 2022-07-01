<template>
  <client-only>
    <Fragment v-if="!$fetchState.pending && reservoirs">
      <PageHeroesDetailHero title="Reservoirs">
        <p class="p">
          ids: {{ reservoirs.map(r => r.id).join(', ') }}
        </p>
      </PageHeroesDetailHero>
      <ReservoirPageSection :reservoirs="reservoirs" />
    </Fragment>
  </client-only>
</template>

<script>
  export default {
    data: () => ({
      reservoirs: [],
    }),

    async fetch () {
      if (this.$route.query.ids) {
        const ids = this.$route.query.ids.split(',')

        try {
          this.reservoirs = await Promise.all(
            ids.map((id) => {
              return this.$repo.reservoir.getReservoirById(id)
            }),
          )
        } catch (e) {
          console.error(e)
        }
      }
    },
  }
</script>
