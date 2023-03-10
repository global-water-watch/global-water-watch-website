import { hoveredStyle } from '@/lib/map-hover-helpers'

export default {
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
        ...hoveredStyle(0.4, 0.75),
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
}
