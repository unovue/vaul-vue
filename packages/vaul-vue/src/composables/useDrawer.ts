import type { ComponentPublicInstance, MaybeRefOrGetter, StyleValue } from 'vue'
import type { DrawerRootProps } from '../types'
import { useWindowSize } from '@vueuse/core'
import { computed, nextTick, onMounted, ref, shallowRef, toValue, watch } from 'vue'
import { dampen, range } from '../utils'
import { useEl } from './useEl'
import { useSnapPoints } from './useSnapPoints'

export type UseDrawerProps = {
  [K in keyof DrawerRootProps]-?: MaybeRefOrGetter<NonNullable<DrawerRootProps[K]>>
}

export function useDrawer(props: UseDrawerProps) {
  const open = ref(false)

  const drawerHandleRef = shallowRef<ComponentPublicInstance>()
  const drawerContentRef = shallowRef<ComponentPublicInstance>()
  const drawerOverlayRef = shallowRef<ComponentPublicInstance>()
  const drawerWrapperRef = shallowRef<HTMLElement>()

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
  } = useEl(drawerContentRef, open)

  const {
    element: overlayElement,
  } = useEl(drawerOverlayRef, open)

  const {
    width: windowWidth,
    height: windowHeight,
  } = useWindowSize()

  const isVertical = computed(() => side.value === 'top' || side.value === 'bottom')

  // this is because, for example
  // when side is set to right. we snap drawer to the left side of the screen
  // to move it out of screen to right, we have to add windowWidth and should be positive
  // positive translateY means it goes down, position translateX means it goes right
  const sideInitialOffsetModifier = computed(() => side.value === 'right' || side.value === 'bottom' ? 1 : -1)

  const windowSize = computed(() => isVertical.value ? windowHeight.value : windowWidth.value)
  const contentSize = computed(() => isVertical.value ? contentHeight.value : contentWidth.value)

  const { snapTo, closestSnapPointIndex, activeSnapPointOffset, isSnappedToLastPoint, shouldDismiss } = useSnapPoints({
    snapPoints: props.snapPoints,
    contentSize,
    windowSize,
    offset,
  })

  const initialContainerStyle = computed(() => {
    return {
      transform: isVertical.value ? `translateY(${offsetInitial.value}px)` : `translateX(${offsetInitial.value}px)`,
    } satisfies StyleValue
  })

  const dismiss = async () => {
    return new Promise<void>((resolve) => {
      contentElement.value?.addEventListener('transitionend', () => {
        if (props.setBackgroundColorOnScale) {
          document.body.style.backgroundColor = ''
        }

        open.value = false
        resolve()
      }, { once: true })

      offsetInitial.value = windowSize.value * sideInitialOffsetModifier.value
    })
  }

  const present = async () => {
    open.value = true

    if (props.setBackgroundColorOnScale) {
      document.body.style.backgroundColor = 'black'
    }

    offsetInitial.value = windowSize.value * sideInitialOffsetModifier.value
    await nextTick()

    return new Promise<void>((resolve) => {
      contentElement.value?.addEventListener('transitionend', () => {
        resolve()
      }, { once: true })

      offsetInitial.value = snapTo(0)! * sideInitialOffsetModifier.value
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
      const draggingInDirectionDrawerWantsToGo = dragDistance * sideInitialOffsetModifier.value > 0

      if (draggingInDirectionDrawerWantsToGo) {
        dragDistance = dampen(Math.abs(dragDistance)) * sideInitialOffsetModifier.value
      }
    }

    offset.value = activeSnapPointOffset.value * sideInitialOffsetModifier.value + -dragDistance
  }

  const onDragEnd = () => {
    isDragging.value = false

    if (shouldDismiss.value) {
      dismiss()
      return
    }

    const result = snapTo(closestSnapPointIndex.value)! * sideInitialOffsetModifier.value

    offset.value = result
    offsetInitial.value = result
  }

  const updateBackground = (_offset: number) => {
    if (!toValue(props.scaleBackground))
      return

    if (!drawerWrapperRef.value) {
      console.warn('Wrapper element is not found even though scaleBackground is set to true.')
      return
    }

    const off = windowSize.value - Math.abs(_offset)

    const depth = range(0, windowSize.value, 0, 14, off)
    const scale = range(0, windowSize.value, 1, 0.95, off)
    const borderRadius = range(0, windowSize.value, 0, 14, off)

    let cssText = `
      overflow: hidden;
      transform-origin: center top;
      transform: scale(${scale}) translate3d(0, calc(env(safe-area-inset-top) + ${depth}px), 0);
      border-radius: ${borderRadius.toFixed(0)}px;
    `

    if (!isDragging.value) {
      cssText += `transition: transform 0.5s cubic-bezier(0.32, 0.72, 0, 1), border-radius 0.5s cubic-bezier(0.32, 0.72, 0, 1);`
    }

    drawerWrapperRef.value
      .style
      .cssText = cssText
  }

  const updateOverlay = (_offset: number) => {
    if (overlayElement.value) {
      const off = windowSize.value - Math.abs(_offset)
      overlayElement.value.style.opacity = range(0, windowSize.value, 0, 1, off).toString()
    }
  }

  onMounted(() => {
    drawerWrapperRef.value = document.querySelector('[data-vaul-drawer-wrapper]') as HTMLElement | undefined
  })

  watch(offsetInitial, () => {
    updateOverlay(offsetInitial.value)
    updateBackground(offsetInitial.value)
  })

  watch(offset, () => {
    if (contentElement.value) {
      contentElement.value.style.transform = isVertical.value ? `translateY(${offset.value}px)` : `translateX(${offset.value}px)`
    }

    updateOverlay(offset.value)
    updateBackground(offset.value)
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
  }
}
