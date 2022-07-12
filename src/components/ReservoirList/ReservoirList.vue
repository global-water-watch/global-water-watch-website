<template>
  <div class="reservoir-list">
    <p class="p">
      Included reservoirs:
    </p>
    <ul class="reservoir-list__list">
      <li v-for="reservoir in reservoirInfo" :key="reservoir.id" class="reservoir-list__list-item">
        <NuxtLink :to="`/reservoir/${reservoir.id}`" class="pill">
          {{ reservoir.name }} (#{{ reservoir.id }})
        </NuxtLink>
      </li>
      <li class="reservoir-list__list-item">
        <button v-if="showMaxReservoirs" class="pill reservoir-list__button" :aria-label="`${showAllButtonText} reservoirs`" @click="toggleReservoirs">
          {{ showAllButtonText }}
        </button>
      </li>
    </ul>
  </div>
</template>

<script>
  const MAX_RESERVOIRS_TO_SHOW = 10

  export default {
    props: {
      reservoirs: {
        type: Array,
        required: true,
      },
    },

    data: () => ({
      showMoreMode: false,
    }),

    computed: {
      transformedReservoirs () {
        return this.reservoirs.map(reservoir => ({
          id: reservoir.id,
          name: reservoir.properties?.name ?? 'Nameless reservoir',
        })).sort((a, b) => a.name.localeCompare(b.name))
      },

      reservoirInfo () {
        return this.showMaxReservoirs && !this.showMoreMode ? this.transformedReservoirs.slice(0, MAX_RESERVOIRS_TO_SHOW) : this.transformedReservoirs
      },

      showMaxReservoirs () {
        return this.transformedReservoirs.length > MAX_RESERVOIRS_TO_SHOW
      },

      showAllButtonText () {
        return this.reservoirInfo.length > MAX_RESERVOIRS_TO_SHOW ? 'Show less' : 'Show all'
      },
    },

    methods: {
      toggleReservoirs () {
        this.showMoreMode = !this.showMoreMode
      },
    },
  }
</script>

<style src="./ReservoirList.scss" lang="scss"></style>
