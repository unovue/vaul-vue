import type { ComponentPublicInstance, MaybeRefOrGetter, StyleValue } from 'vue'
import type { DrawerRootProps } from '../types'
import { useWindowSize } from '@vueuse/core'
import { computed, nextTick, onMounted, ref, shallowRef, toValue, watch } from 'vue'
import { range } from '../utils'
import { useElSize } from './useElSize'
import { useSnapPoints } from './useSnapPoints'

export type UseDrawerProps = {
  [K in keyof DrawerRootProps]-?: MaybeRefOrGetter<NonNullable<DrawerRootProps[K]>>
}

export function useDrawer(props: UseDrawerProps) {
  const open = ref(false)

  const drawerContentRef = shallowRef<ComponentPublicInstance>()
  const drawerHandleRef = shallowRef<ComponentPublicInstance>()
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
  } = useElSize(drawerContentRef, open)

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

  const { snapTo, closestSnapPointIndex, activeSnapPointOffset } = useSnapPoints({
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

  const onDragStart = (event: PointerEvent) => {
    isDragging.value = true
    pointerStart.value = isVertical.value ? event.clientY : event.clientX
  }

  const onDrag = (event: PointerEvent) => {
    if (!isDragging.value || !contentElement.value)
      return

    const clientPosition = isVertical.value ? event.clientY : event.clientX
    const dragDistance = pointerStart.value - clientPosition

    const newOffset = (activeSnapPointOffset.value * sideInitialOffsetModifier.value) + -dragDistance

    offset.value = newOffset
  }

  const onDragEnd = () => {
    isDragging.value = false

    const result = snapTo(closestSnapPointIndex.value)! * sideInitialOffsetModifier.value

    offset.value = result
    offsetInitial.value = result
  }

  const dismiss = async () => {
    return new Promise((resolve) => {
      contentElement.value?.addEventListener('transitionend', () => {
        resolve(false)

        if (props.setBackgroundColorOnScale) {
          document.body.style.backgroundColor = ''
        }
      }, { once: true })

      offsetInitial.value = windowSize.value * sideInitialOffsetModifier.value
    })
  }

  const present = async () => {
    if (props.setBackgroundColorOnScale) {
      document.body.style.backgroundColor = 'black'
    }

    offsetInitial.value = windowSize.value * sideInitialOffsetModifier.value
    await nextTick()

    return new Promise((resolve) => {
      contentElement.value?.addEventListener('transitionend', () => {
        resolve(true)
      }, { once: true })

      offsetInitial.value = snapTo(0)! * sideInitialOffsetModifier.value
    })
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

  onMounted(() => {
    drawerWrapperRef.value = document.querySelector('[data-vaul-drawer-wrapper]') as HTMLElement | undefined
  })

  watch(offsetInitial, () => {
    // updateBackground(offsetInitial.value)
  })

  watch(offset, () => {
    if (contentElement.value) {
      contentElement.value.style.transform = isVertical.value ? `translateY(${offset.value}px)` : `translateX(${offset.value}px)`
    }

    // updateBackground(offset.value)
  })

  return {
    onDragStart,
    onDrag,
    onDragEnd,
    drawerContentRef,
    drawerHandleRef,
    open,
    dismiss,
    present,
    isDragging,
    initialContainerStyle,
    side,
  }
}
