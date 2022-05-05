<template>
  <div
    ref="$chart"
    class="data-chart"
  />
</template>

<script>
  import { use, init } from 'echarts/core'
  import { LineChart } from 'echarts/charts'
  import {
    TitleComponent,
    TooltipComponent,
    GridComponent,
    DatasetComponent,
    TransformComponent,
  } from 'echarts/components'
  import { LabelLayout, UniversalTransition } from 'echarts/features'
  import { CanvasRenderer } from 'echarts/renderers'

  use([
    TitleComponent,
    TooltipComponent,
    GridComponent,
    DatasetComponent,
    TransformComponent,
    LineChart,
    LabelLayout,
    UniversalTransition,
    CanvasRenderer,
  ])

  export default {
    props: {
      title: {
        type: String,
        default: '',
      },
      xAxis: {
        type: [Object, Array],
        default: () => ({}),
      },
      yAxis: {
        type: [Object, Array],
        default: () => ({}),
      },
      dataSets: {
        type: Array,
        default: () => [],
      },
      showTooltip: {
        type: Boolean,
        default: false,
      },
    },

    computed: {
      option () {
        const { title, showTooltip, xAxis, yAxis, dataSets } = this

        return {
          title: title && { text: title },
          tooltip: showTooltip && {
            trigger: 'axis',
            axisPointer: {
              type: 'cross',
              animation: false,
              // label: { backgroundColor: '#505765' },
            },
          },

          // toolbox: {
          //   feature: {
          //     dataZoom: {
          //       yAxisIndex: 'none',
          //     },
          //     restore: {},
          //     saveAsImage: {},
          //   },
          // },

          // grid: {
          //   bottom: 80,
          // },

          // legend: {
          //   data: ['Reservoir'],
          //   left: 10,
          // },

          // Chart data
          xAxis,
          yAxis,
          series: dataSets,

          // dataZoom: [
          //   {
          //     show: true,
          //     realtime: true,
          //     start: 65,
          //     end: 85,
          //   },
          //   {
          //     type: 'inside',
          //     realtime: true,
          //     start: 65,
          //     end: 85,
          //   },
          // ],
        }
      },
    },

    watch: {
      option (newVal) {
        this.chart.setOption(newVal)
      },
    },

    mounted () {
      if (!this.option) { return }

      const { $chart } = this.$refs
      const chart = init($chart)
      this.chart = chart

      chart.setOption(this.option)
    },
  }
</script>

<style src="./DataChart.scss" lang="scss"></style>
