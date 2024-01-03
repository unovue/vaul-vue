import { computed, ref, watch, type ComponentPublicInstance } from 'vue'
import { set, reset, getTranslateY, dampenValue } from './helpers'
import { TRANSITIONS, VELOCITY_THRESHOLD } from './constants'
import { useSnapPoints } from './useSnapPoints'
import { usePositionFixed } from './usePositionFixed'
import type { Ref } from 'vue'

const CLOSE_THRESHOLD = 0.25

const SCROLL_LOCK_TIMEOUT = 100

const BORDER_RADIUS = 8

const NESTED_DISPLACEMENT = 16

const WINDOW_TOP_OFFSET = 26

const DRAG_CLASS = 'vaul-dragging'

export interface WithFadeFromProps {
  snapPoints: (number | string)[]
  fadeFromIndex: number
}

export interface WithoutFadeFromProps {
  snapPoints?: (number | string)[]
  fadeFromIndex?: never
}

export type DialogProps = {
  activeSnapPoint?: number | string | null
  open?: boolean
  closeThreshold?: number
  onOpenChange?: (open: boolean) => void
  shouldScaleBackground?: boolean
  scrollLockTimeout?: number
  fixed?: boolean
  dismissible?: boolean
  onDrag?: (event: PointerEvent, percentageDragged: number) => void
  onRelease?: (event: PointerEvent, open: boolean) => void
  modal?: boolean
  nested?: boolean
  onClose?: () => void
} & (WithFadeFromProps | WithoutFadeFromProps)

export type Drawer = {
  isOpen: Ref<boolean>
  hasBeenOpened: Ref<boolean>
  isVisible: Ref<boolean>
  drawerRef: Ref<ComponentPublicInstance | null>
  overlayRef: Ref<ComponentPublicInstance | null>
  isDragging: Ref<boolean>
  dragStartTime: Ref<Date>
  isAllowedToDrag: Ref<boolean>
  snapPoints: Ref<(number | string)[] | undefined>
  activeSnapPoint: Ref<number | string | null>
  pointerStartY: Ref<number>
  dismissible: Ref<boolean>
  drawerHeightRef: Ref<number>
  snapPointsOffset: Ref<number[]>
  handlePointerDown: (event: PointerEvent) => void
  handlePointerMove: (event: PointerEvent) => void
  handlePointerUp: (event: PointerEvent) => void
  closeDrawer: () => void
}

const isOpen = ref(false)
const hasBeenOpened = ref(false)
const isVisible = ref(false)
const isDragging = ref(false)
const dragStartTime = ref(new Date())
const dragEndTime = ref(new Date()) // TODO: should initialize as null?
const openTime = ref<Date | null>(null)
const lastTimeDragPrevented = ref<Date | null>(null)
const isAllowedToDrag = ref(true)
const drawerRef = ref<ComponentPublicInstance | null>(null)
const overlayRef = ref<ComponentPublicInstance | null>(null)
const snapPoints = ref<(number | string)[] | undefined>(undefined)
const pointerStartY = ref(0)
const dismissible = ref(true)
const shouldScaleBackground = ref(false)
const justReleased = ref(false)

const scrollLockTimeout = ref(SCROLL_LOCK_TIMEOUT)
const closeThreshold = ref(CLOSE_THRESHOLD)

const activeSnapPointProp = ref(null)
const fadeFromIndex = ref(null)

const onSnapPointChange = () => {
  // Change openTime ref when we reach the last snap point to prevent dragging for 500ms incase it's scrollable.
  if (snapPoints.value && activeSnapPointIndex.value === snapPointsOffset.value.length - 1)
    openTime.value = new Date()
}

const {
  activeSnapPoint,
  activeSnapPointIndex,
  onRelease: onReleaseSnapPoints,
  snapPointsOffset,
  onDrag: onDragSnapPoints,
  shouldFade,
  getPercentageDragged: getSnapPointsPercentageDragged
} = useSnapPoints({
  snapPoints,
  activeSnapPoint: activeSnapPointProp,
  drawerRef,
  fadeFromIndex,
  overlayRef,
  onSnapPointChange
})

