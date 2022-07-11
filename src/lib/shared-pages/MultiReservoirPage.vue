<template>
  <Fragment>
    <client-only>
      <map-to-query-geometry
        v-if="id && layer && areaType"
        :id="id"
        :area-type="areaType"
        :layer="layer"
        @found-geometry="onGeometry"
      />

      <PageHeroesDetailHero :title="pageContent.title">
        <p class="p">
          {{ pageContent.description }}
        </p>
        <ReservoirList v-if="reservoirs" :reservoirs="reservoirs" />
      </PageHeroesDetailHero>

      <ReservoirPageSection
        :reservoirs="reservoirs"
        :time-series="timeSeries"
      />
    </client-only>
  </Fragment>
</template>

<script>
  import { getPageContent } from '~/lib/shared-pages/page-content'

  export default {
    data: () => ({
      layer: null,
      id: null,
      areaType: null,
      reservoirs: [],
      timeSeries: null,
      pageContent: {},
    }),

    mounted () {
      const { slug } = this.$route.params
      if (!slug) { return }
      const [layer, id] = slug.split('--')
      this.layer = layer
      this.id = id
      this.areaType = this.$route.path
        .split('/')
        .filter(Boolean)[0]

      this.pageContent = getPageContent({ areaType: this.areaType })
    },

    methods: {
      onGeometry (geometry) {
        this.$repo.reservoir.getByGeometry(geometry)
          .then((reservoirs) => {
            this.reservoirs = reservoirs
          })
          .catch((err) => {
            console.error(err)
          })
      },
    },
  }
</script>
