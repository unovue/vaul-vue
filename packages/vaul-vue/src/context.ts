import type { useDrawer } from './composables/useDrawer'
import { createContext } from 'reka-ui'

type DrawerRootContext = ReturnType<typeof useDrawer>

export const [
  injectDrawerRootContext,
  provideDrawerRootContext,
] = createContext<DrawerRootContext>('DrawerRoot')
