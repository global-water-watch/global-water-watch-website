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
    DataZoomComponent,
    LegendComponent,
  } from 'echarts/components'
  import { LabelLayout, UniversalTransition } from 'echarts/features'
  import { CanvasRenderer } from 'echarts/renderers'

  use([
    TitleComponent,
    TooltipComponent,
    GridComponent,
    DatasetComponent,
    TransformComponent,
    DataZoomComponent,
    LegendComponent,
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
        type: Array,
        default: () => [],
      },
      yAxis: {
        type: Array,
        default: () => [],
      },
      series: {
        type: Array,
        default: () => [],
      },
      showTooltip: {
        type: Boolean,
        default: false,
      },
      showLegend: {
        type: Boolean,
        default: false,
      },
    },

    computed: {
      option () {
        const { title, showTooltip, showLegend, xAxis, yAxis, series } = this
        // console.log(xAxis)

        // @TODO :: Make this a prop
        const useZoom = true

        const styledSeries = series.map(serie => ({
          ...serie,
          areaStyle: {},
          lineStyle: { width: 1 },
          emphasis: { focus: 'series' },

          // markArea: {
          //   silent: true,
          //   itemStyle: {
          //     opacity: 0.3,
          //   },
          //   data: [
          //     [
          //       {
          //         xAxis: '2015-12-08\n18:35',
          //       },
          //       {
          //         xAxis: '2020-06-24\n18:34',
          //       },
          //     ],
          //   ],
          // },
        }))

        return {
          /**
           * Chart data
          **/
          title: title && { text: title },
          xAxis,
          yAxis,
          series: styledSeries,

          /**
           * Meta tools
          **/
          tooltip: showTooltip && {
            trigger: 'axis',
            axisPointer: {
              type: 'cross',
              animation: false,
              // label: { backgroundColor: '#505765' },
            },
          },

          legend: showLegend && {
            data: series.map(({ name }) => name),
            right: 0,
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

          grid: {
            left: 80,
            top: title || showLegend ? 60 : 30,
            right: 10,
            bottom: useZoom ? 90 : 40,
          },

          /**
           * Properties for data zoom and zoom bar
          **/
          dataZoom: [
            {
              show: true,
              realtime: true,
              start: 80,
              end: 100,
            },
            // {
            //   type: 'inside',
            //   realtime: true,
            //   start: 65,
            //   end: 85,
            // },
          ],
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
      const chart = init($chart, null, {
        renderer: 'canvas',
        useDirtyRect: false,
      })
      this.chart = chart

      chart.setOption(this.option)
    },
  }
</script>

<style src="./DataChart.scss" lang="scss"></style>