const { restorePositionSetting } = usePositionFixed({
  isOpen,
  modal: true,
  nested: false,
  hasBeenOpened
})

const drawerHeightRef = computed(() => drawerRef.value?.$el.getBoundingClientRect().height || 0)

function getScale() {
  return (window.innerWidth - WINDOW_TOP_OFFSET) / window.innerWidth
}

function shouldDrag(el: EventTarget | null, isDraggingDown: boolean) {
  if (!el) return false
  let element = el as HTMLElement
  const highlightedText = window.getSelection()?.toString()
  const swipeAmount = drawerRef.value ? getTranslateY(drawerRef.value.$el) : null
  const date = new Date()

  // Allow scrolling when animating
  if (openTime.value && date.getTime() - openTime.value.getTime() < 500) {
    return false
  }

  if (swipeAmount && swipeAmount > 0) {
    return true
  }

  // Don't drag if there's highlighted text
  if (highlightedText && highlightedText.length > 0) {
    return false
  }

  // Disallow dragging if drawer was scrolled within `scrollLockTimeout`
  if (
    lastTimeDragPrevented.value &&
    date.getTime() - lastTimeDragPrevented.value.getTime() < scrollLockTimeout.value &&
    swipeAmount === 0
  ) {
    lastTimeDragPrevented.value = date
    return false
  }

  if (isDraggingDown) {
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

      if (element.getAttribute('role') === 'dialog') {
        return true
      }
    }

    // Move up to the parent element
    element = element.parentNode as HTMLElement
  }

  // No scrollable parents not scrolled to the top found, so drag
  return true
}

function handlePointerDown(event: PointerEvent) {
  if (!dismissible.value && !snapPoints.value) return
  if (drawerRef.value && !drawerRef.value.$el.contains(event.target as Node)) return
  isDragging.value = true
  dragStartTime.value = new Date()

  // iOS doesn't trigger mouseUp after scrolling so we need to listen to touched in order to disallow dragging
  // if (isIOS()) {
  //   window.addEventListener('touchend', () => (isAllowedToDrag.value = false), { once: true });
  // }
  // Ensure we maintain correct pointer capture even when going outside of the drawer
  ;(event.target as HTMLElement).setPointerCapture(event.pointerId)
  pointerStartY.value = event.screenY
}

