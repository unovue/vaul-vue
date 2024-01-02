import { isIOS } from './platformTests'
import { onMounted, onUnmounted } from 'vue'
import { preventScrollMobileSafari, preventScrollStandard } from './preventScroll'

interface PreventScrollOptions {
  /** Whether the scroll lock is disabled. */
  isDisabled?: boolean
  focusCallback?: () => void
}

// The number of active usePreventScroll calls. Used to determine whether to revert back to the original page style/scroll position
let preventScrollCount = 0
let restore: () => unknown

/**
 * Prevents scrolling on the document body on mount, and
 * restores it on unmount. Also ensures that content does not
 * shift due to the scrollbars disappearing.
 */
export function usePreventScroll(options: PreventScrollOptions = {}) {
  const { isDisabled } = options

  onMounted(() => {
    if (isDisabled) return

    preventScrollCount++
    if (preventScrollCount === 1) {
      if (isIOS()) {
        restore = preventScrollMobileSafari()
      } else {
        restore = preventScrollStandard()
      }
    }
  })

  onUnmounted(() => {
    preventScrollCount--
    if (preventScrollCount === 0) {
      restore()
    }
  })
}
