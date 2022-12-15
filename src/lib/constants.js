export const LAYER_FADE_DURATION_MS = 1000
export const MAP_ZOOM = 3
export const WORLD_CENTER_LONGITUDE = 18.4
export const WORLD_CENTER_LATITUDE = 23
export const MAP_CENTER = [WORLD_CENTER_LONGITUDE, WORLD_CENTER_LATITUDE]
export const MAPBOX_STYLE_LIGHT = 'mapbox://styles/mapbox/light-v9'
export const MAPBOX_STYLE_DARK = 'mapbox://styles/mapbox/dark-v9'
export const MAP_CUSTOM_ATTRIBUTIONS = [
  '<a href="https://www.hydrosheds.org/hydroatlas" target="_blank">HydroATLAS</a>',
  '<a href="https://www.globaldamwatch.org/grand" target="_blank">Global Dam Watch</a>',
]
export const RESERVOIR_VIDEOS = [
  {
    id: 90084,
    type: 'Feature',
    properties: {
      url: 'https://storage.googleapis.com/global-water-watch-public/videos/90084ee-export-video11873777431199846688.mp4',
    },
    geometry: {
      geodesic: false,
      type: 'Polygon',
      coordinates: [
        [
          [99.95570668670165, 23.28894310470643],
          [100.76882855058477, 23.28894310470643],
          [100.76882855058477, 22.527169772037496],
          [99.95570668670165, 22.527169772037496],
          [99.95570668670165, 23.28894310470643],
        ],
      ],
    },
  },
]
