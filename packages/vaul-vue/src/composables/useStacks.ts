import type { ComponentPublicInstance, MaybeRefOrGetter } from 'vue'
import { useId } from 'reka-ui'
import { nextTick, onMounted, shallowRef, toValue } from 'vue'
import { range } from '../utils'
import { useEl } from './useEl'
import type { DrawerSide } from '../types'

const drawerStack = shallowRef<{ id: string, element: HTMLElement }[]>([])

export function useStacks(
  overlayRef: MaybeRefOrGetter<ComponentPublicInstance | undefined>,
  open: MaybeRefOrGetter<boolean>,
  isDragging: MaybeRefOrGetter<boolean>,
  windowSize: MaybeRefOrGetter<number>,
  sideOffsetModifier: MaybeRefOrGetter<number>,
) {
  const id = useId()
  const drawerWrapperRef = shallowRef<HTMLElement>()

  const { element: overlayElement } = useEl(overlayRef, open)

  const addStack = (element: HTMLElement) => {
    drawerStack.value.push({
      id,
      element,
    })
  }

  const popStack = () => {
    drawerStack.value.pop()
  }

  const updateDepths = async (_offset: number) => {
    document.body.style.backgroundColor = 'black'

    const _windowSize = toValue(windowSize)

    if (drawerStack.value.length >= 1) {
      const drawerCounts = {
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
      }

      for (let index = 0; index < drawerStack.value.length; index++) {
        const { element } = drawerStack.value[index];

        const side = element.getAttribute('data-vaul-drawer-side') as DrawerSide | undefined
        if (!side)
          return

        drawerCounts[side] += 1
      }

      const offsets = {
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
      }

      for (let index = 0; index < drawerStack.value.length; index++) {
        const { element } = drawerStack.value[index];

        const side = element.getAttribute('data-vaul-drawer-side') as DrawerSide | undefined
        if (!side)
          return

        const count = ((drawerCounts[side] - offsets[side]) - 1) * 20 * (side === 'right' || side === 'bottom' ? -1 : 1)
        element.style.transform = `translate3d(0px, ${count}px, 0px)`

        offsets[side] += 1
      }
    }

    if (drawerStack.value.length > 1 || (drawerStack.value.length === 1 && _windowSize === Math.abs(_offset))) {
      return
    }

    const off = _windowSize - Math.abs(_offset)
    const scale = range(0, _windowSize, 1, 0.95, off)
    const borderRadius = range(0, _windowSize, 0, 14, off)

    let cssText = ''

    if (overlayElement.value) {
      overlayElement.value.style.opacity = range(0, _windowSize, 0, 1, off).toString()
    }

    if (!toValue(isDragging)) {
      cssText += `
        transition-easing-function: var(--vaul-easing);
        transition-duration: var(--vaul-duration);
      `
    }

    if (drawerWrapperRef.value) {
      drawerWrapperRef.value.style.cssText = `
        ${cssText}
        transform: scale(${scale}) translate3d(0px, 0px, 0px);
        border-radius: ${borderRadius.toFixed(0)}px;
      `
    }
  }

  onMounted(() => {
    drawerWrapperRef.value = document.querySelector('[data-vaul-drawer-wrapper]') as HTMLElement | undefined
  })

  return {
    addStack,
    popStack,
    updateDepths,
  }
}
