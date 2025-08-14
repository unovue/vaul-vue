import type { ComponentPublicInstance, MaybeRefOrGetter } from 'vue'
import { nextTick, onUnmounted, ref, shallowRef, toValue, watchEffect } from 'vue'

export function useElSize(
  target: MaybeRefOrGetter<ComponentPublicInstance | undefined>,
  open: MaybeRefOrGetter<boolean>,
) {
  const height = ref(0)
  const width = ref(0)

  const observer = shallowRef<ResizeObserver>()
  const element = shallowRef<HTMLElement>()

  const onResize = (entries: ResizeObserverEntry[]) => {
    const target = entries[0]

    height.value = target.contentRect.width
    width.value = target.contentRect.height
  }

  watchEffect(async () => {
    const isOpen = toValue(open)
    await nextTick()

    if (isOpen) {
      const el = toValue(target)?.$el

      observer.value = new ResizeObserver(onResize)
      element.value = el

      observer.value.observe(el)
    }
  })

  onUnmounted(() => {
    if (!element.value)
      return

    observer.value?.unobserve(element.value)
  })

  return {
    height,
    width,
    element,
  }
}
