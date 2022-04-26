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
      option: {
        type: Object,
        required: true,
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
