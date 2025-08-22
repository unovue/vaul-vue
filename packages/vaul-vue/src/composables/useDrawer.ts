import type { ComponentPublicInstance, EmitFn, MaybeRefOrGetter, ModelRef, StyleValue } from 'vue'
import type { DrawerRootEmits, DrawerRootProps } from '../types'

import { useWindowSize } from '@vueuse/core'
import { computed, nextTick, onMounted, ref, shallowRef, toValue, watch } from 'vue'
import { dampen } from '../utils'
import { useEl } from './useEl'
import { useElements } from './useElement'
import { useScroll } from './useScroll'
import { useSnapPoints } from './useSnapPoints'
import { useStacks } from './useStacks'

export type UseDrawerPropsBase = {
  [K in keyof DrawerRootProps]-?: MaybeRefOrGetter<NonNullable<DrawerRootProps[K]>>
}

export type UseDrawerProps = {
  modelValueSnapIndex: ModelRef<number>
  modelValueOpen: ModelRef<boolean>
} & UseDrawerPropsBase

export function useDrawer(props: UseDrawerProps, emit: EmitFn<DrawerRootEmits>) {
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

  const { anyContains: anyNoDragContains } = useElements('[data-vaul-no-drag]', shouldMount)

  const isVertical = computed(() => props.side === 'top' || props.side === 'bottom')

  // this is because, for example
  // when side is set to right. we snap drawer to the left side of the screen
  // to move it out of screen to right, we have to add windowWidth and should be positive
  // positive translateY means it goes down, position translateX means it goes right
  const sideOffsetModifier = computed(() => props.side === 'right' || props.side === 'bottom' ? 1 : -1)

  const windowSize = computed(() => isVertical.value ? windowHeight.value : windowWidth.value)
  const contentSize = computed(() => isVertical.value ? contentHeight.value : contentWidth.value)

  const { addStack, popStack, updateDepths } = useStacks(drawerOverlayRef, isDragging, windowSize)
  const { handleScroll, handleScrollStart, handleScrollEnd, startScroll } = useScroll(shouldMount)

  const { getSnapOffset, closestSnapPointIndex, activeSnapPointOffset, isSnappedToLastPoint, shouldDismiss } = useSnapPoints({
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
    isDragging.value = false

    if (!props.keepMounted) {
      offset.value = 0
      offsetInitial.value = 0
    }
  }

  const dismiss = async () => {
    props.modelValueOpen.value = false
    emit('close')

    return new Promise<void>((resolve) => {
      contentElement.value?.addEventListener(
        'transitionend',
        () => {
          shouldMount.value = false
          emit('closed')
          reset()
          resolve()
        },
        { once: true },
      )

      popStack()
      offsetInitial.value = windowSize.value * sideOffsetModifier.value
    })
  }

  const present = async (snapIndex?: number) => {
    shouldMount.value = true
    props.modelValueOpen.value = true

    offsetInitial.value = windowSize.value * sideOffsetModifier.value

    await nextTick()
    emit('open')

    if (contentElement.value) {
      addStack(contentElement.value)
    }

    return new Promise<void>((resolve) => {
      contentElement.value?.addEventListener(
        'transitionend',
        () => {
          emit('opened')
          resolve()
        },
        { once: true },
      )

      offsetInitial.value = getSnapOffset(snapIndex ?? 0)! * sideOffsetModifier.value
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
    if (!contentElement.value || !isPressing.value || anyNoDragContains(event.target as HTMLElement))
      return

    const clientPosition = isVertical.value ? event.clientY : event.clientX
    let dragDistance = pointerStart.value - clientPosition + startScroll.value
    const movingDirectionDrawerWantsToGo = dragDistance * sideOffsetModifier.value > 0

    isDragging.value = handleScroll(event, movingDirectionDrawerWantsToGo, props.side)
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

    if (props.dismissible && shouldDismiss.value) {
      dismiss()
      return
    }

    handleScrollEnd()

    // Only update depths here because watch callbacks won't trigger if the values are the same
    if (props.modelValueSnapIndex.value === closestSnapPointIndex.value) {
      const targetOffset = getSnapOffset(props.modelValueSnapIndex.value)! * sideOffsetModifier.value

      if (props.scaleBackground) {
        updateDepths(targetOffset)
      }
    }
    else {
      props.modelValueSnapIndex.value = closestSnapPointIndex.value
    }
  }

  watch(props.modelValueSnapIndex, () => {
    offsetInitial.value = getSnapOffset(props.modelValueSnapIndex.value)! * sideOffsetModifier.value
    emit('snap', props.modelValueSnapIndex.value)
  })

  watch(offsetInitial, () => {
    if (!contentElement.value || offsetInitial.value === 0 || !props.scaleBackground)
      return

    updateDepths(offsetInitial.value)
  })

  watch(offset, () => {
    if (!contentElement.value || offset.value === 0)
      return

    contentElement.value.style.translate = isVertical.value
      ? `0px calc(${offset.value}px + var(--vaul-inset) * ${sideOffsetModifier.value})`
      : ` calc(${offset.value}px + var(--vaul-inset) * ${sideOffsetModifier.value}) 0px`

    if (props.scaleBackground) {
      updateDepths(offset.value)
    }
  })

  watch(props.modelValueOpen, () => {
    if (props.modelValueOpen.value) {
      present()
    }
    else {
      dismiss()
    }
  })

  onMounted(() => {
    offsetInitial.value = windowSize.value * sideOffsetModifier.value
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
    shouldMount,
    activeSnapPointOffset,
    handleOnly: toValue(props.handleOnly),
    dismissible: toValue(props.dismissible),
    keepMounted: toValue(props.keepMounted),
    side: computed(() => props.side), // We return computed because it's assigned to html
  }
}
