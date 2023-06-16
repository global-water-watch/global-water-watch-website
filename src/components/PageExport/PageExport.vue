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
          <h2>
            Export options
          </h2>
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
      surfaceArea: {
        type: [Object, null],
        default: null,
      },
      surfaceVolume: {
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

    computed: {
      isFeature () {
        return this.reservoirs.type === 'Feature'
      },
    },

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
        const files = this.timeSeriesFiles()

        if (files.length > 1) {
          const zip = new JSZip()
          files.forEach(({ name, content }) => {
            zip.file(name, content)
          })

          const filename = this.isFeature
            ? `${this.reservoirName(this.reservoirs)}.zip`
            : 'Reservoirs - Surface Water Area.zip'

          const content = await zip.generateAsync({ type: 'blob' })
          this.downloadFile(
            filename,
            content,
          )
        } else {
          this.downloadFile(
            files[0].name,
            new Blob([files[0].content], { type: 'text/csv;charset=utf-8' }),
          )
        }
      },
      exportGeometry () {
        const filename = this.isFeature
          ? `${this.reservoirName(this.reservoirs)}.geojson`
          : 'Reservoirs.geojson'

        this.downloadFile(
          filename,
          new Blob([JSON.stringify(this.reservoirs)], { type: 'application/geo+json;charset=utf-8' }),
        )
      },
      timeSeriesFiles () {
        const files = []

        if (this.isFeature) {
          files.push(this.timeSeriesCsv(
            this.surfaceArea.series[0],
            this.surfaceArea.xAxis[0].type,
            this.surfaceArea.yAxis[0].name,
          ))

          if (this.surfaceVolume) {
            files.push(this.timeSeriesCsv(
              this.surfaceVolume.series[0],
              this.surfaceVolume.xAxis[0].type,
              this.surfaceVolume.yAxis[0].name,
            ))
          }
        } else {
          files.push(...this.surfaceArea.series.map((serie) => {
            return this.timeSeriesCsv(serie, this.surfaceArea.xAxis[0].type, this.surfaceArea.yAxis[0].name)
          }))
        }

        return files
      },
      timeSeriesCsv (serie, xAxisType, yAxisName) {
        let csv = `${xAxisType},${yAxisName}\n`
        serie.data.forEach((row) => {
          csv += row.join(',')
          csv += '\n'
        })
        return { name: `${serie.name}.csv`, content: csv }
      },
      downloadFile (filename, blob) {
        const anchor = document.createElement('a')
        anchor.href = window.URL.createObjectURL(blob)
        anchor.target = '_blank'
        anchor.download = filename
        anchor.click()
      },
      // For nameless reservoir: #id
      // For named reservoirs: preferred name (#id)
      reservoirName (reservoir) {
        return reservoir?.properties?.preferred_name
          ? `${reservoir.properties.preferred_name} (#${reservoir.id})`
          : `#${reservoir.id}`
      },
    },
  }
</script>

<style src="./PageExport.scss" lang="scss"/>
