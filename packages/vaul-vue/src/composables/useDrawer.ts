import type { ComponentPublicInstance, MaybeRefOrGetter, StyleValue } from 'vue'
import type { DrawerRootProps, DrawerSide } from '../types'
import { useWindowSize } from '@vueuse/core'
import { computed, nextTick, onMounted, ref, toValue, watch } from 'vue'
import { isVertical, range } from '../utils'
import { useElSize } from './useElSize'
import { useSnapPoints } from './useSnapPoints'

// export interface UseDrawerProps {
//   snapPoints: MaybeRefOrGetter<number[]>,
//   side: MaybeRefOrGetter<DrawerSide>,
//   scaleBackground: MaybeRefOrGetter<boolean>,
// }

export type UseDrawerProps = {
  [K in keyof DrawerRootProps]-?: MaybeRefOrGetter<NonNullable<DrawerRootProps[K]>>
}

export function useDrawer(props: UseDrawerProps) {
  const open = ref(false)

  const drawerContentRef = ref<ComponentPublicInstance>()
  const drawerHandleRef = ref<ComponentPublicInstance>()
  const drawerWrapperRef = ref<HTMLElement>()

  const pointerStart = ref(0)
  const offset = ref(0)

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

  const isVertical = computed(() => drawerSide.value === 'top' || drawerSide.value === 'bottom' ? true : false)

  const containerStyle = computed(() => {
    return {
      transform: `translateY(${offset.value}px)`,
      touchAction: 'none',

      // for now leave like this
      transitionProperty: isDragging.value ? 'none' : 'transform',
      transitionDuration: '500ms',
      transitionTimingFunction: 'cubic-bezier(0.32, 0.72, 0, 1)',
    } satisfies StyleValue
  })

  const onDragStart = (event: PointerEvent) => {
    isDragging.value = true
    pointerStart.value = isVertical.value ? event.clientY : event.clientX
  }

  const onDrag = (event: PointerEvent) => {
    if (!isDragging.value)
      return

    const dragDistance = (pointerStart.value - (isVertical.value ? event.clientY : event.clientX)) * -1

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

        if (props.setBackgroundColorOnScale)  {
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

    offset.value = windowHeight.value
    await nextTick()

    return new Promise(async (resolve) => {
      contentElement.value?.addEventListener('transitionend', () => {
        resolve(true)
      }, { once: true })

      offset.value = snapTo(0)!
    })
  }

  onMounted(() => {
    drawerWrapperRef.value = document.querySelector('[data-vaul-drawer-wrapper]') as HTMLElement | undefined
  })

  watch(offset, () => {
    if (!toValue(props.scaleBackground))
      return

    if (!drawerWrapperRef.value) {
      console.warn('Wrapper element is not found even though scaleBackground is set to true.')
      return
    }

    const offsetScreen = windowHeight.value - (contentHeight.value + -offset.value)
    const depth = range(0, windowHeight.value, 14, 0, offsetScreen)
    const scale = range(0, windowHeight.value, 0.95, 1, offsetScreen)
    const borderRadius = range(0, windowHeight.value, 14, 0, offsetScreen)

    requestAnimationFrame(() => {
      if (!drawerWrapperRef.value)
        return

      drawerWrapperRef.value
        .style
        .cssText = `
          overflow: hidden;
          transform-origin: center top;
          transition: transform 0.5s cubic-bezier(0.32, 0.72, 0, 1), border-radius;
          transform: scale(${scale.toFixed(2)}) translate3d(0, calc(env(safe-area-inset-top) + ${depth.toFixed(2)}px), 0);
          border-radius: ${borderRadius.toFixed(0)}px`
    })
  })

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