function handlePointerMove(event: PointerEvent) {
  // We need to know how much of the drawer has been dragged in percentages so that we can transform background accordingly
  if (isDragging.value) {
    const draggedDistance = pointerStartY.value - event.screenY
    const isDraggingDown = draggedDistance > 0

    // Disallow dragging down to close when first snap point is the active one and dismissible prop is set to false.
    if (snapPoints.value && activeSnapPointIndex.value === 0 && !dismissible.value) return

    if (!isAllowedToDrag.value && !shouldDrag(event.target, isDraggingDown)) return
    drawerRef?.value?.$el.classList.add(DRAG_CLASS)
    // If shouldDrag gave true once after pressing down on the drawer, we set isAllowedToDrag to true and it will remain true until we let go, there's no reason to disable dragging mid way, ever, and that's the solution to it
    isAllowedToDrag.value = true
    set(drawerRef.value?.$el, {
      transition: 'none'
    })

    set(overlayRef.value?.$el, {
      transition: 'none'
    })

    if (snapPoints.value) {
      onDragSnapPoints({ draggedDistance })
    }

    // Run this only if snapPoints are not defined or if we are at the last snap point (highest one)
    if (isDraggingDown && !snapPoints.value) {
      const dampenedDraggedDistance = dampenValue(draggedDistance)

      set(drawerRef.value?.$el, {
        transform: `translate3d(0, ${Math.min(dampenedDraggedDistance * -1, 0)}px, 0)`
      })
      return
    }

    // We need to capture last time when drag with scroll was triggered and have a timeout between
    const absDraggedDistance = Math.abs(draggedDistance)
    const wrapper = document.querySelector('[vaul-drawer-wrapper]')

    let percentageDragged = absDraggedDistance / drawerHeightRef.value
    const snapPointPercentageDragged = getSnapPointsPercentageDragged(
      absDraggedDistance,
      isDraggingDown
    )

    if (snapPointPercentageDragged !== null) {
      percentageDragged = snapPointPercentageDragged
    }

    const opacityValue = 1 - percentageDragged

    if (
      shouldFade.value ||
      (fadeFromIndex.value && activeSnapPointIndex.value === fadeFromIndex.value - 1)
    ) {
      // onDragProp?.(event, percentageDragged);

      set(
        overlayRef.value?.$el,
        {
          opacity: `${opacityValue}`,
          transition: 'none'
        },
        true
      )
    }

    if (wrapper && overlayRef.value && shouldScaleBackground.value) {
      // Calculate percentageDragged as a fraction (0 to 1)
      const scaleValue = Math.min(getScale() + percentageDragged * (1 - getScale()), 1)
      const borderRadiusValue = 8 - percentageDragged * 8

      const translateYValue = Math.max(0, 14 - percentageDragged * 14)

      set(
        wrapper,
        {
          borderRadius: `${borderRadiusValue}px`,
          transform: `scale(${scaleValue}) translate3d(0, ${translateYValue}px, 0)`,
          transition: 'none'
        },
        true
      )
    }

    if (!snapPoints.value) {
      set(drawerRef.value?.$el, {
        transform: `translate3d(0, ${absDraggedDistance}px, 0)`
      })
    }
  }
}

function resetDrawer() {
  if (!drawerRef.value) return
  const wrapper = document.querySelector('[vaul-drawer-wrapper]')
  const currentSwipeAmount = getTranslateY(drawerRef.value.$el)

  set(drawerRef.value.$el, {
    transform: 'translate3d(0, 0, 0)',
    transition: `transform ${TRANSITIONS.DURATION}s cubic-bezier(${TRANSITIONS.EASE.join(',')})`
  })

  set(overlayRef.value?.$el, {
    transition: `opacity ${TRANSITIONS.DURATION}s cubic-bezier(${TRANSITIONS.EASE.join(',')})`,
    opacity: '1'
  })

  // Don't reset background if swiped upwards
  if (shouldScaleBackground.value && currentSwipeAmount && currentSwipeAmount > 0 && isOpen) {
    set(
      wrapper,
      {
        borderRadius: `${BORDER_RADIUS}px`,
        overflow: 'hidden',
        transform: `scale(${getScale()}) translate3d(0, calc(env(safe-area-inset-top) + 14px), 0)`,
        transformOrigin: 'top',
        transitionProperty: 'transform, border-radius',
        transitionDuration: `${TRANSITIONS.DURATION}s`,
        transitionTimingFunction: `cubic-bezier(${TRANSITIONS.EASE.join(',')})`
      },
      true
    )
  }
}

function closeDrawer() {
  if (!drawerRef.value) return

  // onClose?.();
  set(drawerRef.value.$el, {
    transform: `translate3d(0, 100%, 0)`,
    transition: `transform ${TRANSITIONS.DURATION}s cubic-bezier(${TRANSITIONS.EASE.join(',')})`
  })

  set(overlayRef.value?.$el, {
    opacity: '0',
    transition: `opacity ${TRANSITIONS.DURATION}s cubic-bezier(${TRANSITIONS.EASE.join(',')})`
  })

  scaleBackground(false)

  isVisible.value = false
  setTimeout(() => {
    isOpen.value = false
  }, 300)

  setTimeout(() => {
    if (snapPoints.value) {
      activeSnapPoint.value = snapPoints.value[0]
    }
  }, TRANSITIONS.DURATION * 1000) // seconds to ms
}

