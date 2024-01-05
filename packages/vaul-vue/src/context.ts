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
  onPress: (event: PointerEvent) => void
  onDrag: (event: PointerEvent) => void
  onRelease: (event: PointerEvent) => void
  closeDrawer: () => void
  shouldFade: Ref<boolean>
  fadeFromIndex: Ref<number | undefined>
  shouldScaleBackground: Ref<boolean>
  onNestedDrag: (event: PointerEvent, percentageDragged: number) => void
  onNestedRelease: (event: PointerEvent, o: boolean) => void
  onNestedOpenChange: (o: boolean) => void
  onCloseProp: Ref<(() => void) | undefined>
  onOpenChangeProp: Ref<((open: boolean) => void) | undefined>
  onDragProp: Ref<((event: PointerEvent, percentageDragged: number) => void) | undefined>
  onReleaseProp: Ref<((event: PointerEvent, open: boolean) => void) | undefined>
  nested: Ref<boolean>
}

export const [injectDrawerRootContext, provideDrawerRootContext] =
  createContext<DrawerRootContext>('DrawerRoot')
