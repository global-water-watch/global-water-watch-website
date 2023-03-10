<template>
  <div class="map-layers-panels">
    <div class="map-layers-panel">
      <h3>Select</h3>
      <v-radio-group
        v-model="activeLayerName"
        :disabled="disablePanelControls"
      >
        <v-radio
          v-for="layer in filteredLayers"
          :key="layer.name"
          :label="layer.name"
          :value="layer.name"
          @change="activateLayer(layer)"
        >
          <template #label>
            {{ layer.name }}
            <v-tooltip
              v-if="layer.description"
              ref="tooltip"
              v-model="layerTooltips[layer.name]"
              trigger="focus"
              bottom
              max-width="300px"
              content-class="map-layers-panel__tooltip"
            >
              <template #activator="{ attrs }">
                <v-btn icon v-bind="attrs" @click="$event => toggleTooltips($event, layer.name)">
                  <v-icon size="medium">
                    mdi-information-outline
                  </v-icon>
                </v-btn>
              </template>
              <!-- eslint-disable vue/no-v-html -->
              <p v-html="layer.description" />
              <!--eslint-enable-->
            </v-tooltip>
          </template>
        </v-radio>
      </v-radio-group>

      <v-btn
        v-if="showExperimentalFeatures"
        small
        :disabled="!mapReady || isDrawing"
        @click="onDrawButtonClick"
      >
        {{ drawButtonText }}
        <v-icon v-if="!isDrawing && !drawnFeatures.length" right>
          mdi-vector-polyline-edit
        </v-icon>
      </v-btn>
    </div>

    <div class="map-layers-panel">
      <h3>Visualize</h3>
      <v-radio-group
        v-model="activeLayerName"
        :disabled="disablePanelControls"
      >
        <v-radio
          :key="anomaliesLayer.name"
          :label="anomaliesLayer.name"
          :value="anomaliesLayer.name"
          @change="activateLayer(anomaliesLayer)"
        />
      </v-radio-group>
      <v-menu
        v-model="anomaliesDateMenu"
        :close-on-content-click="false"
        transition="scale-transition"
        offset-y
        max-width="290px"
        min-width="auto"
        :disabled="activeLayerName !== anomaliesLayer.name || disablePanelControls"
      >
        <template #activator="{ on, attrs }">
          <v-text-field
            v-model="anomaliesDate"
            prepend-icon="mdi-calendar"
            readonly
            v-bind="attrs"
            class="map-layers-panel__anomalies-date-input"
            :disabled="activeLayerName !== anomaliesLayer.name || disablePanelControls"
            v-on="on"
          />
        </template>
        <v-date-picker
          v-model="anomaliesDate"
          type="month"
          no-title
          scrollable
          :min="anomaliesLayer.firstLayerDate"
          :max="anomaliesLayer.lastLayerDate"
          @change="anomaliesDateMenu = false"
        />
      </v-menu>
    </div>
  </div>
</template>

