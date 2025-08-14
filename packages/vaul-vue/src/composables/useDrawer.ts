import type { ComponentPublicInstance, StyleValue } from 'vue'
import type { DrawerRootProps } from '../types'
import { useWindowSize } from '@vueuse/core'
import { computed, nextTick, ref, watch } from 'vue'
import { isVertical, range } from '../utils'
import { useElSize } from './useElSize'

export function useDrawer(props: DrawerRootProps) {
  const open = ref(false)

  const drawerContentRef = ref<ComponentPublicInstance>()
  const drawerHandleRef = ref<ComponentPublicInstance>()

  const pointerStart = ref(0)
  const heightOffset = ref(0)

  const drawerDirection = ref(props.direction!)
  const isDragging = ref(false)

  const {
    height: contentHeight,
  } = useElSize(drawerContentRef, open)

  const {
    width: windowWidth,
    height: windowHeight,
  } = useWindowSize()

  const directionMultiplier = computed(() => props.direction === 'bottom' || props.direction === 'right' ? 1 : -1)

  // should be from 0 to 1
  const snapPoints = computed(() => {
    if (props.snapPoints && props.snapPoints.length > 0) {
      return props.snapPoints
    }

    return [range(0, windowHeight.value, 0, 1, contentHeight.value)]
  })

  const containerStyle = computed(() => {
    return {
      transform: `translateY(${heightOffset.value}px)`,

      // for now leave like this
      transitionProperty: 'transform',
      transitionDuration: '500ms',
      transitionTimingFunction: 'cubic-bezier(0.32, 0.72, 0, 1)',
    } satisfies StyleValue
  })

  const onDragStart = (event: PointerEvent) => {
    isDragging.value = true
    pointerStart.value = isVertical(drawerDirection.value) ? event.clientY : event.clientX
  }

  const onDrag = (event: PointerEvent) => {
    if (!isDragging.value)
      return

    const dragDistance = pointerStart.value - (isVertical(drawerDirection.value) ? event.clientY : event.clientY) * directionMultiplier.value
    const normalized = range(0, windowHeight.value, 0, 1, dragDistance)

    console.warn(normalized)

    // pointerOffset.value = dragDistance
  }

  const onDragEnd = () => {
    isDragging.value = false
  }

  watch(open, async () => {
    if (!open.value)
      return

    heightOffset.value = windowHeight.value
    await nextTick()
    heightOffset.value = 0
  })

  // watch([() => open.value, () => contentHeight.value], () => {
  //   if (!open.value)
  //     return

  //   heightOffset.value = contentHeight.value
  // })

  // watch(contentHeight, () => {
  //   console.warn('content height change')
  // })

  return {
    onDragStart,
    onDrag,
    onDragEnd,
    drawerContentRef,
    drawerHandleRef,
    containerStyle,
    open,
  }
}
