<template>
  <client-only>
    <Fragment>
      <PageHeroesDetailHero v-if="reservoir" :title="title">
        <p v-if="reservoirId" class="p">
          {{ reservoirId }}
        </p>
      </PageHeroesDetailHero>
      <section class="layout-section layout-section--lined" />
    </Fragment>
  </client-only>
</template>

<script>
  export default {
    data: () => ({
      reservoir: {},
    }),

    async fetch () {
      console.log('fetching reservoir')
      try {
        this.reservoir = await this.$repo.reservoir.getReservoirById(this.$route.params.slug)
        console.log(this.reservoir)
      } catch (e) {
        console.log(e)
        return this.$nuxt.error({ statusCode: 404, message: e.message })
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
