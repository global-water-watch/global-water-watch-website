<template>
  <div class="map-wrapper">
    <client-only>
      <mapbox-map />
      <!--      <transition name="slide-in-right">-->
      <!--        <map-sidebar-->
      <!--          v-if="reservoir"-->
      <!--          :reservoir="reservoir"-->
      <!--        />-->
      <!--      </transition>-->
    </client-only>
  </div>
</template>

<script>
  export default {
    computed: {
      // reservoir () {
      //   return this.$store.getters['geo-data/selectedReservoir']
      // },
    },
  }
</script>

<style lang="scss">
  .map-wrapper {
    position: relative;
    width: 100%;
    height: 100%;
  }
</style>
