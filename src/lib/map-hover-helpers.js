import { LAYER_FADE_DURATION_MS } from '@/lib/constants'

export const hoveredStyle = (initialOpacity, finalOpacity = null) => {
  const hoveredOpacity = finalOpacity || (initialOpacity + 0.2 > 1 ? 1 : initialOpacity + 0.2)

  return {
    'fill-opacity': [
      'case',
      ['boolean', ['feature-state', 'hover'], false],
      hoveredOpacity,
      initialOpacity,
    ],
    'fill-opacity-transition': {
      duration: LAYER_FADE_DURATION_MS,
    },
  }
}

export const mouseEnterGeometry = ({ map }) => {
  map.getCanvas().style.cursor = 'pointer'
}

export const mouseMoveGeometry = ({ evt, map, source, sourceLayer, currentHoveredFeatureId = null }) => {
  const newHoveredFeatureId = evt.features?.[0]?.id
  if (!newHoveredFeatureId || newHoveredFeatureId === currentHoveredFeatureId) {
    return
  }
  // Reset previous hover state
  if (currentHoveredFeatureId !== null) {
    map.setFeatureState(
      {
        source,
        sourceLayer,
        id: currentHoveredFeatureId,
      },
      { hover: false },
    )
  }
  // Set new hover state
  map.setFeatureState(
    {
      source,
      sourceLayer,
      id: newHoveredFeatureId,
    },
    { hover: true },
  )
}

export const mouseLeaveGeometry = ({ map, source, sourceLayer = null, currentHoveredFeatureId = null }) => {
  map.getCanvas().style.cursor = ''

  // Reset previous hover state
  if (currentHoveredFeatureId !== null) {
    map.setFeatureState(
      {
        source,
        sourceLayer,
        id: currentHoveredFeatureId,
      },
      { hover: false },
    )
  }
}
