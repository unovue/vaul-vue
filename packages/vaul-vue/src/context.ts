import type { ComponentPublicInstance, Ref } from 'vue'
import { createContext } from 'radix-vue'
import type { DrawerDirection } from './types'

export interface DrawerRootContext {
  open: Ref<boolean>
  isOpen: Ref<boolean>
  modal: Ref<boolean>
  hasBeenOpened: Ref<boolean>
  isVisible: Ref<boolean>
  drawerRef: Ref<ComponentPublicInstance | null>
  overlayRef: Ref<ComponentPublicInstance | null>
  isDragging: Ref<boolean>
  dragStartTime: Ref<Date | null>
  isAllowedToDrag: Ref<boolean>
  snapPoints: Ref<(number | string)[] | undefined>
  keyboardIsOpen: Ref<boolean>
  activeSnapPoint: Ref<number | string | null | undefined>
  pointerStart: Ref<number>
  dismissible: Ref<boolean>
  drawerHeightRef: Ref<number>
  snapPointsOffset: Ref<number[]>
  direction: Ref<DrawerDirection>
  onPress: (event: PointerEvent) => void
  onDrag: (event: PointerEvent) => void
  onRelease: (event: PointerEvent) => void
  closeDrawer: () => void
  shouldFade: Ref<boolean>
  fadeFromIndex: Ref<number | undefined>
  shouldScaleBackground: Ref<boolean | undefined>
  onNestedDrag: (percentageDragged: number) => void
  onNestedRelease: (o: boolean) => void
  onNestedOpenChange: (o: boolean) => void
  emitClose: () => void
  emitDrag: (percentageDragged: number) => void
  emitRelease: (open: boolean) => void
  emitOpenChange: (o: boolean) => void
  nested: Ref<boolean>
  handleOnly: Ref<boolean>
}

export const [injectDrawerRootContext, provideDrawerRootContext]
  = createContext<DrawerRootContext>('DrawerRoot')
