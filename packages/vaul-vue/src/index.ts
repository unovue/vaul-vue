import DrawerContent from './DrawerContent.vue'
import DrawerHandle from './DrawerHandle.vue'
import DrawerOverlay from './DrawerOverlay.vue'
import DrawerRoot from './DrawerRoot.vue'
import DrawerRootNested from './DrawerRootNested.vue'

export type {
  DrawerRootEmits,
  DrawerRootProps,
} from './controls'

export type {
  DrawerSide,
  SnapPoint,
} from './types'

export {
  DrawerContent,
  DrawerHandle,
  DrawerOverlay,
  DrawerRoot,
  DrawerRootNested,
}

export {
  DialogClose as DrawerClose,
  type DialogCloseProps as DrawerCloseProps,

  DialogDescription as DrawerDescription,
  type DialogDescriptionProps as DrawerDescriptionProps,

  DialogPortal as DrawerPortal,
  type DialogPortalProps as DrawerPortalProps,

  DialogTitle as DrawerTitle,
  type DialogTitleProps as DrawerTitleProps,

  DialogTrigger as DrawerTrigger,
  type DialogTriggerProps as DrawerTriggerProps,
} from 'reka-ui'
