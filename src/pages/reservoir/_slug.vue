<template>
  <Fragment>
    <client-only>
      <PageHeroesDetailHero :title="title" :is-loading="isLoading">
        <v-skeleton-loader
          v-if="isLoading"
          class="reservoir__skeleton-loader"
          type="text"
        />
        <Fragment v-else>
          <p class="p">
            {{ reservoirId }}
          </p>
          <p v-if="reservoir.properties.grand_id" class="p">
            This reservoir was curated by <a href="https://www.globaldamwatch.org/grand/" target="_blank" rel="noopener">Global Dam Watch</a> (based on the GRAND database).
          </p>
          <v-alert
            v-if="isLargeReservoir"
            outlined
            type="warning"
            dense
            text
            prominent
            color="orange lighten-1"
            class="reservoir__large-reservoir-alert"
          >
            <strong>Large reservoir</strong>
            <p>
              This website shows small (10–100 ha) and medium size reservoirs (> 100 ha). We do not show 479 of the largest reservoirs.
              Our algorithms can estimate the surface areas of a reservoir from partial observations.
              The larger reservoirs are well measured using in-situ measurements and partial observations of surface area are less indicative of the state of the full reservoir.
            </p>
          </v-alert>
        </Fragment>
      </PageHeroesDetailHero>

      <ReservoirPageSection
        :reservoirs="[reservoir]"
        :time-series="timeSeries"
        :satellite-image-url="satelliteImageUrl"
        :generating-satellite-image-url="generatingSatelliteImageUrl"
        :show-comparison-map="true"
        :show-feedback-form="true"
        :is-loading="isLoading"
        @onSelectedTimeChanged="onSelectedTimeChanged"
      />
    </client-only>
  </Fragment>
</template>

<script>
  import debounce from 'lodash.debounce'
  import { LARGE_RESERVOIR_IDS } from '~/lib/constants'

  const DEBOUNCE_TIME = 1000

  export default {
    data: () => ({
      reservoir: {},
      timeSeries: {
        xAxis: [],
        yAxis: [],
        series: [],
      },
      satelliteImageUrl: '',
      generatingSatelliteImageUrl: {
        loading: {
          state: false,
          message: '',
        },
        error: {
          state: false,
          message: '',
        },
      },
    }),

    async fetch () {
      const { slug } = this.$route.params
      if (!slug) { return }

      try {
        [this.reservoir, this.timeSeries] = await Promise.all([
          this.$repo.reservoir.getById(slug),
          this.$repo.reservoir.getTimeSeriesById(slug),
        ])
      } catch (e) {
        console.error(e)
      }
    },

    fetchOnServer: false,

    computed: {
      title () {
        return this.reservoir?.properties?.name ?? 'Nameless reservoir'
      },

      reservoirId () {
        return this.reservoir.id ? `#${this.reservoir.id}` : ''
      },

      isLoading () {
        return this.$fetchState.pending || !this.reservoir
      },

      isLargeReservoir () {
        return LARGE_RESERVOIR_IDS.includes(this.reservoir.id)
      },
    },

    methods: {
      onSelectedTimeChanged (time) {
        debounce(async () => {
          this.generatingSatelliteImageUrl.loading.state = true
          this.generatingSatelliteImageUrl.loading.message = 'Generating satellite image from the selected data point. ' +
            'This feature is not optimized for larger reservoirs'

          if (this.reservoir && time) {
            const geometry = {
              ...this.reservoir,
              properties: {
                t: time,
              },
            }

            const data = await this.$repo.image.getSatelliteImage(geometry)

            if (data.url) {
              this.generatingSatelliteImageUrl.error.state = false
              this.generatingSatelliteImageUrl.loading.state = false
              this.satelliteImageUrl = data.url
            } else if (data.error) {
              this.generatingSatelliteImageUrl.error.state = true
              this.generatingSatelliteImageUrl.loading.state = false
              this.generatingSatelliteImageUrl.error.message = `${data.error} ${this.reservoirId}`
            } else {
              this.generatingSatelliteImageUrl.error.state = false
              this.generatingSatelliteImageUrl.loading.state = false
            }
          }
        }, DEBOUNCE_TIME)()
      },
    },
  }
</script>

<style src="./_slug.scss" lang="scss" />
