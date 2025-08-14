import type { ComponentPublicInstance, StyleValue } from 'vue'
import type { DrawerRootProps } from '../types'
import { useWindowSize } from '@vueuse/core'
import { computed, nextTick, ref } from 'vue'
import { isVertical, range } from '../utils'
import { useElSize } from './useElSize'
import { useSnapPoints } from './useSnapPoints'

export function useDrawer(props: DrawerRootProps) {
  const open = ref(false)

  const drawerContentRef = ref<ComponentPublicInstance>()
  const drawerHandleRef = ref<ComponentPublicInstance>()

  const pointerStart = ref(0)
  const offset = ref(0)

  const drawerSide = ref(props.side!)
  const isDragging = ref(false)

  const {
    height: contentHeight,
    element: contentElement,
  } = useElSize(drawerContentRef, open)

  const {
    width: windowWidth,
    height: windowHeight,
  } = useWindowSize()

  const { snapTo, closestSnapPointIndex, activeSnapPointOffset } = useSnapPoints({
    snapPoints: props.snapPoints,
    contentHeight,
    offset,
  })

  const directionMultiplier = computed(() => props.side === 'bottom' || props.side === 'right' ? 1 : -1)

  const containerStyle = computed(() => {
    return {
      transform: `translateY(${offset.value}px)`,

      // for now leave like this
      transitionProperty: isDragging.value ? 'none' : 'transform',
      transitionDuration: '500ms',
      transitionTimingFunction: 'cubic-bezier(0.32, 0.72, 0, 1)',
    } satisfies StyleValue
  })

  const onDragStart = (event: PointerEvent) => {
    isDragging.value = true
    pointerStart.value = isVertical(drawerSide.value) ? event.clientY : event.clientX
  }

  const onDrag = (event: PointerEvent) => {
    if (!isDragging.value)
      return

    const dragDistance = (pointerStart.value - (isVertical(drawerSide.value) ? event.clientY : event.clientX)) * -1

    offset.value = activeSnapPointOffset.value + dragDistance
  }

  const onDragEnd = () => {
    isDragging.value = false

    offset.value = snapTo(closestSnapPointIndex.value)!
  }

  const dismiss = async () => {
    return new Promise((resolve) => {
      contentElement.value?.addEventListener('transitionend', () => {
        resolve(false)
      }, { once: true })

      offset.value = windowHeight.value
    })
  }

  const present = async () => {
    offset.value = windowHeight.value
    await nextTick()

    return new Promise(async (resolve) => {
      contentElement.value?.addEventListener('transitionend', () => {
        resolve(true)
      }, { once: true })

      offset.value = snapTo(0)!
    })
  }

  return {
    onDragStart,
    onDrag,
    onDragEnd,
    drawerContentRef,
    drawerHandleRef,
    containerStyle,
    open,
    dismiss,
    present,
  }
}
