<template>
  <Fragment v-if="reservoirId">
    <PageHeroesDetailHero :title="title">
      <p class="p">
        {{ reservoirId }}
      </p>
    </PageHeroesDetailHero>
    <section class="layout-section layout-section--lined">
      <div class="layout-container">
        <client-only>
          <DetailMap :reservoirs="[reservoir]" />
        </client-only>
      </div>
    </section>
  </Fragment>
</template>

<script>
  export default {
    data: () => ({
      reservoir: {},
    }),

    async fetch () {
      try {
        this.reservoir = await this.$repo.reservoir.getReservoirById(this.$route.params.slug)
      } catch (e) {
        return this.$nuxt.error({ statusCode: 404, message: e.message })
      }
    },

    computed: {
      title () {
        return this.reservoir?.name ?? 'Nameless reservoir'
      },

      reservoirId () {
        return this.reservoir.reservoir_id ? `#${this.reservoir.reservoir_id}` : ''
      },
    },
  }
</script>
