<template>
  <Fragment v-if="!$fetchState.pending && reservoir">
    <client-only>
      <PageHeroesDetailHero :title="title">
        <p class="p">
          {{ reservoirId }}
        </p>
      </PageHeroesDetailHero>

      <ReservoirPageSection
        :reservoirs="[reservoir]"
        :time-series="timeSeries"
        :satellite-image-url="satelliteImageUrl"
        :generating-satellite-image-url="generatingSatelliteImageUrl"
        @onSelectedTimeChanged="onSelectedTimeChanged"
      />
    </client-only>
  </Fragment>
</template>

<script>
  import debounce from 'lodash.debounce'

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
      generatingSatelliteImageUrl: false,
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
    },

    methods: {
      onSelectedTimeChanged (time) {
        debounce(async () => {
          this.generatingSatelliteImageUrl = true

          if (this.reservoir && time) {
            const dateTime = new Date(time).toISOString()

            const geometry = {
              ...this.reservoir,
              properties: {
                t: dateTime,
              },
            }

            const { url } = await this.$repo.image.getSatelliteImage(geometry)
            this.generatingSatelliteImageUrl = false

            if (url) {
              this.satelliteImageUrl = url
            }
          }
        }, DEBOUNCE_TIME)()
      },
    },
  }
</script>
