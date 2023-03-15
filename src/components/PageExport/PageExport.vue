<template>
  <section class="layout-section layout-section--padded-small layout-section--lined page-share ma-3">
    <div class="layout-container">
      <v-skeleton-loader
        v-if="isLoading"
        class="page-share__skeleton-loader"
        type="heading, button"
      />
      <Fragment v-else>
        <v-row class="mb-3">
          <h3>
            Export options
          </h3>
        </v-row>
        <!-- Temporary hide share page for custom selection since this url isn't nice to share -->
        <v-row v-if="areaType !== 'custom-selection'">
          <v-btn
            color="blue-grey darken-3"
            class="mr-2"
            @click="copyToClipBoard"
          >
            Copy url
            <v-icon right>
              mdi-content-copy
            </v-icon>
          </v-btn>
          <input type="text" class="page-share__input" :value="shareUrl" readonly>
        </v-row>
        <v-row>
          <v-btn
            color="blue-grey darken-3 data-chart__button"
            class="mr-2"
            @click="exportTimeSeries"
          >
            Download .csv(s)
            <v-icon right>
              mdi-download
            </v-icon>
          </v-btn>
          <v-btn
            color="blue-grey darken-3 data-chart__button"
            class="mr-2"
            @click="exportGeometry"
          >
            Download .geojson
            <v-icon right>
              mdi-download
            </v-icon>
          </v-btn>
        </v-row>
      </Fragment>
    </div>
  </section>
</template>

<script>
  import JSZip from 'jszip'
  export default {
    props: {
      isLoading: {
        type: Boolean,
        default: false,
      },
      reservoirs: {
        type: Object,
        default: () => {},
      },
      timeSeries: {
        type: [Object, null],
        default: null,
      },
      areaType: {
        type: String,
        default: '',
      },
    },

    data: () => ({
      shareUrl: undefined,
    }),

    mounted () {
      this.shareUrl = window.location.href
    },

    methods: {
      async copyToClipBoard () {
        try {
          await navigator.clipboard.writeText(this.shareUrl)
        } catch (err) {
          throw new Error('Error: Copy to clipboard')
        }
      },
      async exportTimeSeries () {
        if (this.timeSeries.series.length === 1) {
          const { name, content } = this.timeSeriesCsv(this.timeSeries.series[0])

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
        const isSingleFeature = this.reservoirs.type === 'Feature'

        const filename = isSingleFeature
          ? `${this.reservoirName(this.reservoirs)}.geojson`
          : 'Reservoirs.geojson'

        this.downloadFile(
          filename,
          new Blob([JSON.stringify(this.reservoirs)], { type: 'application/geo+json;charset=utf-8' }),
        )
      },
      timeSeriesCsv (serie) {
        let csv = `${this.timeSeries.xAxis[0].type},${this.timeSeries.yAxis[0].name}\n`
        serie.data.forEach((row) => {
          csv += row.join(',')
          csv += '\n'
        })
        return { name: serie.name, content: csv }
      },
      timeSeriesZip () {
        const zip = new JSZip()
        const files = this.timeSeries.series.map((serie) => {
          return this.timeSeriesCsv(serie)
        })
        files.forEach(({ name, content }) => {
          zip.file(`${name}.csv`, content)
        })
        return zip
      },
      downloadFile (filename, blob) {
        const anchor = document.createElement('a')
        anchor.href = window.URL.createObjectURL(blob)
        anchor.target = '_blank'
        anchor.download = filename
        anchor.click()
      },
      // For nameless reservoir: #id
      // For named reservoirs: name (#id)
      reservoirName (reservoir) {
        return reservoir?.properties?.name
          ? `${reservoir.properties.name} (#${reservoir.id})`
          : `#${reservoir.id}`
      },
    },
  }
</script>

<style src="./PageExport.scss" lang="scss"/>
