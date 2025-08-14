import type { MaybeRefOrGetter } from 'vue'
import { useWindowSize } from '@vueuse/core'
import { computed, toValue, watch } from 'vue'
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

    return [snapPoints]
  })

  const closestSnapPoint = computed(() => {
    const sheetOpenPositionY = toValue(contentHeight) + toValue(offset)
    console.warn(sheetOpenPositionY)
  })

  const snapTo = (snapPointIndex: number) => {

  }

  watch(points, () => {
    console.warn(points)
  }, {
    immediate: true,
  })

  return {
    points,
    snapTo,
    closestSnapPoint,
  }
}
