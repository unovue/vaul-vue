import type { ComponentPublicInstance, MaybeRefOrGetter } from 'vue'
import { ref, shallowRef, toValue, watchEffect } from 'vue'

export function useEl(target: MaybeRefOrGetter<ComponentPublicInstance | undefined>) {
  const height = ref(0)
  const width = ref(0)

  const element = shallowRef<HTMLElement>()

  watchEffect(() => {
    const instance = toValue(target)
    if (!instance)
      return

    if (instance.$el instanceof HTMLElement) {
      element.value = instance.$el

      width.value = element.value?.clientWidth || 0
      height.value = element.value?.clientHeight || 0
    }
  })

  return {
    height,
    width,
    element,
  }
}
