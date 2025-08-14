import type { MaybeRefOrGetter } from 'vue'
import { useWindowSize } from '@vueuse/core'
import { computed, toValue, watch, watchEffect } from 'vue'
import { range } from '../utils'

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
    const sheetOpenPositionY = toValue(contentHeight) + toValue(offset)
  })

  const snapTo = (snapPointIndex: number) => {
    const point = points.value[snapPointIndex]
    const screenYOffset = range(0, 1, 0, windowHeight.value, point)

    const newOffset = screenYOffset - toValue(contentHeight)
    return newOffset
  }

  return {
    points,
    snapTo,
    closestSnapPoint,
  }
}
