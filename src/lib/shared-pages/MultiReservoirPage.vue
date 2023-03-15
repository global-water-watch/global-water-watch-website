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
        <ReservoirList :reservoirs="reservoirs" :is-loading="reservoirsLoading" />
        <p v-if="curatedByGlobalDamWatch" class="p">
          Some of these reservoirs were curated by <a href="https://www.globaldamwatch.org/grand/" target="_blank" rel="noopener">Global Dam Watch</a> (based on the GRAND database).
        </p>
      </PageHeroesDetailHero>

      <Loader
        :loading="reservoirsLoading"
        message="Depending on the amount of reservoirs in this area, it may take a while to load all data"
        class="multi-reservoir-page__loader"
      />

      <ReservoirPageSection
        :reservoirs="reservoirs"
        :time-series="timeSeries"
        :area-type="areaType"
        :geometry="geometry"
        :is-loading="reservoirsLoading"
        :is-loading-chart="timeSeriesLoading"
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
      reservoirs: {},
      reservoirsLoading: true,
      timeSeriesLoading: true,
      timeSeries: null,
      pageContent: {},
      geometry: null,
    }),

    computed: {
      cachedGeometry () {
        return this.$store.getters['zoomable-layers/cachedGeometry']
      },

      curatedByGlobalDamWatch () {
        return this.reservoirs?.features && this.reservoirs.features.some(reservoir => reservoir.properties.grand_id)
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

      async doQueryBasedData () {
        const qstring = this.$route.fullPath.split('?')?.[1]
        const { type, coordinates, ids } = qs.parse(qstring, { comma: true })
        if (ids) {
          await this.onReservoirIds(ids)
        } else {
          if (!type || !coordinates) {
            console.warn('Invalid coordinates, can\'t fetch data')
            return
          }
          this.onGeometry({ type, coordinates })
        }
      },

      onGeometry (geometry) {
        this.geometry = geometry
        this.getReservoirsOnGeometry(geometry)
        this.getTimeSeriesOnGeometry(geometry)
      },

      async onReservoirIds (ids) {
        this.reservoirs = await this.$repo.reservoir.getByIds(ids)
        this.reservoirsLoading = false

        this.timeSeries = await this.$repo.reservoir.getTimeSeriesByIds(ids, 'surface_water_area', 'monthly')
        this.timeSeriesLoading = false
      },

      getTimeSeriesOnGeometry (geometry) {
        this.$repo.reservoir.getTimeSeriesByGeometry(geometry, 'surface_water_area', 'monthly')
          .then((timeSeries) => {
            this.timeSeries = timeSeries
            this.timeSeriesLoading = false
          })
          .catch((err) => {
            console.error(err)
          })
      },

      getReservoirsOnGeometry (geometry) {
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

<style src="./MultiReservoirPage.scss" lang="scss" />
