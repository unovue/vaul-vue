export interface SnapPoint {
  fraction: number
  height: number
}

export type DrawerSide = 'top' | 'bottom' | 'left' | 'right'

export type AnyFunction = (...args: any) => any

export interface DrawerRootProps {
  snapPoints?: number[]
  side?: DrawerSide
  scaleBackground?: boolean
  setBackgroundColorOnScale?: boolean
}

export interface DrawerRootEmits {
  drag: [offset: number]
  snap: [snapPoint: number]
  dismiss: []
}
