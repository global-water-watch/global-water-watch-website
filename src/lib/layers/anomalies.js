import { LAYER_FADE_DURATION_MS } from '@/lib/constants'

export default {
  name: 'Anomalies',
  type: 'anomalies',
  firstLayerDate: '1995-01',
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
}
