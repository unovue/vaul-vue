import type { useDrawer } from './controls'
import { createContext } from 'reka-ui'

type DrawerRootContext = ReturnType<typeof useDrawer>

export const [
  injectDrawerRootContext,
  provideDrawerRootContext,
] = createContext<DrawerRootContext>('DrawerRoot')
