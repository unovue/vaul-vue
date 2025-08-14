import type { useDrawer } from './composables/useDrawer'
import type { useSnapPoints } from './composables/useSnapPoints'
import { createContext } from 'reka-ui'

type DrawerRootContext = ReturnType<typeof useDrawer> & ReturnType<typeof useSnapPoints>

export const [
  injectDrawerRootContext,
  provideDrawerRootContext,
] = createContext<DrawerRootContext>('DrawerRoot')
