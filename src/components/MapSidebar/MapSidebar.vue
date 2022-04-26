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
    <data-chart :option="chartOption" />
    <button @click="testClick">
      Click
    </button>
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
      chartOption: {
        tooltip: {},
        xAxis: {
          data: ['shirt', 'cardigan', 'chiffon', 'pants', 'heels', 'socks'],
        },
        yAxis: {},
        series: [
          {
            name: 'sales',
            type: 'line',
            data: [5, 20, 36, 10, 10, 20],
          },
        ],
      },
    }),

    computed: {
      title () {
        return this.reservoir?.name ?? 'Nameless reservoir'
      },
    },

    methods: {
      testClick () {
        this.chartOption = {
          ...this.chartOption,
          series: [
            {
              ...this.chartOption.series[0],
              data: [40, 20, 36, 10, 10, 20],
            },
          ],
        }
      },
    },
  }
</script>

<style src="./MapSidebar.scss" lang="scss"></style>
