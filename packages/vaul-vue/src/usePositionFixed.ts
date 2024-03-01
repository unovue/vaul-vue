import { type Ref, onMounted, onUnmounted, ref, watch } from 'vue'

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
}

let previousBodyPosition: BodyPosition | null = null

export function usePositionFixed(options: PositionFixedOptions) {
  const { isOpen, modal, nested, hasBeenOpened } = options
  const activeUrl = ref(typeof window !== 'undefined' ? window.location.href : '')
  const scrollPos = ref(0)

  function setPositionFixed(): void {
    if (previousBodyPosition === null && isOpen.value) {
      previousBodyPosition = {
        position: document.body.style.position,
        top: document.body.style.top,
        left: document.body.style.left,
        height: document.body.style.height,
      }

      const { scrollX, innerHeight } = window

      document.body.style.position = 'fixed'
      document.body.style.top = `-${scrollPos.value}px`
      document.body.style.left = `-${scrollX}px`
      document.body.style.right = '0px'
      document.body.style.height = 'auto'

      setTimeout(() => {
        requestAnimationFrame(() => {
          const bottomBarHeight = innerHeight - window.innerHeight
          if (bottomBarHeight && scrollPos.value >= innerHeight)
            document.body.style.top = `-${scrollPos.value + bottomBarHeight}px`
        })
      }, 300)
    }
  }

  function restorePositionSetting(): void {
    if (previousBodyPosition !== null) {
      const y = -Number.parseInt(document.body.style.top, 10)
      const x = -Number.parseInt(document.body.style.left, 10)

      Object.assign(document.body.style, previousBodyPosition)

      requestAnimationFrame(() => {
        if (activeUrl.value !== window.location.href) {
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
    if (isOpen.value) {
      setPositionFixed()

      if (!modal) {
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
