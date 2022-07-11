<template>
  <div v-if="reservoirs.length > 0" class="reservoir-list">
    <p class="p">
      Included reservoirs:
    </p>
    <ul class="reservoir-list__list">
      <li v-for="reservoir in reservoirInfo" :key="reservoir.id" class="reservoir-list__list-item">
        <NuxtLink to="`/reservoir/${reservoir.id}`" class="pill">
          {{ reservoir.name }} (#{{ reservoir.id }})
        </NuxtLink>
      </li>
    </ul>
  </div>
</template>

<script>
  export default {
    props: {
      reservoirs: {
        type: Array,
        required: true,
      },
    },

    computed: {
      reservoirInfo () {
        return this.reservoirs.map(reservoir => ({
          id: reservoir.id,
          name: reservoir.properties?.name ?? 'Nameless reservoir',
        })).sort((a, b) => a.name.localeCompare(b.name))
      },
    },
  }
</script>

<style src="./ReservoirList.scss" lang="scss"></style>
