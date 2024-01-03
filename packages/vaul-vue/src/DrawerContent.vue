<script setup lang="ts">
import { computed, useAttrs, watch } from 'vue'
import { DialogContent } from 'radix-vue'
import { injectDrawerRootContext } from './context'

const { isOpen, isVisible, snapPointsOffset, drawerRef, handlePointerDown, handlePointerMove, handlePointerUp } = injectDrawerRootContext()

const attrs = useAttrs()

const snapPointHeight = computed(() => {
  if (snapPointsOffset.value && snapPointsOffset.value.length > 0) {
    return `${snapPointsOffset.value[0]}px`
  }
  return '0'
})

watch(
  () => isOpen.value,
  (isOpen) => {
    if (isOpen) {
      setTimeout(() => {
        isVisible.value = true
      }, 1)
    }
  }
)
</script>

<template>
  <DialogContent
    vaul-drawer=""
    :vaul-drawer-visible="isVisible ? 'true' : 'false'"
    ref="drawerRef"
    :style="[attrs.style, { '--snap-point-height': snapPointHeight }]"
    @pointerdown="handlePointerDown"
    @pointermove="handlePointerMove"
    @pointerup="handlePointerUp"
  >
    <slot />
  </DialogContent>
</template>
