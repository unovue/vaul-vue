import type { ComponentPublicInstance, Ref } from 'vue'
import { createContext } from 'radix-vue'
import type { DialogRootProps } from 'radix-vue'
import type { DrawerDirection } from './types'

export interface DrawerRootContext {
  drawerRef: Ref<ComponentPublicInstance | null> //
  overlayRef: Ref<ComponentPublicInstance | null> //
  onPress: (event: PointerEvent) => void //
  onRelease: (event: PointerEvent) => void //
  onDrag: (event: PointerEvent) => void //
  onNestedDrag: (percentageDragged: number) => void //
  onNestedOpenChange: (o: boolean) => void //
  onNestedRelease: (o: boolean) => void //
  dismissible: Ref<boolean>
  isOpen: Ref<boolean> //
  isDragging: Ref<boolean> //
  keyboardIsOpen: Ref<boolean> //
  snapPointsOffset: Ref<number[]> //
  snapPoints: Ref<(number | string)[] | undefined> //
  activeSnapPointIndex?: number | null // **
  modal: Ref<boolean> //
  shouldFade: Ref<boolean>
  activeSnapPoint: Ref<number | string | null | undefined>
  closeDrawer: () => void
  open: Ref<boolean> //
  direction: Ref<DrawerDirection>
  shouldScaleBackground: Ref<boolean | undefined>
  setBackgroundColorOnScale: boolean // **
  noBodyStyles: boolean // **
  handleOnly?: boolean
  container?: HTMLElement | null
  autoFocus?: boolean
  shouldAnimate?: Ref<boolean | undefined>

  /** vaul-vue */
  hasBeenOpened: Ref<boolean>
  isVisible: Ref<boolean>
  dragStartTime: Ref<Date | null>
  isAllowedToDrag: Ref<boolean>
  pointerStart: Ref<number>
  drawerHeightRef: Ref<number>
  fadeFromIndex: Ref<number | undefined>
  emitClose: () => void
  emitDrag: (percentageDragged: number) => void
  emitRelease: (open: boolean) => void
  emitOpenChange: (o: boolean) => void
  nested: Ref<boolean>
}

export const [injectDrawerRootContext, provideDrawerRootContext]
  = createContext<DrawerRootContext>('DrawerRoot')
