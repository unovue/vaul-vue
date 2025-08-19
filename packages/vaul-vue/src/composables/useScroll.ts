import { useFps } from '@vueuse/core'
import { nextTick, ref, shallowRef, toValue, watch, type MaybeRefOrGetter } from 'vue'

const DECAY = 0.95
const MIN_VELOCITY = 0.0001

export function useScroll(isMounted: MaybeRefOrGetter<boolean>) {
  const scrollableElement = shallowRef<HTMLElement>()
  const lastEvent = shallowRef<PointerEvent>()

  const startScroll = ref(0)
  const fps = useFps()

  let lastTime = performance.now()
  let velocity = 0

  const handleScrollStart = (event: PointerEvent) => {
    startScroll.value = scrollableElement.value?.scrollTop || 0
    lastEvent.value = event

    velocity = 0
    lastTime = performance.now()
  }

  const handleScroll = (event: PointerEvent, draggingInDirectionDrawerWantsToGo: boolean) => {
    if (scrollableElement.value?.scrollTop === 0 && !draggingInDirectionDrawerWantsToGo)
      return true

    if (!lastEvent.value)
      return false

    const delta = lastEvent.value.clientY - event.clientY
    const now = performance.now()
    const timeDiff = now - lastTime

    if (timeDiff > 0) {
      velocity = delta / timeDiff
    }

    scrollableElement.value?.scrollBy({
      top: delta
    })

    lastEvent.value = event
    lastTime = now
    return false
  }

  const step = () => {
    velocity *= DECAY

    if (Math.abs(velocity) <= MIN_VELOCITY)
      return

    scrollableElement.value?.scrollBy({
      top: velocity * (1000 / fps.value),
    })

    requestAnimationFrame(step)
  }

  const handleScrollEnd = () => {
    requestAnimationFrame(step)
  }

  watch(() => toValue(isMounted), async () => {
    if (!toValue(isMounted))
      return

    await nextTick()
    const element = document.querySelector('[data-vaul-scrollable]')  as HTMLElement | null

    if (element) {
      scrollableElement.value = element
      element.style.touchAction = 'none'
    }
  }, {
    flush: 'post'
  })

  return {
    handleScroll,
    handleScrollStart,
    startScroll,
    handleScrollEnd
  }
}
