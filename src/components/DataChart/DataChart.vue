<template>
  <div
    ref="$chart"
    class="data-chart"
  />
</template>

<script>
  import { use, init, registerTheme } from 'echarts/core'
  import { LineChart } from 'echarts/charts'
  import {
    TitleComponent,
    TooltipComponent,
    GridComponent,
    DatasetComponent,
    TransformComponent,
    DataZoomComponent,
    LegendComponent,
    ToolboxComponent,
  } from 'echarts/components'
  import { LabelLayout, UniversalTransition } from 'echarts/features'
  import { CanvasRenderer } from 'echarts/renderers'
  import gwwTheme from '@/assets/theme/chart-theme.json'

  registerTheme('gww', gwwTheme)

  use([
    TitleComponent,
    TooltipComponent,
    GridComponent,
    DatasetComponent,
    TransformComponent,
    DataZoomComponent,
    ToolboxComponent,
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
      useZoom: {
        type: Boolean,
        default: false,
      },
      useToolbox: {
        type: Boolean,
        default: false,
      },
    },

    computed: {
      option () {
        const { title, showTooltip, showLegend, useZoom, useToolbox, xAxis, yAxis, series } = this

        const styledSeries = series.map(serie => ({
          ...serie,
          lineStyle: { width: 1 },
          // emphasis: { focus: 'series' },

          // markArea: {
          //   silent: true,
          //   itemStyle: {
          //     opacity: 0.3,
          //   },
          //   data: [
          //     [
          //       {
          //         xAxis: '1984-04-29\n17:42',
          //       },
          //       {
          //         xAxis: '2018-06-06\n18:15',
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
            triggerOn: 'click',
          },

          legend: showLegend && {
            data: series.map(({ name }) => name),
            right: 0,
          },

          toolbox: useToolbox && {
            left: 'center',
            feature: {
              dataZoom: {
                yAxisIndex: 'none',
              },
              restore: {},
              saveAsImage: {},
            },
          },

          grid: {
            left: 80,
            top: title || showLegend ? 60 : 30,
            right: 10,
            bottom: useZoom ? 90 : 40,
          },

          /**
           * Properties for data zoom and zoom bar
          **/
          dataZoom: useZoom && [
            {
              show: true,
              realtime: true,
              start: 80,
              end: 100,
            },
            // Used for mouse/touchpad zooming
            {
              type: 'inside',
              realtime: true,
              start: 65,
              end: 85,
            },
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
      const { $chart } = this.$refs
      const chart = init($chart, 'gww')
      this.chart = chart

      chart.setOption(this.option)
      this.subscribeChartEvents(chart)
    },
    methods: {
      subscribeChartEvents (chart) {
        chart.on('updateAxisPointer', (evt) => {
          if (evt.dataIndexInside) {
            // we're just moving
            return
          }
          const value = evt.axesInfo[0].value
          const t = new Date(value)
          // emit that the selected time changed
          this.$emit('selectedTimeChanged', t)
        })
      },
    },
  }
</script>

<style src="./DataChart.scss" lang="scss"></style>
