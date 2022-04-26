<template>
  <div
    ref="$chart"
    class="data-chart"
  />
</template>

<script>
  import * as echarts from 'echarts'

  export default {
    mounted () {
      const { $chart } = this.$refs
      const chart = echarts.init($chart)

      chart.setOption({
        title: {
          text: 'ECharts Getting Started Example',
        },
        tooltip: {},
        xAxis: {
          data: ['shirt', 'cardigan', 'chiffon', 'pants', 'heels', 'socks'],
        },
        yAxis: {},
        series: [
          {
            name: 'sales',
            type: 'bar',
            data: [5, 20, 36, 10, 10, 20],
          },
        ],
      })
    },
  }
</script>

<style src="./DataChart.scss" lang="scss"></style>