function handlePointerUp(event: PointerEvent) {
  if (!isDragging.value || !drawerRef.value) return
  // TODO use-prevent-scroll
  // if (isAllowedToDrag.value && isInput(event.target as HTMLElement)) {
  //   // If we were just dragging, prevent focusing on inputs etc. on release
  //   (event.target as HTMLInputElement).blur();
  // }
  drawerRef.value.$el.classList.remove(DRAG_CLASS)
  isAllowedToDrag.value = false
  isDragging.value = false
  dragEndTime.value = new Date()
  const swipeAmount = getTranslateY(drawerRef.value.$el)

  if (!shouldDrag(event.target, false) || !swipeAmount || Number.isNaN(swipeAmount)) return

  if (dragStartTime.value === null) return

  const timeTaken = dragEndTime.value.getTime() - dragStartTime.value.getTime()
  const distMoved = pointerStartY.value - event.screenY
  const velocity = Math.abs(distMoved) / timeTaken

  if (velocity > 0.05) {
    // `justReleased` is needed to prevent the drawer from focusing on an input when the drag ends, as it's not the intent most of the time.
    justReleased.value = true

    setTimeout(() => {
      justReleased.value = false
    }, 200)
  }

  if (snapPoints.value) {
    onReleaseSnapPoints({
      draggedDistance: distMoved,
      closeDrawer,
      velocity,
      dismissible: dismissible.value
    })
    // onReleaseProp?.(event, true);
    return
  }

  // Moved upwards, don't do anything
  if (distMoved > 0) {
    resetDrawer()
    // onReleaseProp?.(event, true);
    return
  }

  if (velocity > VELOCITY_THRESHOLD) {
    closeDrawer()
    // onReleaseProp?.(event, false);
    return
  }

  const visibleDrawerHeight = Math.min(
    drawerRef.value.$el.getBoundingClientRect().height ?? 0,
    window.innerHeight
  )

  if (swipeAmount >= visibleDrawerHeight * closeThreshold.value) {
    closeDrawer()
    // onReleaseProp?.(event, false);
    return
  }

  // onReleaseProp?.(event, true);
  resetDrawer()
}

watch(isOpen, (open) => {
  if (open) {
    openTime.value = new Date()
    scaleBackground(true)
  }
})

function scaleBackground(open: boolean) {
  const wrapper = document.querySelector('[vaul-drawer-wrapper]')

  if (!wrapper || !shouldScaleBackground.value) return

  if (open) {
    set(
      document.body,
      {
        background: 'black'
      },
      true
    )

    set(wrapper, {
      borderRadius: `${BORDER_RADIUS}px`,
      overflow: 'hidden',
      transform: `scale(${getScale()}) translate3d(0, calc(env(safe-area-inset-top) + 14px), 0)`,
      transformOrigin: 'top',
      transitionProperty: 'transform, border-radius',
      transitionDuration: `${TRANSITIONS.DURATION}s`,
      transitionTimingFunction: `cubic-bezier(${TRANSITIONS.EASE.join(',')})`
    })
  } else {
    // Exit
    reset(wrapper, 'overflow')
    reset(wrapper, 'transform')
    reset(wrapper, 'borderRadius')
    set(wrapper, {
      transitionProperty: 'transform, border-radius',
      transitionDuration: `${TRANSITIONS.DURATION}s`,
      transitionTimingFunction: `cubic-bezier(${TRANSITIONS.EASE.join(',')})`
    })
  }
}

export const drawerContext = {
  isOpen,
  hasBeenOpened,
  isVisible,
  drawerRef,
  drawerHeightRef,
  overlayRef,
  isDragging,
  dragStartTime,
  isAllowedToDrag,
  snapPoints,
  activeSnapPoint,
  pointerStartY,
  dismissible,
  snapPointsOffset,
  shouldFade,
  fadeFromIndex,
  shouldScaleBackground,
  handlePointerDown,
  handlePointerMove,
  handlePointerUp,
  closeDrawer
}
