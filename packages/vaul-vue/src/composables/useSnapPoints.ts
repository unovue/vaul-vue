import type { MaybeRefOrGetter } from 'vue'
import { computed, ref, toValue } from 'vue'
import { getClosestNumber, range } from '../utils'

export interface useSnapPointsProps {
  snapPoints: MaybeRefOrGetter<number[]>
  contentSize: MaybeRefOrGetter<number>
  windowSize: MaybeRefOrGetter<number>
  offset: MaybeRefOrGetter<number>
}

export function useSnapPoints({
  snapPoints,
  contentSize,
  windowSize,
  offset,
}: useSnapPointsProps) {
  const activeSnapPoint = ref(0)

  const points = computed(() => {
    const _contentSize = toValue(contentSize)
    const _snapPoints = toValue(snapPoints)

    if (_snapPoints.length < 1) {
      return [range(0, toValue(windowSize), 0, 1, _contentSize)]
    }

    return _snapPoints
  })

  const closestSnapPoint = computed(() => {
    const _p = toValue(snapPoints)

    if (_p.length <= 1)
      return _p[0]

    // change offset to positive number to check against offset points.
    const offsetNormalized = range(0, toValue(windowSize), 1, 0, -toValue(offset))

    return getClosestNumber(points.value, offsetNormalized)
  })

  const closestSnapPointIndex = computed(
    () => points.value.findIndex(point => point === closestSnapPoint.value),
  )

  const activeSnapPointOffset = computed(() => {
    const wSize = toValue(windowSize)

    return wSize - (toValue(windowSize) * activeSnapPoint.value)
  })

  const snapTo = (snapPointIndex: number) => {
    const point = points.value[snapPointIndex]

    if (!point) {
      console.error('Snap point not found')
      return
    }

    const wSize = toValue(windowSize)

    activeSnapPoint.value = point
    return wSize - (wSize * point)
  }

  return {
    points,
    snapTo,
    activeSnapPoint,
    activeSnapPointOffset,
    closestSnapPoint,
    closestSnapPointIndex,
  }
}
