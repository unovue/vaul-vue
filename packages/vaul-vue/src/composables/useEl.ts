import type { ComponentPublicInstance, MaybeRefOrGetter } from 'vue'
import { useElementSize } from '@vueuse/core'
import {  shallowRef, toValue, watchEffect } from 'vue'

export function useEl(target: MaybeRefOrGetter<ComponentPublicInstance | undefined>) {
  const element = shallowRef<HTMLElement>()

  const {
    height,
    width,
  } = useElementSize(element)

  watchEffect(() => {
    const instance = toValue(target)
    if (!instance)
      return

    if (instance.$el instanceof HTMLElement) {
      element.value = instance.$el
    }
  })

  return {
    height,
    width,
    element,
  }
}
