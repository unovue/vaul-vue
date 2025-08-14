import type { MaybeRefOrGetter } from 'vue'
import { useWindowSize } from '@vueuse/core'
import { computed, ref, toValue, watch, watchEffect } from 'vue'
import { getClosestNumber, range } from '../utils'

export interface SnapPointsProps {
  snapPoints: number[]
  contentHeight: MaybeRefOrGetter<number>
  offset: MaybeRefOrGetter<number>
}

export function useSnapPoints({
  snapPoints,
  contentHeight,
  offset,
}: SnapPointsProps) {
  const activeSnapPoint = ref(0)

  const {
    width: windowWidth,
    height: windowHeight,
  } = useWindowSize()

  const points = computed(() => {
    const _contentHeight = toValue(contentHeight)

    if (snapPoints.length < 1) {
      return [range(0, windowHeight.value, 0, 1, _contentHeight)]
    }

    return snapPoints
  })

  const closestSnapPoint = computed(() => {
    const sheetOpenPositionY = toValue(contentHeight) + Math.abs(toValue(offset))
    const sheetPositionNormalized = range(0, windowHeight.value, 0, 1, sheetOpenPositionY)

    return getClosestNumber(points.value, sheetPositionNormalized)
  })

  const activeSnapPointOffset = computed(
    () => Math.abs((activeSnapPoint.value * windowHeight.value) - toValue(contentHeight))
  )

  const snapTo = (snapPointIndex: number) => {
    const point = points.value[snapPointIndex]
    const screenYOffset = point * windowHeight.value
    // const screenYOffset = range(0, 1, 0, windowHeight.value, point)

    const newOffset = screenYOffset - toValue(contentHeight)
    activeSnapPoint.value = point

    return -newOffset
  }

  return {
    points,
    snapTo,
    closestSnapPoint,
    activeSnapPoint,
    activeSnapPointOffset,
  }
}
