export interface SnapPoint {
  fraction: number
  height: number
}

export type DrawerDirection = 'top' | 'bottom' | 'left' | 'right'

export type AnyFunction = (...args: any) => any
