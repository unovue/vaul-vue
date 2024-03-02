<script setup lang="ts">
import { computed, watch } from 'vue'
import { DialogContent } from 'radix-vue'
import { injectDrawerRootContext } from './context'

const {
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
  if (!dismissible.value)
    return

  closeDrawer()
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
    :vaul-drawer-visible="isVisible ? 'true' : 'false'"
    :style="{ '--snap-point-height': snapPointHeight }"
    @pointerdown="onPress"
    @pointermove="onDrag"
    @pointerup="onRelease"
    @pointer-down-outside="handlePointerDownOutside"
  >
    <slot />
  </DialogContent>
</template>
