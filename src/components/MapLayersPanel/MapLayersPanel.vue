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

  export default {
    data () {
      return {
        reservoirLayer: Object.freeze({
          name: 'Reservoirs',
          type: 'reservoir',
          id: 'reservoirsv10',
          checked: true,
          promoteId: 'fid', // this id is used to identify the hover id in the map.
          source: {
            type: 'vector',
            url: 'mapbox://global-water-watch.reservoirs-v10',
          },
          styles: [
            {
              type: 'fill',
              paint: {
                'fill-color': '#8fdfef',
                'fill-opacity': [
                  'case',
                  ['boolean', ['feature-state', 'hover'], false],
                  0.75,
                  0.4,
                ],
                'fill-opacity-transition': {
                  duration: LAYER_FADE_DURATION_MS,
                },
              },
            },
            {
              type: 'line',
              paint: {
                'line-color': '#8fdfef',
                'line-width': 0.8,
              },
            },
          ],
          clickFn: this.onReservoirClick,
        }),
        layers: [
          Object.freeze({
            name: 'Reservoirs',
            type: 'reservoir',
            id: 'reservoirsv10',
            checked: true,
            promoteId: 'fid', // this id is used to identify the hover id in the map.
            source: {
              type: 'vector',
              url: 'mapbox://global-water-watch.reservoirs-v10',
            },
            styles: [
              {
                type: 'fill',
                paint: {
                  'fill-color': '#8fdfef',
                  'fill-opacity': [
                    'case',
                    ['boolean', ['feature-state', 'hover'], false],
                    0.75,
                    0.4,
                  ],
                  'fill-opacity-transition': {
                    duration: LAYER_FADE_DURATION_MS,
                  },
                },
              },
              {
                type: 'line',
                paint: {
                  'line-color': '#8fdfef',
                  'line-width': 0.8,
                },
              },
            ],
            clickFn: this.onReservoirClick,
          }),
          Object.freeze({
            name: 'Basins',
            type: 'zoomable',
            promoteId: 'HYBAS_ID', // this id is used to identify the hover id in the map.
            experimentalFeature: false, // disable this feature when you want to display it default
            description: `You can select reservoirs by basin.
                          A basin is a topographic region where all water drains to the same point.
                          The polygons that you can select originate from the
                          <a href="https://www.hydrosheds.org/products/hydrobasins" target="_blank" rel="noopener noreferrer">HydroBASINS</a> dataset,
                          a global covering set of nested basins.`,
            layers: [
              {
                id: 'BasinATLAS_v10_lev01',
                zoomLevels: [0, 1, 2],
                source: {
                  type: 'vector',
                  url: 'mapbox://global-water-watch.BasinATLAS_v10_lev01',
                },
              },
              {
                id: 'BasinATLAS_v10_lev02',
                zoomLevels: [3],
                source: {
                  type: 'vector',
                  url: 'mapbox://global-water-watch.BasinATLAS_v10_lev02',
                },
              },
              {
                id: 'BasinATLAS_v10_lev03',
                zoomLevels: [4],
                source: {
                  type: 'vector',
                  url: 'mapbox://global-water-watch.BasinATLAS_v10_lev03',
                },
              },
              {
                id: 'BasinATLAS_v10_lev04',
                zoomLevels: [5],
                source: {
                  type: 'vector',
                  url: 'mapbox://global-water-watch.BasinATLAS_v10_lev04',
                },
              },
              {
                id: 'BasinATLAS_v10_lev05',
                zoomLevels: [6],
                source: {
                  type: 'vector',
                  url: 'mapbox://global-water-watch.BasinATLAS_v10_lev05',
                },
              },
              {
                id: 'BasinATLAS_v10_lev06',
                zoomLevels: [
                  7,
                  // Extra zoom levels so it always stays active
                  8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22,
                ],
                source: {
                  type: 'vector',
                  url: 'mapbox://global-water-watch.BasinATLAS_v10_lev06',
                },
              },
              // Basins above zoom level 6 are currently too expensive to use
              // {
              //   id: 'BasinATLAS_v10_lev10',
              //   zoomLevels: [8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22],
              //   source: {
              //     type: 'vector',
              //     url: 'mapbox://global-water-watch.BasinATLAS_v10_lev10',
              //   },
              // },
            ],
            styles: [
              {
                type: 'fill',
                paint: {
                  'fill-color': '#8fdfef',
                  'fill-opacity': [
                    'case',
                    ['boolean', ['feature-state', 'hover'], false],
                    0.75,
                    0,
                  ],
                  'fill-opacity-transition': {
                    duration: LAYER_FADE_DURATION_MS,
                  },
                },
              },
              {
                type: 'line',
                paint: {
                  'line-color': '#8fdfef',
                  'line-width': 0.8,
                  'line-opacity': 0,
                  'line-opacity-transition': {
                    duration: LAYER_FADE_DURATION_MS,
                  },
                },
              },
            ],
            clickFn: this.onBasinClick,
          }),
          Object.freeze({
            name: 'Administrative regions',
            type: 'zoomable',
            attribution: '<a href="https://www.geoboundaries.org" target="_blank" rel="noopener noreferrer">geoBoundaries</a>', // this id is used to identify the hover id in the map.
            promoteId: 'shapeID', // this id is used to identify the hover id in the map.
            experimentalFeature: false, // disable this feature when you want to display it default
            description: `You can select the reservoirs by administrative region.
                          These nested regions (e.g. country, province, municipality) originate from the
                          <a href="https://www.geoboundaries.org/" target="_blank" rel="noopener noreferrer">geoBoundaries</a> dataset.
                          The Comprehensive Global Administrative Zones
                          (<a href="https://www.geoboundaries.org/downloadCGAZ.html" target="_blank" rel="noopener noreferrer">CGAZ</a>) variant is used.
                          This dataset relies on the US Department of State definitions for contested areas.`,
            layers: [
              {
                id: 'geoBoundariesCGAZ_ADM0',
                zoomLevels: [0, 1, 2, 3],
                source: {
                  type: 'vector',
                  url: 'mapbox://global-water-watch.geoBoundariesCGAZ_ADM0',
                },
              },
              {
                id: 'geoBoundariesCGAZ_ADM1',
                zoomLevels: [4, 5, 6, 7],
                source: {
                  type: 'vector',
                  url: 'mapbox://global-water-watch.geoBoundariesCGAZ_ADM1',
                },
              },
              {
                id: 'geoBoundariesCGAZ_ADM2',
                zoomLevels: [8, 9, 10, 11, 12],
                source: {
                  type: 'vector',
                  url: 'mapbox://global-water-watch.geoBoundariesCGAZ_ADM2',
                },
              },
            ],
            styles: [
              {
                type: 'fill',
                paint: {
                  'fill-color': '#d78200',
                  'fill-opacity': [
                    'case',
                    ['boolean', ['feature-state', 'hover'], false],
                    0.75,
                    0,
                  ],
                  'fill-opacity-transition': {
                    duration: LAYER_FADE_DURATION_MS,
                  },
                },
              },
              {
                type: 'line',
                paint: {
                  'line-color': '#d78200',
                  'line-width': 0.8,
                  'line-opacity': 0,
                  'line-opacity-transition': {
                    duration: LAYER_FADE_DURATION_MS,
                  },
                },
              },
            ],
            clickFn: this.onRegionClick,
          }),
        ],
        anomaliesLayer: Object.freeze({
          name: 'Anomalies',
          type: 'anomalies',
          firstLayerDate: '1995-01',
          lastLayerDate: this.$config.lastAnomalyLayerDate,
          styles: [
            {
              type: 'circle',
              paint: {
                'circle-radius': [
                  'interpolate',
                  ['linear'],
                  ['zoom'],
                  0,
                  [
                    'interpolate',
                    [
                      'cubic-bezier',
                      0.1,
                      0.8,
                      0.9,
                      1,
                    ],
                    ['get', 'area'],
                    0,
                    1,
                    5030901200,
                    10,
                  ],
                  22,
                  [
                    'interpolate',
                    [
                      'cubic-bezier',
                      0.1,
                      0.8,
                      0.9,
                      1,
                    ],
                    ['get', 'area'],
                    0,
                    5,
                    5030901200,
                    50,
                  ],
                ],
                'circle-color': [
                  'interpolate',
                  ['linear'],
                  ['get', 'anomaly'],
                  -2,
                  'hsl(0, 80%, 80%)',
                  -1,
                  'hsla(0, 40%, 40%, 0.8)',
                  0,
                  'hsla(100, 10%, 10%, 0.2)',
                  1,
                  'hsla(215, 40%, 40%, 0.8)',
                  2,
                  'hsl(215, 80%, 80%)',
                ],
                'circle-opacity': 0,
                'circle-opacity-transition': {
                  duration: LAYER_FADE_DURATION_MS,
                },
              },
            },
          ],
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
