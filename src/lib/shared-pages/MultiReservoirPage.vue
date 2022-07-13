<template>
  <Fragment>
    <client-only>
      <map-to-query-geometry
        v-if="id && layer && areaType"
        :id="id"
        :zoom="zoom"
        :center="center"
        :area-type="areaType"
        :layer="layer"
        @found-geometry="onGeometry"
      />

      <PageHeroesDetailHero :title="pageContent.title">
        <p class="p">
          {{ pageContent.description }}
        </p>
        <ReservoirList v-if="reservoirs.length > 0" :reservoirs="reservoirs" />
      </PageHeroesDetailHero>

      <Loader :loading="reservoirsLoading" message="Depending on the amount of reservoirs in this area, it may take a while to load all data" />

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
      zoom: null,
      center: null,
      id: null,
      areaType: null,
      reservoirs: [],
      reservoirsLoading: true,
      timeSeries: null,
      pageContent: {},
    }),

    mounted () {
      const { slug } = this.$route.params
      if (!slug) { return }
      const [layer, zoom, lng, lat, id] = slug.split('--')
      this.layer = layer
      this.zoom = parseInt(zoom)
      this.center = { lng: parseFloat(lng), lat: parseFloat(lat) }
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
            this.reservoirsLoading = false
          })
          .catch((err) => {
            console.error(err)
          })
      },
    },
  }
</script>
