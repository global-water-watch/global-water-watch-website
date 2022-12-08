<template>
  <Fragment>
    <client-only>
      <map-to-query-geometry
        v-if="areaType && mapboxQueryData"
        :mapbox-query-data="mapboxQueryData"
        :area-type="areaType"
        @found-geometry="onGeometry"
      />

      <PageHeroesDetailHero :title="pageContent.title">
        <p class="p">
          {{ pageContent.description }}
        </p>
        <ReservoirList v-if="reservoirs.length > 0" :reservoirs="reservoirs" />
        <p v-if="curatedByGlobalDamWatch" class="p">
          Some of these reservoirs were curated by <a href="https://www.globaldamwatch.org/grand/" target="_blank" rel="noopener">Global Dam Watch</a> (based on the GRAND database).
        </p>
      </PageHeroesDetailHero>

      <Loader :loading="reservoirsLoading" message="Depending on the amount of reservoirs in this area, it may take a while to load all data" />

      <ReservoirPageSection
        :reservoirs="reservoirs"
        :time-series="timeSeries"
        :area-type="areaType"
      />
    </client-only>
  </Fragment>
</template>

<script>
  import qs from 'qs'
  import { getPageContent } from '~/lib/shared-pages/page-content'

  export default {
    data: () => ({
      mapboxQueryData: null,
      areaType: null,
      reservoirs: [],
      reservoirsLoading: true,
      timeSeries: null,
      pageContent: {},
    }),

    computed: {
      cachedGeometry () {
        return this.$store.getters['zoomable-layers/cachedGeometry']
      },

      curatedByGlobalDamWatch () {
        return this.reservoirs.length > 0 && this.reservoirs.some(reservoir => reservoir.properties.grand_id)
      },
    },

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
        // If we have a cached geometry, use that
        if (this.cachedGeometry?.UID + '' === id + '') {
          console.log('using cached geometry')
          this.onGeometry(this.cachedGeometry.geometry)
        // Otherwise use mapbox to find the geometry
        } else {
          this.mapboxQueryData = {
            layer,
            id,
            zoom: parseInt(zoom),
            center: { lng: parseFloat(lng), lat: parseFloat(lat) },
          }
        }
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
            this.reservoirsLoading = false
          })
          .catch((err) => {
            console.error(err)
          })
      },
    },
  }
</script>
