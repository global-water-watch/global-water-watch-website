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
        <v-row>
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
  export default {
    props: {
      isLoading: {
        type: Boolean,
        default: false,
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
      exportTimeSeries () {
        this.$emit('exportTimeSeries')
      },
      exportGeometry () {
        this.$emit('exportGeometry')
      },
    },
  }
</script>

<style src="./PageShare.scss" lang="scss"/>
