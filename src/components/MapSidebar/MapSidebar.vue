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
    <data-chart
      :title="'Reservoir area'"
      :x-axis="xAxis"
      :y-axis="yAxis"
      :data-sets="dataSets"
      :show-tooltip="true"
    />
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

    data: () => ({
      xAxis: {
        data: ['shirt', 'cardigan', 'chiffon', 'pants', 'heels', 'socks'],
      },
      yAxis: {},
      dataSets: [
        {
          name: 'sales',
          type: 'line',
          data: [5, 20, 36, 10, 10, 20],
        },
      ],
    }),

    computed: {
      title () {
        return this.reservoir?.name ?? 'Nameless reservoir'
      },
    },
  }
</script>

<style src="./MapSidebar.scss" lang="scss"></style>
