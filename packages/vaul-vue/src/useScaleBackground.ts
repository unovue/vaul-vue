import { computed, ref, watch } from 'vue'
import { BORDER_RADIUS, TRANSITIONS, WINDOW_TOP_OFFSET } from './constants'
import { injectDrawerRootContext } from './context'
import { assignStyle, chain, isVertical } from './helpers'

const noop = () => () => {}

export function useScaleBackground() {
  const { direction, isOpen, shouldScaleBackground, setBackgroundColorOnScale, noBodyStyles } = injectDrawerRootContext()
  const timeoutIdRef = ref<number | null>(null)
  const initialBackgroundColor = computed(() => document.body.style.backgroundColor)

  function getScale() {
    return (window.innerWidth - WINDOW_TOP_OFFSET) / window.innerWidth
  }

  watch([isOpen, shouldScaleBackground, initialBackgroundColor], () => {
    if (isOpen && shouldScaleBackground) {
      if (timeoutIdRef.value)
        clearTimeout(timeoutIdRef.value)
      const wrapper
          = (document.querySelector('[data-vaul-drawer-wrapper]') as HTMLElement)
          || (document.querySelector('[vaul-drawer-wrapper]') as HTMLElement)

      if (!wrapper)
        return

      chain(
        setBackgroundColorOnScale && !noBodyStyles ? assignStyle(document.body, { background: 'black' }) : noop,
        assignStyle(wrapper, {
          transformOrigin: isVertical(direction.value) ? 'top' : 'left',
          transitionProperty: 'transform, border-radius',
          transitionDuration: `${TRANSITIONS.DURATION}s`,
          transitionTimingFunction: `cubic-bezier(${TRANSITIONS.EASE.join(',')})`,
        }),
      )

      const wrapperStylesCleanup = assignStyle(wrapper, {
        borderRadius: `${BORDER_RADIUS}px`,
        overflow: 'hidden',
        ...(isVertical(direction.value)
          ? {
              transform: `scale(${getScale()}) translate3d(0, calc(env(safe-area-inset-top) + 14px), 0)`,
            }
          : {
              transform: `scale(${getScale()}) translate3d(calc(env(safe-area-inset-top) + 14px), 0, 0)`,
            }),
      })

      return () => {
        wrapperStylesCleanup()
        timeoutIdRef.value = window.setTimeout(() => {
          if (initialBackgroundColor) {
            document.body.style.background = initialBackgroundColor.value
          }
          else {
            document.body.style.removeProperty('background')
          }
        }, TRANSITIONS.DURATION * 1000)
      }
    }
  }, {
    immediate: true,
  })
}
