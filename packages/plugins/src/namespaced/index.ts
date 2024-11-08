import { DrawerRoot, DrawerClose, DrawerContent, DrawerDescription, DrawerPortal, DrawerTitle, DrawerTrigger, DrawerOverlay, DrawerRootNested } from 'vaul-vue'

export const Drawer = {
  Root: DrawerRoot,
  Content: DrawerContent,
  Overlay: DrawerOverlay,
  RootNested: DrawerRootNested,
  Close: DrawerClose,
  Portal: DrawerPortal,
  Trigger: DrawerTrigger,
  Title: DrawerTitle,
  Description: DrawerDescription,
} as {
  Root: typeof DrawerRoot
  Content: typeof DrawerContent
  Overlay: typeof DrawerOverlay
  RootNested: typeof DrawerRootNested
  Close: typeof DrawerClose
  Portal: typeof DrawerPortal
  Trigger: typeof DrawerTrigger
  Title: typeof DrawerTitle
  Description: typeof DrawerDescription
}
