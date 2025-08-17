import type { ComponentPublicInstance, EmitFn, MaybeRefOrGetter, StyleValue } from 'vue'
import type { DrawerRootEmits, DrawerRootProps } from '../types'

import { useWindowSize } from '@vueuse/core'
import { computed, nextTick, ref, shallowRef, toValue, watch, watchEffect } from 'vue'
import { dampen } from '../utils'
import { useEl } from './useEl'
import { useSnapPoints } from './useSnapPoints'
import { useStacks } from './useStacks'

export type UseDrawerProps = {
  [K in keyof DrawerRootProps]-?: MaybeRefOrGetter<NonNullable<DrawerRootProps[K]>>
}

export function useDrawer(props: UseDrawerProps, emit: EmitFn<DrawerRootEmits>) {
  const open = ref(toValue(props.defaultOpen) || false)
  const shouldMount = ref(toValue(props.defaultOpen) || false)

  const drawerHandleRef = shallowRef<ComponentPublicInstance>()
  const drawerContentRef = shallowRef<ComponentPublicInstance>()
  const drawerOverlayRef = shallowRef<ComponentPublicInstance>()

  const pointerStart = ref(0)

  // this is the offset we use when dragging
  const offset = ref(0)
  // this is the offset we use when mounting. Set using computed
  // so we don't have flickers on mount. It's also updated when snap happens
  const offsetInitial = ref(0)

  const side = ref(props.side)
  const isDragging = ref(false)

  const {
    height: contentHeight,
    width: contentWidth,
    element: contentElement,
  } = useEl(drawerContentRef, shouldMount)

  const {
    width: windowWidth,
    height: windowHeight,
  } = useWindowSize()

  const isVertical = computed(() => side.value === 'top' || side.value === 'bottom')

  // this is because, for example
  // when side is set to right. we snap drawer to the left side of the screen
  // to move it out of screen to right, we have to add windowWidth and should be positive
  // positive translateY means it goes down, position translateX means it goes right
  const sideOffsetModifier = computed(() => side.value === 'right' || side.value === 'bottom' ? 1 : -1)

  const windowSize = computed(() => isVertical.value ? windowHeight.value : windowWidth.value)
  const contentSize = computed(() => isVertical.value ? contentHeight.value : contentWidth.value)

  const { addStack, popStack, updateDepths } = useStacks(drawerOverlayRef, shouldMount, isDragging, windowSize, sideOffsetModifier)

  const { snapTo, closestSnapPointIndex, closestSnapPoint, activeSnapPointOffset, isSnappedToLastPoint, shouldDismiss } = useSnapPoints({
    snapPoints: props.snapPoints,
    contentSize,
    windowSize,
    offset,
  })

  const initialContainerStyle = computed(() => {
    return {
      translate: isVertical.value ? `0px ${offsetInitial.value}px` : `${offsetInitial.value}px 0px`,
    } satisfies StyleValue
  })

  const dismiss = async () => {
    return new Promise<void>((resolve) => {
      contentElement.value?.addEventListener('transitionend', () => {
        shouldMount.value = false
        emit('dismiss')
        resolve()
      }, { once: true })

      popStack()
      offsetInitial.value = windowSize.value * sideOffsetModifier.value
    })
  }

  const present = async () => {
    shouldMount.value = true
    offsetInitial.value = windowSize.value * sideOffsetModifier.value

    await nextTick()

    return new Promise<void>((resolve) => {
      contentElement.value?.addEventListener('transitionend', () => {
        resolve()
      }, { once: true })

      addStack(contentElement.value!)
      offsetInitial.value = snapTo(0)! * sideOffsetModifier.value
    })
  }

  const onDragStart = (event: PointerEvent) => {
    isDragging.value = true
    pointerStart.value = isVertical.value ? event.clientY : event.clientX
  }

  const onDrag = (event: PointerEvent) => {
    if (!isDragging.value || !contentElement.value)
      return

    const clientPosition = isVertical.value ? event.clientY : event.clientX
    let dragDistance = pointerStart.value - clientPosition

    if (isSnappedToLastPoint.value) {
      const draggingInDirectionDrawerWantsToGo = dragDistance * sideOffsetModifier.value > 0

      if (draggingInDirectionDrawerWantsToGo) {
        dragDistance = dampen(Math.abs(dragDistance)) * sideOffsetModifier.value
      }
    }

    offset.value = activeSnapPointOffset.value * sideOffsetModifier.value + -dragDistance
    emit('drag', offset.value)
  }

  const onDragEnd = () => {
    isDragging.value = false

    if (shouldDismiss.value) {
      dismiss()
      return
    }

    const result = snapTo(closestSnapPointIndex.value)! * sideOffsetModifier.value
    emit('snap', closestSnapPoint.value)

    offset.value = result
    offsetInitial.value = result
  }

  watch(offsetInitial, () => {
    if (!contentElement.value)
      return

    updateDepths(offsetInitial.value)
  })

  watch(offset, () => {
    if (!contentElement.value)
      return

    contentElement.value.style.translate = isVertical.value
      ? `0px ${offset.value}px`
      : `${offset.value}px 0px`

    updateDepths(offset.value)
  })

  watchEffect(() => {
    if (open.value) {
      present()
    }
    else {
      dismiss()
    }
  })

  return {
    onDragStart,
    onDrag,
    onDragEnd,
    drawerContentRef,
    drawerHandleRef,
    drawerOverlayRef,
    open,
    dismiss,
    present,
    isDragging,
    initialContainerStyle,
    side,
    shouldMount,
  }
}
