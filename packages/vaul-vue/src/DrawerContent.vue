<script setup lang="ts">
import { computed, watch } from 'vue'
import { DialogContent } from 'reka-ui'
import { injectDrawerRootContext } from './context'

const {
  open,
  isOpen,
  isVisible,
  snapPointsOffset,
  drawerRef,
  onPress,
  onDrag,
  onRelease,
  modal,
  emitOpenChange,
  dismissible,
  keyboardIsOpen,
  closeDrawer,
  direction,
  handleOnly,
} = injectDrawerRootContext()

const snapPointHeight = computed(() => {
  if (snapPointsOffset.value && snapPointsOffset.value.length > 0)
    return `${snapPointsOffset.value[0]}px`

  return '0'
})

function handlePointerDownOutside(event: Event) {
  if (!modal.value || event.defaultPrevented) {
    event.preventDefault()
    return
  }
  if (keyboardIsOpen.value)
    keyboardIsOpen.value = false

  event.preventDefault()

  if (dismissible.value)
    emitOpenChange(false)
  if (!dismissible.value || open.value !== undefined)
    return

  closeDrawer()
}

function handlePointerDown(event: PointerEvent) {
  if (handleOnly.value)
    return

  onPress(event)
}

function handleOnDrag(event: PointerEvent) {
  if (handleOnly.value)
    return

  onDrag(event)
}

watch(
  isOpen,
  (open) => {
    if (open) {
      setTimeout(() => {
        isVisible.value = true
      }, 1)
    }
  },
  { immediate: true },
)
</script>

<template>
  <DialogContent
    ref="drawerRef"
    vaul-drawer=""
    :vaul-drawer-direction="direction"
    :vaul-drawer-visible="isVisible ? 'true' : 'false'"
    :style="{ '--snap-point-height': snapPointHeight }"
    @pointerdown="handlePointerDown"
    @pointermove="handleOnDrag"
    @pointerup="onRelease"
    @pointer-down-outside="handlePointerDownOutside"
    @escape-key-down="(event) => {
      if (!dismissible)
        event.preventDefault()
    }"
  >
    <slot />
  </DialogContent>
</template>
