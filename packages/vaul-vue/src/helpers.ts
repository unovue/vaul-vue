interface Style {
  [key: string]: string
}

const cache = new WeakMap()

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
  if (!el || !(el instanceof HTMLElement) || !styles)
    return
  const originalStyles: Style = {}

  Object.entries(styles).forEach(([key, value]: [string, string]) => {
    if (key.startsWith('--')) {
      el.style.setProperty(key, value)
      return
    }

    originalStyles[key] = (el.style as any)[key];
    (el.style as any)[key] = value
  })

  if (ignoreCache)
    return

  cache.set(el, originalStyles)
}

export function reset(el: Element | HTMLElement | null, prop?: string) {
  if (!el || !(el instanceof HTMLElement))
    return
  const originalStyles = cache.get(el)

  if (!originalStyles)
    return

  if (prop) {
    ; (el.style as any)[prop] = originalStyles[prop]
  }
  else {
    Object.entries(originalStyles).forEach(([key, value]) => {
      ; (el.style as any)[key] = value
    })
  }
}

export function getTranslateY(element: HTMLElement): number | null {
  const style = window.getComputedStyle(element)
  const transform
    // @ts-expect-error some custom style only exist in certain browser
    = style.transform || style.webkitTransform || style.mozTransform
  let mat = transform.match(/^matrix3d\((.+)\)$/)
  if (mat)
    return Number.parseFloat(mat[1].split(', ')[13])
  mat = transform.match(/^matrix\((.+)\)$/)
  return mat ? Number.parseFloat(mat[1].split(', ')[5]) : null
}

export function dampenValue(v: number) {
  return 8 * (Math.log(v + 1) - 2)
}
