<template>
  <div class="map-sidebar-new">
    <div class="map-sidebar-new__header">
      <div class="map-sidebar-new__header-title">
        <h3>{{ title }}</h3>
      </div>
    </div>
    <div class="map-sidebar-new__content">
      Active sources: {{ activeSources }}
      <ul class="map-sidebar-new__list">
        <li v-for="source in sources" :key="source.id">
          <v-checkbox
            v-model="activeSources"
            :label="source.id"
            :value="source.id"
          />
        </li>
      </ul>
      <br>
      Active layers: {{ activeLayers }}
      <ul class="map-sidebar-new__list">
        <li v-for="layer in layers" :key="layer.id">
          <v-checkbox
            v-model="activeLayers"
            :label="layer.id"
            :value="layer.id"
          />
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
  export default {
    props: {
      title: {
        type: String,
        default: 'Layers',
      },
    },

    computed: {
      layers () {
        return this.$store.getters['layers.store/getAllLayers']
      },

      sources () {
        return this.$store.getters['sources.store/getAllSources']
      },

      activeLayers: {
        get () {
          return this.$store.getters['layers.store/selectedLayers']
        },
        set (value) {
          this.$store.dispatch('layers.store/setSelectedLayers', value)
        },
      },

      activeSources: {
        get () {
          return this.$store.getters['sources.store/selectedSources']
        },
        set (value) {
          this.$store.dispatch('sources.store/setSelectedSources', value)
        },
      },
    },
  }
</script>

<style src="./MapSideBarNew.scss" lang="scss"/>
