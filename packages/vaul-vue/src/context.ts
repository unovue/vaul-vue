import type { ComponentPublicInstance, Ref } from 'vue'
import { createContext } from './shared/createContext'

export interface DrawerRootContext {
  isOpen: Ref<boolean>
  hasBeenOpened: Ref<boolean>
  isVisible: Ref<boolean>
  drawerRef: Ref<ComponentPublicInstance | null>
  overlayRef: Ref<ComponentPublicInstance | null>
  isDragging: Ref<boolean>
  dragStartTime: Ref<Date>
  isAllowedToDrag: Ref<boolean>
  snapPoints: Ref<(number | string)[] | undefined>
  activeSnapPoint: Ref<number | string | null>
  pointerStartY: Ref<number>
  dismissible: Ref<boolean>
  drawerHeightRef: Ref<number>
  snapPointsOffset: Ref<number[]>
  handlePointerDown: (event: PointerEvent) => void
  handlePointerMove: (event: PointerEvent) => void
  handlePointerUp: (event: PointerEvent) => void
  closeDrawer: () => void
}

export const [injectDrawerRootContext, provideDrawerRootContext] =
  createContext<DrawerRootContext>('DrawerRoot')
