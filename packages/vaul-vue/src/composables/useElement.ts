import type { MaybeRefOrGetter } from 'vue'
import { nextTick, shallowRef, toValue, watchPostEffect } from 'vue'

export function useElements(query: string, isMounted: MaybeRefOrGetter<boolean>) {
  const elements = shallowRef<HTMLElement[]>([])

  watchPostEffect(async () => {
    if (!toValue(isMounted))
      return

    await nextTick()
    const _elements = document.querySelectorAll(query)

    for (let index = 0; index < _elements.length; index++) {
      const element = _elements[index] as HTMLElement
      elements.value.push(element)
    }
  })

  const anyContains = (element: HTMLElement | null) => {
    if (!element)
      return

    if (element.matches(query)) {
      return true
    }

    return elements.value.findIndex(container => container.contains(element)) !== -1
  }

  return {
    elements,
    anyContains,
  }
}
