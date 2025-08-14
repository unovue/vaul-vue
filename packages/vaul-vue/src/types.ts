export interface SnapPoint {
  fraction: number
  height: number
}

export type DrawerSide = 'top' | 'bottom' | 'left' | 'right'

export type AnyFunction = (...args: any) => any

export interface DrawerRootProps {
  snapPoints: number[]
  side: DrawerSide
}

export interface DrawerRootPropsLoose {
  snapPoints?: number[]
  side?: DrawerSide
}
