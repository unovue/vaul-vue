import type { ComponentPublicInstance, Ref } from 'vue'
import type { DrawerDirection } from './types'
import { isClient, useWindowSize } from '@vueuse/core'
import { computed, onMounted, ref, watch, watchEffect } from 'vue'
import { DRAG_CLASS, NESTED_DISPLACEMENT, NESTED_DISPLACEMENT_SCALE, refreshTransitionsCache, TRANSITIONS, VELOCITY_THRESHOLD } from './constants'
import { clamp, dampenValue, getDirectionMultiplier, getTranslate, getWrapper, isVertical, reset, set, transitionDurationToMs } from './helpers'
import { usePositionFixed } from './usePositionFixed'
import { useSnapPoints } from './useSnapPoints'

export interface WithoutFadeFromProps {
  /**
   * Array of numbers from 0 to 100 that corresponds to % of the screen a given snap point should take up.
   * Should go from least visible. Example `[0.2, 0.5, 0.8]`.
   * You can also use px values, which doesn't take screen height into account.
   */
  snapPoints?: (number | string)[]
  /**
   * Index of a `snapPoint` from which the overlay fade should be applied. Defaults to the last snap point.
   */
  fadeFromIndex?: number
}

export type DrawerRootProps = {
  /**
   * Number between 0 and 1 that determines when the drawer should be closed.
   * Example: threshold of 0.5 would close the drawer if the user swiped for 50% of the height of the drawer or more.
   * @default 0.25
   */
  closeThreshold?: number
  /**
   * @default false
   */
  shouldScaleBackground?: boolean
  /**
   * When `false` we don't change body's background color when the drawer is open.
   * @default true
   */
  setBackgroundColorOnScale?: boolean
  /**
   * Duration for which the drawer is not draggable after scrolling content inside of the drawer.
   * @default 500ms
   */
  scrollLockTimeout?: number
  /**
   * When `true`, don't move the drawer upwards if there's space, but rather only change it's height so it's fully scrollable when the keyboard is open
   */
  fixed?: boolean
  /**
   * When `false` dragging, clicking outside, pressing esc, etc. will not close the drawer.
   * Use this in combination with the `open` prop, otherwise you won't be able to open/close the drawer.
   * @default true
   */
  dismissible?: boolean
  /**
   * When `false` it allows to interact with elements outside of the drawer without closing it.
   * @default true
   */
  modal?: boolean
  /**
   * @default true when using `DrawerRoot`
   * @default false when using `DrawerRootNested`
   */
  nested?: boolean
  /**
   * Direction of the drawer. Can be `top` or `bottom`, `left`, `right`.
   * @default 'bottom'
   */
  direction?: DrawerDirection
  /**
   * When `true` the `body` doesn't get any styles assigned from Vaul
   */
  noBodyStyles?: boolean
  /**
   * When `true` only allows the drawer to be dragged by the `<Drawer.Handle />` component.
   * @default false
   */
  handleOnly?: boolean
  preventScrollRestoration?: boolean
} & WithoutFadeFromProps

export interface UseDrawerProps {
  open: Ref<boolean>
  snapPoints: Ref<(number | string)[] | undefined>
  dismissible: Ref<boolean>
  nested: Ref<boolean>
  fixed: Ref<boolean | undefined>
  modal: Ref<boolean>
  shouldScaleBackground: Ref<boolean | undefined>
  setBackgroundColorOnScale: Ref<boolean | undefined>
  activeSnapPoint: Ref<number | string | null | undefined>
  fadeFromIndex: Ref<number | undefined>
  closeThreshold: Ref<number>
  scrollLockTimeout: Ref<number>
  direction: Ref<DrawerDirection>
  noBodyStyles: Ref<boolean>
  preventScrollRestoration: Ref<boolean>
  handleOnly: Ref<boolean>
}

export interface DrawerRootEmits {
  (e: 'drag', percentageClosed: number): void
  (e: 'release', open: boolean): void
  (e: 'close'): void
  /**
   * Gets triggered after the open or close animation ends, it receives an `open` argument with the `open` state of the drawer by the time the function was triggered.
   * Useful to revert any state changes for example.
   */
  (e: 'animationEnd', open: boolean): void
}

export interface DialogEmitHandlers {
  emitDrag: (percentageClosed: number) => void
  emitRelease: (open: boolean) => void
  emitClose: () => void
  emitOpenChange: (open: boolean) => void
}

export interface DrawerHandleProps {
  preventCycle?: boolean
}

type DistributiveKeyOf<T> = T extends any ? keyof T : never

