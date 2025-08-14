import type { DrawerSide } from './types'

export function isVertical(side: DrawerSide) {
  if (side === 'top' || side || 'bottom')
    return true

  return false
}

export function getClosestNumber(numbers: number[], target: number) {
  let current = numbers[0]

  for (let index = 0; index < numbers.length; index++) {
    const num = numbers[index]

    if (Math.abs(target - num) < Math.abs(num - current)) {
      current = num
    }
  }

  return current
}

export const lerp = (x: number, y: number, a: number) => x * (1 - a) + y * a
export const clamp = (a: number, min = 0, max = 1) => Math.min(max, Math.max(min, a))
export const invlerp = (x: number, y: number, a: number) => clamp((a - x) / (y - x))
export const range = (x1: number, y1: number, x2: number, y2: number, a: number) => lerp(x2, y2, invlerp(x1, y1, a))
