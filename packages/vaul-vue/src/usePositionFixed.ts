import { type Ref, onMounted, onUnmounted, ref, watch } from 'vue'
import { isSafari } from './browser'

interface BodyPosition {
  position: string
  top: string
  left: string
  height: string
}

interface PositionFixedOptions {
  isOpen: Ref<boolean>
  modal: Ref<boolean>
  nested: Ref<boolean>
  hasBeenOpened: Ref<boolean>
  preventScrollRestoration: Ref<boolean>
  noBodyStyles: Ref<boolean>
}

let previousBodyPosition: BodyPosition | null = null

export function usePositionFixed(options: PositionFixedOptions) {
  const { isOpen, modal, nested, hasBeenOpened, preventScrollRestoration, noBodyStyles } = options
  const activeUrl = ref(typeof window !== 'undefined' ? window.location.href : '')
  const scrollPos = ref(0)

  function setPositionFixed(): void {
    // All browsers on iOS will return true here.
    if (!isSafari())
      return

    // If previousBodyPosition is already set, don't set it again.
    if (previousBodyPosition === null && isOpen.value && !noBodyStyles.value) {
      previousBodyPosition = {
        position: document.body.style.position,
        top: document.body.style.top,
        left: document.body.style.left,
        height: document.body.style.height,
      }

      // Update the dom inside an animation frame
      const { scrollX, innerHeight } = window

      document.body.style.setProperty('position', 'fixed', 'important')
      Object.assign(document.body.style, {
        top: `${-scrollPos.value}px`,
        left: `${-scrollX}px`,
        right: '0px',
        height: 'auto',
      })

      setTimeout(() => {
        requestAnimationFrame(() => {
          // Attempt to check if the bottom bar appeared due to the position change
          const bottomBarHeight = innerHeight - window.innerHeight
          if (bottomBarHeight && scrollPos.value >= innerHeight) {
            // Move the content further up so that the bottom bar doesn't hide it
            document.body.style.top = `-${scrollPos.value + bottomBarHeight}px`
          }
        })
      }, 300)
    }
  }

  function restorePositionSetting(): void {
    // All browsers on iOS will return true here.
    if (!isSafari())
      return

    if (previousBodyPosition !== null && !noBodyStyles.value) {
      // Convert the position from "px" to Int
      const y = -Number.parseInt(document.body.style.top, 10)
      const x = -Number.parseInt(document.body.style.left, 10)

      // Restore styles
      Object.assign(document.body.style, previousBodyPosition)

      window.requestAnimationFrame(() => {
        if (preventScrollRestoration.value && activeUrl.value !== window.location.href) {
          activeUrl.value = window.location.href
          return
        }

        window.scrollTo(x, y)
      })

      previousBodyPosition = null
    }
  }

  onMounted(() => {
    function onScroll() {
      scrollPos.value = window.scrollY
    }

    onScroll()
    window.addEventListener('scroll', onScroll)

    onUnmounted(() => {
      window.removeEventListener('scroll', onScroll)
    })
  })

  watch([isOpen, hasBeenOpened, activeUrl], () => {
    if (nested.value || !hasBeenOpened.value)
      return

    // This is needed to force Safari toolbar to show **before** the drawer starts animating to prevent a gnarly shift from happening
    if (isOpen.value) {
      // avoid for standalone mode (PWA)
      const isStandalone = window.matchMedia('(display-mode: standalone)').matches
      if (!isStandalone)
        setPositionFixed()

      if (!modal.value) {
        setTimeout(() => {
          restorePositionSetting()
        }, 500)
      }
    }
    else {
      restorePositionSetting()
    }
  })

  return { restorePositionSetting }
}
