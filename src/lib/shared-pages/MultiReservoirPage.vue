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

      <ReservoirPageSection
        :reservoirs="reservoirs"
        :time-series="timeSeries"
      />
    </client-only>
  </Fragment>
</template>

<script>
  import qs from 'qs'
  import { getPageContent } from '~/lib/shared-pages/page-content'

  export default {
    data: () => ({
      layer: null,
      zoom: null,
      center: null,
      id: null,
      areaType: null,
      reservoirs: [],
      timeSeries: null,
      pageContent: {},
    }),

    mounted () {
      this.areaType = this.$route.path
        .split('/')
        .filter(Boolean)[0]
      this.pageContent = getPageContent({ areaType: this.areaType })

      const { slug } = this.$route.params
      if (slug) {
        this.doSlugBasedData(slug)
      } else {
        this.doQueryBasedData()
      }
    },

    methods: {
      doSlugBasedData (slug) {
        const [layer, zoom, lng, lat, id] = slug.split('--')
        this.layer = layer
        this.zoom = parseInt(zoom)
        this.center = { lng: parseFloat(lng), lat: parseFloat(lat) }
        this.id = id
      },

      doQueryBasedData () {
        const qstring = this.$route.fullPath.split('?')?.[1]
        const { type, coordinates } = qs.parse(qstring)
        if (!type || !coordinates) {
          console.warn('Invalid coordinates, can\'t fetch data')
          return
        }
        this.onGeometry({ type, coordinates })
      },

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
