import { LAYER_FADE_DURATION_MS } from '@/lib/constants'

export default {
  name: 'Reservoirs',
  type: 'reservoir',
  id: 'reservoirsv10',
  checked: true,
  promoteId: 'fid', // this id is used to identify the hover id in the map.
  description: `You can select multiple reservoirs by keeping Ctrl / Cmd (⌘) pressed when clicking on the reservoirs.
                To deselect a reservoir click on it again.
                To see the details for the selected reservoirs click on one of them without pressing Ctrl / Cmd (⌘).`,
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
          ['boolean', ['feature-state', 'selected'], false],
          1,
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
}