<script>
  import qs from 'qs'
  import { LAYER_FADE_DURATION_MS } from '@/lib/constants'
  import reservoirs from '@/lib/layers/reservoirs'
  import basins from '@/lib/layers/basins'
  import administrativeRegions from '@/lib/layers/administrative-regions'
  import anomalies from '@/lib/layers/anomalies'

  export default {
    data () {
      return {
        reservoirLayer: Object.freeze({
          ...reservoirs,
          clickFn: this.onReservoirClick,
        }),
        layers: [
          Object.freeze({
            ...reservoirs,
            clickFn: this.onReservoirClick,
          }),
          Object.freeze({
            ...basins,
            clickFn: this.onBasinClick,
          }),
          Object.freeze({
            ...administrativeRegions,
            clickFn: this.onRegionClick,
          }),
        ],
        anomaliesLayer: Object.freeze({
          ...anomalies,
          clickFn: this.onAnomalyClick,
        }),
        isTransitioningLayer: false,
        layerTooltips: {
          Basins: false,
          'Administrative regions': false,
        },
        anomaliesDateMenu: false,
      }
    },

    computed: {
      mapReady () {
        return this.$store.getters['ui/mapReady']
      },
      activeLayerName: {
        get () {
          return this.$store.getters['ui/activeLayerName']
        },
        set (layerName) {
          this.$store.commit('ui/SET_ACTIVE_LAYER_NAME', layerName)
        },
      },
      showExperimentalFeatures () {
        return this.$store.getters['ui/showExperimentalFeatures']
      },
      filteredLayers () {
        return this.showExperimentalFeatures ? this.layers : this.layers.filter(layer => !layer.experimentalFeature)
      },
      drawnFeatures () {
        return this.$store.getters['drawn-geometry/drawnFeatures']
      },
      isDrawing () {
        return this.$store.getters['drawn-geometry/isDrawing']
      },
      drawButtonText () {
        if (this.isDrawing) { return 'Selecting reservoir' }
        if (this.drawnFeatures.length) { return 'View selected reservoir details' }
        return 'Select custom reservoir'
      },
      anomaliesDate: {
        get () {
          return this.$store.getters['anomalies-layers/anomaliesDate']
        },
        set (date) {
          this.$store.commit('anomalies-layers/SET_ANOMALIES_DATE', date)
        },
      },
      disablePanelControls () {
        return !this.mapReady || this.isDrawing || this.isTransitioningLayer
      },
    },

    watch: {
      // Set layer back to 'Reservoirs' when drawing
      isDrawing (isDrawing) {
        if (isDrawing) {
          const firstLayer = this.reservoirLayer
          this.clearAll()
          this.$store.commit(`${firstLayer.type}-layers/ADD_LAYER`, firstLayer)
          this.activeLayerName = firstLayer.name
        }
      },
    },

    created () {
      this.$store.commit('zoomable-layers/SET_CACHED_GEOMETRY', null)
    },

    mounted () {
      const initiallyReservoirLayer = this.reservoirLayer
      const initiallySelectedLayer = this.layers
        .find(({ name }) => name === this.activeLayerName)

      if (!this.anomaliesDate) {
        this.anomaliesDate = this.anomaliesLayer.lastLayerDate
      }
      document.addEventListener('click', this.hideTooltip)

      if (initiallyReservoirLayer && initiallySelectedLayer) {
        if (initiallySelectedLayer.type === 'zoomable') {
          this.$store.commit(`${initiallyReservoirLayer.type}-layers/ADD_LAYER`, initiallyReservoirLayer)
        }
        this.$store.commit(`${initiallySelectedLayer.type}-layers/ADD_LAYER`, initiallySelectedLayer)
      }
    },

    beforeDestroy () {
      document.removeEventListener('click', this.hideTooltip)
    },

    methods: {
      clearAll () {
        this.$store.commit('reservoir-layers/REMOVE_ALL_LAYERS')
        this.$store.commit('zoomable-layers/REMOVE_ALL_LAYERS')
        this.$store.commit('anomalies-layers/REMOVE_ALL_LAYERS')
      },

      clearMbDraw () {
        const { $mbDraw } = this.$root
        if (!$mbDraw) { return }
        $mbDraw.deleteAll()
        // Manually deleting from mb draw does not trigger
        // delete event, so deleting manually too
        this.$store.commit('drawn-geometry/SET_DRAWN_FEATURES', [])
      },

      activateLayer (layer) {
        this.isTransitioningLayer = true
        this.clearAll()
        this.clearMbDraw()
        if (layer.type === 'zoomable') {
          this.$store.commit(`${this.reservoirLayer.type}-layers/ADD_LAYER`, this.reservoirLayer)
        }
        this.$store.commit(`${layer.type}-layers/ADD_LAYER`, layer)
        setTimeout(() => {
          this.isTransitioningLayer = false
        }, LAYER_FADE_DURATION_MS)
      },

      onReservoirClick (evt) {
        // If we click on a reservoir while drawing, do nothing
        if (this.isDrawing) { return }
        const reservoir = evt.features?.[0]
        if (!reservoir) {
          return
        }
        const { fid } = reservoir.properties
        this.$router.push({ path: `/reservoir/${fid}` })
      },

      onBasinClick (evt) {
        const basin = evt.features?.[0]
        const UID = basin?.properties.HYBAS_ID
        if (!UID) { return }

        const { source, geometry } = basin
        this.$store.commit('zoomable-layers/SET_CACHED_GEOMETRY', Object.freeze({ UID, geometry }))

        const zoom = Math.round(evt.target.getZoom())
        const { lng, lat } = evt.target.getCenter()

        this.$router.push({ path: `/basin/${source}--${zoom}--${lng}--${lat}--${UID}` })
      },

      onRegionClick (evt) {
        const region = evt.features?.[0]
        const UID = region?.properties.shapeID
        if (!UID) { return }

        const { source, geometry } = region
        this.$store.commit('zoomable-layers/SET_CACHED_GEOMETRY', Object.freeze({ UID, geometry }))

        const zoom = Math.round(evt.target.getZoom())
        const { lng, lat } = evt.target.getCenter()

        this.$router.push({ path: `/boundary/${source}--${zoom}--${lng}--${lat}--${UID}` })
      },

      onAnomalyClick (evt) {
        const anomaly = evt.features?.[0]
        if (!anomaly) {
          return
        }
        this.$router.push({ path: `/reservoir/${anomaly.properties.point}` })
      },

      onDrawButtonClick () {
        if (this.drawnFeatures.length) {
          const coordinates = this.drawnFeatures.map(({ geometry }) => geometry.coordinates)
          const geometry = { type: 'MultiPolygon', coordinates }
          const query = qs.stringify(geometry)
          this.$router.push({ path: `/custom-selection/?${query}` })
        } else {
          const { $mbDraw } = this.$root
          if (!$mbDraw) { return }
          $mbDraw.changeMode('draw_polygon')
          // Manually setting the mode of mb draw does not trigger
          // modechange event, so setting it here manually too
          this.$store.commit('drawn-geometry/SET_IS_DRAWING', true)
        }
      },

      toggleTooltips (event, layer) {
        for (const layerName in this.layerTooltips) {
          if (layerName !== layer) {
            this.layerTooltips[layerName] = false
          }
        }
        this.layerTooltips[layer] = !this.layerTooltips[layer]
        event.stopPropagation()
      },

      hideTooltip (event) {
        // Don't hide tooltip if we click on a tooltip
        if (this.$refs.tooltip && event.target.tagName === 'P') {
          return
        }

        // Hide all tooltips
        Object.keys(this.layerTooltips).forEach((name) => {
          this.layerTooltips[name] = false
        })
      },
    },
  }
</script>

<style src="./MapLayersPanel.scss" lang="scss"/>
