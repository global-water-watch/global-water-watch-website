import { LAYER_FADE_DURATION_MS } from '@/lib/constants'
import { hoveredStyle } from '@/lib/map-hover-helpers'

export default {
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
        ...hoveredStyle(0, 0.75),
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
}
