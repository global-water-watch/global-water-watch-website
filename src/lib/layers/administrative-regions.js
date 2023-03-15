import { LAYER_FADE_DURATION_MS } from '@/lib/constants'
import { hoveredStyle } from '@/lib/map-hover-helpers'

export default {
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
        ...hoveredStyle(0, 0.75),
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
}
