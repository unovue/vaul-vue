export const TRANSITIONS = {
  DURATION: null as unknown as string,
  EASE: null as unknown as string,
}

export function refreshTransitionsCache() {
  const styles = getComputedStyle(document.documentElement)
  TRANSITIONS.DURATION = styles.getPropertyValue('--vaul-duration')
  TRANSITIONS.EASE = styles.getPropertyValue('--vaul-easing')
}

export const VELOCITY_THRESHOLD = 0.4

export const CLOSE_THRESHOLD = 0.25

export const SCROLL_LOCK_TIMEOUT = 100

export const NESTED_DISPLACEMENT_SCALE = 12

export const NESTED_DISPLACEMENT = 22

export const DRAG_CLASS = 'vaul-dragging'
