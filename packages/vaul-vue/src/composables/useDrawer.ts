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

  const drawerSide = ref(props.side)
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

  // const directionMultiplier = computed(() => props.side === 'bottom' || props.side === 'right' ? 1 : -1)
  // const normalizedOffset = computed(() => range(0, windowHeight.value, 0, 1, offset.value))

  const isVertical = computed(() => !!(drawerSide.value === 'top' || drawerSide.value === 'bottom'))

  const initialContainerStyle = computed(() => {
    return {
      transform: `translateY(${offsetInitial.value}px)`,
      // touchAction: 'none',

      // for now leave like this
      // transitionProperty: isDragging.value ? 'none' : 'transform',
      // transitionDuration: '500ms',
      // transitionTimingFunction: 'cubic-bezier(0.32, 0.72, 0, 1)',
    } satisfies StyleValue
  })

  const onDragStart = (event: PointerEvent) => {
    isDragging.value = true
    pointerStart.value = isVertical.value ? event.clientY : event.clientX
  }

  const onDrag = (event: PointerEvent) => {
    if (!isDragging.value || !contentElement.value)
      return

    const dragDistance = (pointerStart.value - (isVertical.value ? event.clientY : event.clientX)) * -1
    const newOffset = activeSnapPointOffset.value + dragDistance

    offset.value = newOffset
  }

  const onDragEnd = () => {
    isDragging.value = false

    offset.value = snapTo(closestSnapPointIndex.value)!
    offsetInitial.value = offset.value
  }

  const dismiss = async () => {
    return new Promise((resolve) => {
      contentElement.value?.addEventListener('transitionend', () => {
        resolve(false)

        if (props.setBackgroundColorOnScale) {
          document.body.style.backgroundColor = ''
        }
      }, { once: true })

      offset.value = windowHeight.value
    })
  }

  const present = async () => {
    if (props.setBackgroundColorOnScale) {
      document.body.style.backgroundColor = 'black'
    }

    offsetInitial.value = windowHeight.value
    await nextTick()

    if (contentElement.value) {
      contentElement.value.style.transform = `translateY(${offset.value}px)`
    }

    return new Promise((resolve) => {
      contentElement.value?.addEventListener('transitionend', () => {
        resolve(true)
      }, { once: true })

      offsetInitial.value = snapTo(0)!
    })
  }

  const updateBackground = (_offset: number) => {
    if (!toValue(props.scaleBackground))
      return

    if (!drawerWrapperRef.value) {
      console.warn('Wrapper element is not found even though scaleBackground is set to true.')
      return
    }

    const offsetScreen = windowHeight.value - (contentHeight.value + -_offset)
    const depth = range(0, windowHeight.value, 14, 0, offsetScreen)
    const scale = range(0, windowHeight.value, 0.95, 1, offsetScreen)
    const borderRadius = range(0, windowHeight.value, 14, 0, offsetScreen)

    let cssText = `
      overflow: hidden;
      transform-origin: center top;
      transform: scale(${scale}) translate3d(0, calc(env(safe-area-inset-top) + ${depth}px), 0);
      border-radius: ${borderRadius.toFixed(0)}px;
    `

    if (!isDragging.value) {
      cssText += `transition: transform 0.5s cubic-bezier(0.32, 0.72, 0, 1), border-radius;`
    }

    drawerWrapperRef.value
      .style
      .cssText = cssText
  }

  onMounted(() => {
    drawerWrapperRef.value = document.querySelector('[data-vaul-drawer-wrapper]') as HTMLElement | undefined
  })

  watch(offsetInitial, () => {
    updateBackground(offsetInitial.value)
  })

  watch(offset, () => {
    if (contentElement.value) {
      contentElement.value.style.transform = `translateY(${offset.value}px)`
    }

    updateBackground(offset.value)
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
  }
}
