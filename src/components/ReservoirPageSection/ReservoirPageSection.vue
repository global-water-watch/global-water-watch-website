<template>
  <section class="reservoir-page-section layout-section layout-section--lined">
    <div class="layout-container">
      <DetailMap
        :reservoirs="reservoirs"
        :geometry="geometry"
        :satellite-image-url="satelliteImageUrl"
        :is-loading="isLoading"
      />

      <div class="reservoir-page-section__loader">
        <Loader
          v-if="generatingSatelliteImageUrl.loading.state"
          :loading="generatingSatelliteImageUrl.loading.state"
          :message="generatingSatelliteImageUrl.loading.message"
          no-margin
        />
        <MessageBox
          v-else-if="generatingSatelliteImageUrl.error.state"
          :message="generatingSatelliteImageUrl.error.message"
          type="error"
          icon="mdi-alert"
          :is-loading="isLoading"
        />
        <MessageBox
          v-else-if="reservoirs.length === 1"
          message="Select a data point in the graph to generate a satellite image"
          type="info"
          icon="mdi-information-outline"
          :is-loading="isLoading"
        />
      </div>

      <data-chart
        v-if="(reservoirs.length && timeSeries) || isLoading || isLoadingChart"
        :title="chartTitle"
        :show-export-button="showExportButton"
        :x-axis="xAxis"
        :y-axis="yAxis"
        :series="series"
        :show-tooltip="true"
        :show-legend="true"
        :use-zoom="true"
        :use-toolbox="true"
        :is-loading="isLoading || isLoadingChart"
        @selectedTimeChanged="onSelectedTimeChanged"
      />

      <ComparisonMap
        v-if="showComparisonMap && (reservoirs.length || isLoading)"
        :reservoirs="reservoirs"
        :time-series="series"
        :is-loading="isLoading"
      />

      <!-- Temporary hide share page for custom selection since this url isn't nice to share -->
      <PageShare
        v-if="reservoirs.length && areaType !== 'custom-selection'"
        :is-loading="isLoading"
        @exportTimeSeries="exportTimeSeries"
        @exportGeometry="exportGeometry"
      />

      <FeedbackForm
        v-if="showFeedbackForm && !isLoading"
        :reservoir="reservoirs[0]"
      />
    </div>
  </section>
</template>

<script>
  import JSZip from 'jszip'
  export default {
    props: {
      reservoirs: {
        type: Array,
        default: () => [],
      },
      timeSeries: {
        type: [Object, null],
        default: null,
      },
      generatingSatelliteImageUrl: {
        type: Object,
        default: () => {
          return {
            loading: {
              state: false,
              message: '',
            },
            error: {
              state: false,
              message: '',
            },
          }
        },
      },
      areaType: {
        type: String,
        default: '',
      },
      geometry: {
        type: Object,
        default: () => {},
      },
      satelliteImageUrl: {
        type: String,
        default: '',
      },
      showComparisonMap: {
        type: Boolean,
        default: false,
      },
      showFeedbackForm: {
        type: Boolean,
        default: false,
      },
      showExportButton: {
        type: Boolean,
        default: false,
      },
      isLoading: {
        type: Boolean,
        default: false,
      },
      isLoadingChart: {
        type: Boolean,
        default: false,
      },
    },

    computed: {
      chartTitle () {
        if (this.reservoirs.length > 1) {
          return ''
        }

        return this.reservoirs[0]?.properties?.name ? `Reservoir area of ${this.reservoirs[0].properties.name}` : ''
      },

      xAxis () {
        return this.timeSeries?.xAxis
      },

      yAxis () {
        return this.timeSeries?.yAxis
      },

      series () {
        return this.timeSeries?.series
      },
    },

    methods: {
      onSelectedTimeChanged (time) {
        this.$emit('onSelectedTimeChanged', time)
      },
      async exportTimeSeries () {
        if (this.series.length === 1) {
          const { name, content } = this.timeSeriesCsv(this.series[0])

          this.downloadFile(
            `${name}.csv`,
            new Blob([content], { type: 'text/csv;charset=utf-8' }),
          )
        } else {
          const zip = this.timeSeriesZip()

          const content = await zip.generateAsync({ type: 'blob' })
          this.downloadFile(
            'Reservoirs - Surface Water Area.zip',
            content,
          )
        }
      },
      exportGeometry () {
        if (this.reservoirs.length === 1) {
          const geometry = JSON.stringify(this.reservoirs[0])

          this.downloadFile(
            this.reservoirs[0]?.properties?.name
              ? `${this.reservoirs[0].properties.name} (#${this.reservoirs[0].id}).geojson`
              : `#${this.reservoirs[0].id}.geojson`,
            new Blob([geometry], { type: 'application/geo+json;charset=utf-8' }),
          )
        } else {
          const geometry = JSON.stringify({
            type: 'FeatureCollection',
            features: this.reservoirs,
          })

          this.downloadFile(
            'Reservoirs.geojson',
            new Blob([geometry], { type: 'application/geo+json;charset=utf-8' }),
          )
        }
      },
      timeSeriesCsv (serie) {
        let csv = `${this.xAxis[0].type},${this.yAxis[0].name}\n`
        serie.data.forEach((row) => {
          csv += row.join(',')
          csv += '\n'
        })
        return { name: serie.name, content: csv }
      },
      timeSeriesZip () {
        const zip = new JSZip()
        const files = this.series.map((serie) => {
          return this.timeSeriesCsv(serie)
        })
        files.forEach(({ name, content }) => {
          zip.file(`${name}.csv`, content)
        })
        return zip
      },
      downloadFile (filename, blob) {
        const anchor = document.createElement('a')
        anchor.href = (window.URL || window.webkitURL).createObjectURL(blob)
        anchor.target = '_blank'
        anchor.download = filename
        anchor.click()
      },
    },
  }
</script>

<style src="./ReservoirPageSection.scss" lang="scss" />
