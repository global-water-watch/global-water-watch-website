<template>
  <aside class="map-sidebar">
    <h2 class="h3">
      {{ title }}
    </h2>
    <p class="p">
      #{{ reservoir.fid }}
    </p>
    <p class="p">
      Source: {{ reservoir.source_nam }}
    </p>
    <data-chart />
  </aside>
</template>

<script>
  export default {
    props: {
      reservoir: {
        type: Object,
        default: null,
      },
    },

    computed: {
      title () {
        return this.reservoir?.name ?? 'Nameless reservoir'
      },
    },
  }
</script>

<style src="./MapSidebar.scss" lang="scss"></style>
