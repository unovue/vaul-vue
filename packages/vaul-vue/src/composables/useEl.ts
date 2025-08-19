import type { ComponentPublicInstance, MaybeRefOrGetter } from 'vue'
import { onUnmounted, ref, shallowRef, toValue, watchEffect } from 'vue'

export function useEl(target: MaybeRefOrGetter<ComponentPublicInstance | undefined>) {
  const height = ref(0)
  const width = ref(0)

  const observer = shallowRef<ResizeObserver>()
  const element = shallowRef<HTMLElement>()

  watchEffect(() => {
    const instance = toValue(target)
    if (!instance)
      return

    element.value = instance.$el

    width.value = element.value?.clientWidth || 0
    height.value = element.value?.clientHeight || 0
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
