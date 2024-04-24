import { union } from '@turf/turf'

export function mergeFeatures (features) {
  return features.reduce((acc, feature) => {
    if (!acc) {
      return feature
    }

    return union(acc, feature)
  }, undefined)
}
