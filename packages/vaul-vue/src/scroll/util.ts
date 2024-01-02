// HTML input types that do not cause the software keyboard to appear.
const nonTextInputTypes = new Set([
  'checkbox',
  'radio',
  'range',
  'color',
  'file',
  'image',
  'button',
  'submit',
  'reset'
])

export function chain(...callbacks: any[]): (...args: any[]) => void {
  return (...args: any[]) => {
    for (const callback of callbacks) {
      if (typeof callback === 'function') {
        callback(...args)
      }
    }
  }
}

export function isScrollable(node: Element): boolean {
  const style = window.getComputedStyle(node)
  return /(auto|scroll)/.test(style.overflow + style.overflowX + style.overflowY)
}

export function getScrollParent(node: Element): Element {
  if (isScrollable(node)) {
    node = node.parentElement as HTMLElement
  }

  while (node && !isScrollable(node)) {
    node = node.parentElement as HTMLElement
  }

  return node || document.scrollingElement || document.documentElement
}

export function addEvent<K extends keyof GlobalEventHandlersEventMap>(
  target: EventTarget,
  event: K,
  handler: (this: Document, ev: GlobalEventHandlersEventMap[K]) => any,
  options?: boolean | AddEventListenerOptions
) {
  // @ts-ignore
  target.addEventListener(event, handler, options)

  return () => {
    // @ts-ignore
    target.removeEventListener(event, handler, options)
  }
}

// Sets a CSS property on an element, and returns a function to revert it to the previous value.
export function setStyle<T>(
  element: HTMLElement,
  style: keyof Omit<CSSStyleDeclaration, 'length' | 'parentRule' | number | typeof Symbol.iterator>,
  value: string
) {
  const cur = element.style[style]
  element.style[style] = value as any

  return () => {
    element.style[style] = cur as any
  }
}

export function scrollIntoView(target: Element) {
  const root = document.scrollingElement || document.documentElement
  while (target && target !== root) {
    // Find the parent scrollable element and adjust the scroll position if the target is not already in view.
    const scrollable = getScrollParent(target)
    if (
      scrollable !== document.documentElement &&
      scrollable !== document.body &&
      scrollable !== target
    ) {
      const scrollableTop = scrollable.getBoundingClientRect().top
      const targetTop = target.getBoundingClientRect().top
      const targetBottom = target.getBoundingClientRect().bottom
      const keyboardHeight = scrollable.getBoundingClientRect().bottom

      if (targetBottom > keyboardHeight) {
        scrollable.scrollTop += targetTop - scrollableTop
      }
    }

    // @ts-ignore
    target = scrollable.parentElement
  }
}

export function isInput(target: Element) {
  return (
    (target instanceof HTMLInputElement && !nonTextInputTypes.has(target.type)) ||
    target instanceof HTMLTextAreaElement ||
    (target instanceof HTMLElement && target.isContentEditable)
  )
}
