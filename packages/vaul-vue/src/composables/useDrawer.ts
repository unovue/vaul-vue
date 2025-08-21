import type { ComponentPublicInstance, EmitFn, MaybeRefOrGetter, StyleValue } from 'vue'
import type { DrawerRootEmits, DrawerRootProps } from '../types'

import { useWindowSize } from '@vueuse/core'
import { computed, nextTick, ref, shallowRef, toValue, watch } from 'vue'
import { dampen } from '../utils'
import { useEl } from './useEl'
import { useScroll } from './useScroll'
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
  const isPressing = ref(false)

  const {
    height: contentHeight,
    width: contentWidth,
    element: contentElement,
  } = useEl(drawerContentRef)

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

  const { addStack, popStack, updateDepths, clearCss } = useStacks(drawerOverlayRef, isDragging, windowSize)
  const { handleScroll, handleScrollStart, handleScrollEnd, startScroll } = useScroll(shouldMount)

  const { snapTo, closestSnapPointIndex, closestSnapPoint, activeSnapPointOffset, isSnappedToLastPoint, shouldDismiss } = useSnapPoints({
    snapPoints: props.snapPoints,
    contentSize,
    windowSize,
    offset,
  })

  const initialContainerStyle = computed(() => {
    return {
      translate: isVertical.value
        ? `0px calc(${offsetInitial.value}px + var(--vaul-inset) * ${-sideOffsetModifier.value})`
        : ` calc(${offsetInitial.value}px + var(--vaul-inset) * ${-sideOffsetModifier.value}) 0px`,

      transitionProperty: !isPressing.value ? 'translate, transform' : 'none',
      userSelect: isPressing.value ? 'none' : 'auto',
      touchAction: 'none',
    } satisfies StyleValue
  })

  // this causes watchers to trigger, but we don't actually want that
  const reset = () => {
    pointerStart.value = 0
    offset.value = 0
    offsetInitial.value = 0
    isDragging.value = false
  }

  const dismiss = async () => {
    open.value = false

    return new Promise<void>((resolve) => {
      contentElement.value?.addEventListener(
        'transitionend',
        () => {
          resolve()
          emit('dismiss')

          shouldMount.value = false
          reset()
          clearCss()
        },
        { once: true },
      )

      popStack()
      offsetInitial.value = windowSize.value * sideOffsetModifier.value
    })
  }

  const present = async () => {
    shouldMount.value = true
    open.value = true

    offsetInitial.value = windowSize.value * sideOffsetModifier.value
    await nextTick()

    if (contentElement.value) {
      addStack(contentElement.value)
    }

    return new Promise<void>((resolve) => {
      contentElement.value?.addEventListener(
        'transitionend',
        () => resolve(),
        { once: true },
      )

      offsetInitial.value = snapTo(0)! * sideOffsetModifier.value
    })
  }

  const onDragStart = (event: PointerEvent) => {
    isPressing.value = true
    pointerStart.value = isVertical.value ? event.clientY : event.clientX

    const target = event.target as HTMLElement | null
    const currentTarget = event.currentTarget as HTMLElement | null

    if (!target || !currentTarget)
      return

    handleScrollStart(event)
    target.setPointerCapture(event.pointerId)
  }

  const onDrag = (event: PointerEvent) => {
    if (!contentElement.value || !isPressing.value)
      return

    const clientPosition = isVertical.value ? event.clientY : event.clientX
    let dragDistance = pointerStart.value - clientPosition + startScroll.value
    const movingDirectionDrawerWantsToGo = dragDistance * sideOffsetModifier.value > 0

    isDragging.value = handleScroll(event, movingDirectionDrawerWantsToGo, toValue(side))
    if (!isDragging.value)
      return

    if (isSnappedToLastPoint.value && movingDirectionDrawerWantsToGo) {
      dragDistance = dampen(Math.abs(dragDistance)) * sideOffsetModifier.value
    }

    offset.value = activeSnapPointOffset.value * sideOffsetModifier.value + -dragDistance
    emit('drag', offset.value)
  }

  const onDragEnd = () => {
    isPressing.value = false
    isDragging.value = false

    if (shouldDismiss.value) {
      dismiss()
      return
    }

    handleScrollEnd()

    const result = snapTo(closestSnapPointIndex.value)! * sideOffsetModifier.value
    emit('snap', closestSnapPoint.value)

    offset.value = result
    offsetInitial.value = result
  }

  watch(offsetInitial, () => {
    if (!contentElement.value || offsetInitial.value === 0)
      return

    updateDepths(offsetInitial.value)
  })

  watch(offset, () => {
    if (!contentElement.value || offset.value === 0)
      return

    contentElement.value.style.translate = isVertical.value
      ? `0px calc(${offset.value}px + var(--vaul-inset) * ${sideOffsetModifier.value})`
      : ` calc(${offset.value}px + var(--vaul-inset) * ${sideOffsetModifier.value}) 0px`

    updateDepths(offset.value)
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
    handleOnly: props.handleOnly,
  }
}
