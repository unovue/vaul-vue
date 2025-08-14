import type { ComponentPublicInstance, MaybeRefOrGetter } from 'vue'
import { computed, onMounted, onUnmounted, ref, shallowRef, toValue, watch } from 'vue'

export function useElSize(
  target: MaybeRefOrGetter<ComponentPublicInstance | undefined>,
  open: MaybeRefOrGetter<boolean>,
) {
  const height = ref(0)
  const width = ref(0)

  const observer = shallowRef<ResizeObserver>()
  const element = shallowRef<HTMLElement>()

  const onResize = (entries: ResizeObserverEntry[]) => {
    console.log('resize', entries)
    const target = entries[0]

    height.value = target.contentRect.height
    width.value = target.contentRect.width
  }

  const checkMounted = () => {
    console.log('element empt', element.value)
  }
  
  watch(() => toValue(open), (_open) => {
    if (!open)
      return

    const el = toValue(target)?.$el
    
    if (!(el instanceof HTMLElement))
      return

    element.value = el
    observer.value = new ResizeObserver(onResize)
    observer.value.observe(el)

    width.value = element.value.clientWidth
    height.value = element.value.clientHeight
  }, {
    flush: 'post'
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
    checkMounted,
  }
}
