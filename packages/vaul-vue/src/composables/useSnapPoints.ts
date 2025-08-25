import type { MaybeRefOrGetter, ModelRef } from 'vue'
import { computed, toValue } from 'vue'
import { getClosestNumber, range } from '../utils'

export interface useSnapPointsProps {
  snapPoints: MaybeRefOrGetter<number[]>
  contentSize: MaybeRefOrGetter<number>
  windowSize: MaybeRefOrGetter<number>
  offset: MaybeRefOrGetter<number>
  modelValueSnapIndex: ModelRef<number>
}

export function useSnapPoints({
  snapPoints,
  contentSize,
  windowSize,
  offset,
  modelValueSnapIndex,
}: useSnapPointsProps) {
  const points = computed(() => {
    const _contentSize = toValue(contentSize)
    const _snapPoints = toValue(snapPoints)

    if (_snapPoints.length < 1) {
      return [range(0, toValue(windowSize), 0, 1, _contentSize)]
    }

    return _snapPoints.sort()
  })

  const closestSnapPoint = computed(() => {
    const _p = toValue(points)

    if (_p.length <= 1)
      return _p[0]

    // change offset to positive number to check against offset points.
    const offsetNormalized = range(0, toValue(windowSize), 1, 0, Math.abs(toValue(offset)))

    return getClosestNumber(points.value, offsetNormalized)
  })

  const closestSnapPointIndex = computed(
    () => points.value.findIndex(point => point === closestSnapPoint.value),
  )

  const activeSnapPointOffset = computed(() => {
    const wSize = toValue(windowSize)

    return wSize - (toValue(windowSize) * points.value[modelValueSnapIndex.value])
  })

  const isSnappedToLastPoint = computed(() => {
    if (points.value.length <= 1) {
      return true
    }

    return modelValueSnapIndex.value === points.value[points.value.length - 1]
  })

  const shouldDismiss = computed(() => {
    const div = 2
    const wSize = toValue(windowSize)

    const smallestPoint = points.value[0] / div
    const drawerVisible = wSize - Math.abs(toValue(offset))

    return drawerVisible < wSize * smallestPoint
  })

  const currentSnapOffset = computed(() => {
    const point = points.value[modelValueSnapIndex.value]

    if (point === undefined) {
      console.error('Snap point not found')
      return
    }

    const wSize = toValue(windowSize)
    return wSize - (wSize * point)
  })

  return {
    points,
    activeSnapPointOffset,
    closestSnapPoint,
    closestSnapPointIndex,
    shouldDismiss,
    isSnappedToLastPoint,
    currentSnapOffset,
  }
}
