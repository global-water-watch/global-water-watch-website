import { union } from '@turf/turf'

export function mergeFeatures (features) {
  if (!features?.length) {
    return []
  }

  return features.reduce((acc, feature) => union(acc, feature), features[0])
}
