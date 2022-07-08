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
      <div>{{ areaType }}</div>
      <pre>{{ reservoirs }}</pre>
    </client-only>
  </Fragment>
</template>

<script>
  export default {
    data: () => ({
      layer: null,
      id: null,
      areaType: null,
      reservoirs: [],
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
    },

    methods: {
      onGeometry (geometry) {
        console.log(geometry)
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
