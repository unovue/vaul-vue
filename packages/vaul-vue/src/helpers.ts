import type { DrawerDirection } from './types'

interface Style {
  [key: string]: string | null
}

const cache = new WeakMap()

export function getWrapper() {
  const wrapper = document.querySelector('[data-vaul-drawer-wrapper]')
    || document.querySelector('[vaul-drawer-wrapper]')

  if (!wrapper) {
    console.warn('[vaul-vue] Wrapper not found')
    return null
  }

  return wrapper as HTMLElement
}

export function isInView(el: HTMLElement): boolean {
  const rect = el.getBoundingClientRect()

  if (!window.visualViewport)
    return false

  return (
    rect.top >= 0
    && rect.left >= 0
    // Need + 40 for safari detection
    && rect.bottom <= window.visualViewport.height - 40
    && rect.right <= window.visualViewport.width
  )
}

export function set(el?: Element | HTMLElement | null, styles?: Style, ignoreCache = false) {
  if (!(el instanceof HTMLElement) || !styles)
    return

  const originalStyles: Style = {}

  for (const [prop, value] of Object.entries(styles) as [string, string][]) {
    originalStyles[prop] = el.style.getPropertyValue(prop)
    el.style.setProperty(prop, value)
  }

  if (ignoreCache)
    return

  cache.set(el, originalStyles)
}

export function reset(el: Element | HTMLElement | null, forceRemoveProps?: string[]) {
  if (!(el instanceof HTMLElement))
    return

  if (forceRemoveProps) {
    for (const prop of forceRemoveProps) {
      el.style.removeProperty(prop)
    }

    return
  }

  const originalStyles = cache.get(el)

  if (originalStyles) {
    for (const [prop, value] of Object.entries(originalStyles)) {
      el.style.setProperty(prop, value as string)
    }
  }
}

export function getTranslate(element: HTMLElement, direction: DrawerDirection): number | null {
  const style = window.getComputedStyle(element)
  const transform
    // @ts-expect-error some custom style only exist in certain browser
    = style.transform || style.webkitTransform || style.mozTransform
  let mat = transform.match(/^matrix3d\((.+)\)$/)
  if (mat) {
    // https://developer.mozilla.org/en-US/docs/Web/CSS/transform-function/matrix3d
    return Number.parseFloat(mat[1].split(', ')[isVertical(direction) ? 13 : 12])
  }
  // https://developer.mozilla.org/en-US/docs/Web/CSS/transform-function/matrix
  mat = transform.match(/^matrix\((.+)\)$/)
  return mat ? Number.parseFloat(mat[1].split(', ')[isVertical(direction) ? 5 : 4]) : null
}

export function dampenValue(v: number) {
  return 8 * (Math.log(v + 1) - 2)
}

export function clamp(min: number, value: number, max: number) {
  return Math.min(Math.max(value, min), max)
}

export function isVertical(direction: DrawerDirection) {
  switch (direction) {
    case 'top':
    case 'bottom':
      return true
    case 'left':
    case 'right':
      return false
    default:
      return direction satisfies never
  }
}

export function getDirectionMultiplier(direction: DrawerDirection) {
  switch (direction) {
    case 'bottom':
    case 'right':
      return 1
    case 'top':
    case 'left':
      return -1
    default:
      return direction satisfies never
  }
}

export function transitionDurationToMs(duration: string) {
  const factor = duration.endsWith('ms') ? 1 : 1000
  return Number.parseFloat(duration) * factor
}