function usePropOrDefaultRef<T>(prop: Ref<T | undefined> | undefined, defaultRef: Ref<T>): Ref<T> {
  return prop && !!prop.value ? (prop as Ref<T>) : defaultRef
}

export function useDrawer(props: UseDrawerProps & DialogEmitHandlers) {
  const {
    emitDrag,
    emitRelease,
    emitClose,
    emitOpenChange,
    open,
    dismissible,
    nested,
    fixed,
    modal,
    shouldScaleBackground,
    setBackgroundColorOnScale,
    scrollLockTimeout,
    closeThreshold,
    activeSnapPoint,
    fadeFromIndex,
    direction,
    noBodyStyles,
    handleOnly,
    preventScrollRestoration,
  } = props

  const hasBeenOpened = ref(false)
  const isDragging = ref(false)
  const justReleased = ref(false)

  const openTime = ref<Date | null>(null)
  const dragStartTime = ref<Date | null>(null)
  const dragEndTime = ref<Date | null>(null)
  const lastTimeDragPrevented = ref<Date | null>(null)
  const isAllowedToDrag = ref(false)

  const nestedOpenChangeTimer = ref<number | null>(null)

  const pointerStart = ref(0)
  const keyboardIsOpen = ref(false)

  const wrapperRef = ref<HTMLElement | null>(null)
  const overlayRef = ref<ComponentPublicInstance | null>(null)
  const drawerRef = ref<ComponentPublicInstance | null>(null)

  const getOverlayEl = () => overlayRef.value?.$el as HTMLElement | undefined
  const getDrawerEl = () => drawerRef.value?.$el as HTMLElement | undefined

  const vertical = computed(() => isVertical(direction.value))

  const {
    width: windowWidth,
    height: windowHeight,
  } = useWindowSize()
  const windowSize = computed(() => (vertical.value ? windowHeight.value : windowWidth.value))
  const windowOppositeSize = computed(() => (vertical.value ? windowWidth.value : windowHeight.value))

  const drawerSizeRef = computed(() => {
    // Recalculate computed when window size changes
    // eslint-disable-next-line ts/no-unused-expressions
    windowSize.value

    // TODO: Not sure if this is reactive now...
    return getDrawerEl()?.getBoundingClientRect()[vertical.value ? 'height' : 'width'] ?? 0
  })

  const directionMultiplier = computed(() => getDirectionMultiplier(direction.value))
  const nestedDisplacement = computed(() => directionMultiplier.value * NESTED_DISPLACEMENT)

  watchEffect((onCleanup) => {
    if (shouldScaleBackground.value) {
      const wrapperEl = wrapperRef.value

      if (wrapperEl) {
        wrapperEl.dataset.vaulScale = 'true'
        wrapperEl.style.setProperty('--vaul-window-opposite-size', String(windowOppositeSize.value))
      }

      onCleanup(() => {
        if (wrapperEl) {
          delete wrapperEl.dataset.vaulScale
          wrapperEl.style.removeProperty('--vaul-window-opposite-size')
        }
      })
    }
  })

  const snapPoints = usePropOrDefaultRef(
    props.snapPoints,
    ref<(number | string)[] | undefined>(undefined),
  )

  const hasSnapPoints = computed(() => snapPoints && (snapPoints.value?.length ?? 0) > 0)

  const handleRef = ref<ComponentPublicInstance | null>(null)

  const {
    activeSnapPointIndex,
    onRelease: onReleaseSnapPoints,
    snapPointsOffset,
    onDrag: onDragSnapPoints,
    shouldFade,
    getPercentageClosed: getSnapPointsPercentageClosed,
  } = useSnapPoints({
    snapPoints,
    activeSnapPoint,
    drawerRef,
    fadeFromIndex,
    overlayRef,
    onSnapPointChange,
    direction,
  })

  function onSnapPointChange(activeSnapPointIndex: number, snapPointsOffset: number[]) {
    // Change openTime ref when we reach the last snap point to prevent dragging for 500ms incase it's scrollable.
    if (snapPoints.value && activeSnapPointIndex === snapPointsOffset.length - 1)
      openTime.value = new Date()
  }

  usePositionFixed({
    open,
    modal,
    nested,
    hasBeenOpened,
    noBodyStyles,
    preventScrollRestoration,
  })

  function getWrapperStyles(percentageClosed: number, _transition: boolean) {
    return {
      '--vaul-closed-percentage': String(clamp(0, percentageClosed, 1)),
      // 'transition': transition ? null : 'none',
    }
  }

  type WrapperStyleProp = DistributiveKeyOf<ReturnType<typeof getWrapperStyles>>

  function shouldDrag(el: EventTarget | null, isDraggingInDirection: boolean) {
    if (!el)
      return false

    let element = el as HTMLElement

    const drawerEl = getDrawerEl()
    const highlightedText = window.getSelection()?.toString()
    const swipeAmount = drawerEl ? getTranslate(drawerEl, direction.value) : null
    const date = new Date()

    if (element.hasAttribute('data-vaul-no-drag') || element.closest('[data-vaul-no-drag]'))
      return false

    if (direction.value === 'right' || direction.value === 'left')
      return true

    // Allow scrolling when animating
    if (openTime.value && date.getTime() - openTime.value.getTime() < 500)
      return false

    if (swipeAmount !== null) {
      if (direction.value === 'bottom' ? swipeAmount > 0 : swipeAmount < 0)
        return true
    }

    // Don't drag if there's highlighted text
    if (highlightedText && highlightedText.length > 0)
      return false

    // Disallow dragging if drawer was scrolled within `scrollLockTimeout`
    if (
      lastTimeDragPrevented.value
      && date.getTime() - lastTimeDragPrevented.value.getTime() < scrollLockTimeout.value
      && swipeAmount === 0
    ) {
      lastTimeDragPrevented.value = date
      return false
    }

    if (isDraggingInDirection) {
      lastTimeDragPrevented.value = date

      // We are dragging down so we should allow scrolling
      return false
    }

    // Keep climbing up the DOM tree as long as there's a parent
    while (element) {
      // Check if the element is scrollable
      if (element.scrollHeight > element.clientHeight) {
        if (element.scrollTop !== 0) {
          lastTimeDragPrevented.value = new Date()

          // The element is scrollable and not scrolled to the top, so don't drag
          return false
        }

        if (element.getAttribute('role') === 'dialog')
          return true
      }

      // Move up to the parent element
      element = element.parentNode as HTMLElement
    }

    // No scrollable parents not scrolled to the top found, so drag
    return true
  }

  function onPress(event: PointerEvent) {
    const drawerEl = getDrawerEl()

    if (!dismissible.value && !snapPoints.value)
      return

    if (drawerEl && !drawerEl.contains(event.target as Node))
      return

    isDragging.value = true
    dragStartTime.value = new Date()

    ;(event.target as HTMLElement).setPointerCapture(event.pointerId)
    pointerStart.value = vertical.value ? event.clientY : event.clientX
  }

  function onDrag(event: PointerEvent) {
    const drawerEl = getDrawerEl()

    if (!drawerEl)
      return

    // We need to know how much of the drawer has been dragged in percentages so that we can transform background accordingly
    if (isDragging.value) {
      const draggedDistance
        = (pointerStart.value - (vertical.value ? event.clientY : event.clientX)) * directionMultiplier.value

      const isDraggingInDirection = draggedDistance > 0

      // The 'closed' percentage as a fraction (0 to 1), where 1 is the closed position
      let percentageClosed = clamp(0, (draggedDistance * -1) / drawerSizeRef.value, 1)

      if (wrapperRef.value && overlayRef.value && shouldScaleBackground.value) {
        set(
          wrapperRef.value,
          getWrapperStyles(percentageClosed, false),
          true,
        )
      }

      // Pre condition for disallowing dragging in the close direction.
      const noCloseSnapPointsPreCondition = snapPoints.value && !dismissible.value && !isDraggingInDirection

      // Disallow dragging down to close when first snap point is the active one and dismissible prop is set to false.
      if (noCloseSnapPointsPreCondition && activeSnapPointIndex.value === 0)
        return

      // We need to capture last time when drag with scroll was triggered and have a timeout between
      const absDraggedDistance = Math.abs(draggedDistance)

      const snapPointPercentageClosed = getSnapPointsPercentageClosed(absDraggedDistance, isDraggingInDirection)

      if (snapPointPercentageClosed !== null)
        percentageClosed = snapPointPercentageClosed

      // Disallow close dragging beyond the smallest snap point.
      if (noCloseSnapPointsPreCondition && percentageClosed >= 1)
        return

      if (!isAllowedToDrag.value && !shouldDrag(event.target, isDraggingInDirection))
        return

      drawerEl.classList.add(DRAG_CLASS)

      // If shouldDrag gave true once after pressing down on the drawer, we set isAllowedToDrag to true and it will remain true until we let go, there's no reason to disable dragging mid way, ever, and that's the solution to it
      isAllowedToDrag.value = true

      set(drawerEl, {
        transition: 'none',
      })

      set(getOverlayEl(), {
        transition: 'none',
      })

      if (snapPoints.value)
        onDragSnapPoints({ draggedDistance })

      // Run this only if snapPoints are not defined or if we are at the last snap point (highest one)
      if (isDraggingInDirection && !snapPoints.value) {
        const dampenedDraggedDistance = dampenValue(draggedDistance)

        const translateValue = Math.min(dampenedDraggedDistance * -1, 0) * directionMultiplier.value
        set(drawerEl, {
          transform: vertical.value
            ? `translate3d(0, ${translateValue}px, 0)`
            : `translate3d(${translateValue}px, 0, 0)`,
        })

        return
      }

      if (
        shouldFade.value
        || (fadeFromIndex.value && activeSnapPointIndex.value === fadeFromIndex.value - 1)
      ) {
        emitDrag(percentageClosed)

        set(
          getOverlayEl(),
          {
            opacity: String(1 - percentageClosed),
            transition: 'none',
          },
          true,
        )
      }

      if (!snapPoints.value) {
        const newDrawerTranslate = absDraggedDistance * directionMultiplier.value

        set(drawerEl, {
          transform: vertical.value
            ? `translate3d(0, ${newDrawerTranslate}px, 0)`
            : `translate3d(${newDrawerTranslate}px, 0, 0)`,
        }, true)
      }
    }
  }

  function resetDrawer() {
    const drawerEl = getDrawerEl()

    if (!drawerEl)
      return

    const currentSwipeAmount = getTranslate(drawerEl, direction.value)

    set(drawerEl, {
      transform: 'translate3d(0, 0, 0)',
      transition: `transform ${TRANSITIONS.DURATION} ${TRANSITIONS.EASE}`,
    })

    set(getOverlayEl(), {
      transition: `opacity ${TRANSITIONS.DURATION} ${TRANSITIONS.EASE}`,
      opacity: '1',
    })

    // Don't reset background if swiped upwards
    if (wrapperRef.value && open.value && shouldScaleBackground.value && currentSwipeAmount && currentSwipeAmount > 0) {
      set(
        wrapperRef.value,
        getWrapperStyles(0, true),
        true,
      )
    }
  }

  function closeDrawer(fromWithin = false) {
    if (!drawerRef.value)
      return

    emitClose()

    if (!fromWithin)
      open.value = false

    window.setTimeout(() => {
      if (snapPoints.value) {
        activeSnapPoint.value = snapPoints.value[0]
      }
    }, transitionDurationToMs(TRANSITIONS.DURATION))
  }

  watchEffect((onCleanup) => {
    if (!open.value && shouldScaleBackground.value && isClient) {
      // Can't use `onAnimationEnd` as the component will be invisible by then
      const id = window.setTimeout(() => {
        // REVIEW: What does this even reset right now?
        reset(document.body, ['background'])
      }, 200)

      onCleanup(() => clearTimeout(id))
    }
  })

  let styleResetTimeoutId: number | null = null

  function clearStyleResetTimeout() {
    if (styleResetTimeoutId !== null) {
      clearTimeout(styleResetTimeoutId)
      styleResetTimeoutId = null
    }
  }

  watch(open, (newVal, _oldVal, onCleanup) => {
    refreshTransitionsCache()

    switch (newVal) {
      case true:
        openTime.value = new Date()
        break
      case false:
        closeDrawer()
        break
    }

    emitOpenChange(newVal)

    if (!newVal && shouldScaleBackground.value)
      return

    clearStyleResetTimeout()

    const wrapper = wrapperRef.value

    if (!wrapper)
      return

    if (setBackgroundColorOnScale.value && !noBodyStyles.value)
      document.body.style.background = 'black'

    set(wrapper, getWrapperStyles(0, true), true)

    onCleanup(() => {
      const propertiesToReset = {
        '--vaul-closed-percentage': true,
      } as const satisfies Record<WrapperStyleProp, true>

      reset(wrapper, Object.entries(propertiesToReset).map(([key]) => key))

      styleResetTimeoutId = window.setTimeout(() => {
        reset(document.body, ['background'])
      }, transitionDurationToMs(TRANSITIONS.DURATION))
    })
  }, { immediate: true })

  function onRelease(event: PointerEvent) {
    const drawerEl = getDrawerEl()

    if (!isDragging.value || !drawerEl)
      return

    drawerEl.classList.remove(DRAG_CLASS)
    isAllowedToDrag.value = false
    isDragging.value = false
    dragEndTime.value = new Date()

    const swipeAmount = getTranslate(drawerEl, direction.value)

    if (!shouldDrag(event.target, false) || !swipeAmount || Number.isNaN(swipeAmount))
      return

    if (dragStartTime.value === null)
      return

    const timeTaken = dragEndTime.value.getTime() - dragStartTime.value.getTime()
    const distMoved = pointerStart.value - (vertical.value ? event.clientY : event.clientX)
    const velocity = Math.abs(distMoved) / timeTaken
    const draggedDistance = distMoved * directionMultiplier.value

    if (velocity > 0.05) {
      // `justReleased` is needed to prevent the drawer from focusing on an input when the drag ends, as it's not the intent most of the time.
      justReleased.value = true

      window.setTimeout(() => {
        justReleased.value = false
      }, 200)
    }

    if (snapPoints.value) {
      onReleaseSnapPoints({
        draggedDistance,
        closeDrawer,
        velocity,
        dismissible: dismissible.value,
      })
      emitRelease(true)
      return
    }

    if (draggedDistance > 0) {
      resetDrawer()
      emitRelease(true)
      return
    }

    if (velocity > VELOCITY_THRESHOLD) {
      closeDrawer()
      emitRelease(false)
      return
    }

    const visibleDrawerSize = Math.min(
      drawerSizeRef.value,
      windowSize.value,
    )

    if (swipeAmount >= visibleDrawerSize * closeThreshold.value) {
      closeDrawer()
      emitRelease(false)
      return
    }

    emitRelease(true)
    resetDrawer()
  }

  onMounted(() => {
    wrapperRef.value = getWrapper()
  })

  function onNestedOpenChange(o: boolean) {
    const size = windowOppositeSize.value
    const scale = o ? (size - NESTED_DISPLACEMENT_SCALE) / size : 1
    const translate = o ? -1 * nestedDisplacement.value : 0

    if (nestedOpenChangeTimer.value)
      window.clearTimeout(nestedOpenChangeTimer.value)

    const drawerEl = getDrawerEl()

    set(drawerEl, {
      transition: `transform ${TRANSITIONS.DURATION} ${TRANSITIONS.EASE}`,
      transform: vertical.value
        ? `scale(${scale}) translate3d(0, ${translate}px, 0)`
        : `scale(${scale}) translate3d(${translate}px, 0, 0)`,
    })

    if (!o && drawerEl) {
      nestedOpenChangeTimer.value = window.setTimeout(() => {
        const translate = getTranslate(drawerEl, direction.value)
        set(drawerEl, {
          transition: 'none',
          transform: vertical.value
            ? `translate3d(0, ${translate}px, 0)`
            : `translate3d(${translate}px, 0, 0)`,
        })
      }, transitionDurationToMs(TRANSITIONS.DURATION))
    }
  }

  function onNestedDrag(percentageClosed: number) {
    if (percentageClosed < 0)
      return

    const size = windowOppositeSize.value
    const initialScale = (size - NESTED_DISPLACEMENT_SCALE) / size
    const newScale = initialScale + percentageClosed * (1 - initialScale)
    const displacement = nestedDisplacement.value
    const newTranslate = -1 * displacement + percentageClosed * displacement

    set(getDrawerEl(), {
      transform: vertical.value
        ? `scale(${newScale}) translate3d(0, ${newTranslate}px, 0)`
        : `scale(${newScale}) translate3d(${newTranslate}px, 0, 0)`,
      transition: 'none',
    })
  }

  function onNestedRelease(o: boolean) {
    const size = windowOppositeSize.value
    const scale = o ? (size - NESTED_DISPLACEMENT_SCALE) / size : 1
    const translate = o ? -1 * nestedDisplacement.value : 0

    if (o) {
      set(getDrawerEl(), {
        transition: `transform ${TRANSITIONS.DURATION} ${TRANSITIONS.EASE}`,
        transform: vertical.value
          ? `scale(${scale}) translate3d(0, ${translate}px, 0)`
          : `scale(${scale}) translate3d(${translate}px, 0, 0)`,
      })
    }
  }

  return {
    open,
    modal,
    keyboardIsOpen,
    hasBeenOpened,
    drawerRef,
    drawerSizeRef,
    overlayRef,
    handleRef,
    isDragging,
    dragStartTime,
    isAllowedToDrag,
    snapPoints,
    activeSnapPoint,
    hasSnapPoints,
    pointerStart,
    dismissible,
    snapPointsOffset,
    direction,
    shouldFade,
    fadeFromIndex,
    shouldScaleBackground,
    setBackgroundColorOnScale,
    onPress,
    onDrag,
    onRelease,
    closeDrawer,
    onNestedDrag,
    onNestedRelease,
    onNestedOpenChange,
    emitClose,
    emitDrag,
    emitRelease,
    emitOpenChange,
    nested,
    handleOnly,
    noBodyStyles,
  } as const
}
