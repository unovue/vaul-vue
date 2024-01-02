<script setup lang="ts">
import { computed, useAttrs, watch } from 'vue'
import { DialogContent } from 'radix-vue'
import { injectDrawerRootContext } from './context'

const drawerRoot = injectDrawerRootContext()

const attrs = useAttrs()

const snapPointHeight = computed(() => {
  if (drawerRoot.snapPointsOffset.value && drawerRoot.snapPointsOffset.value.length > 0) {
    return `${drawerRoot.snapPointsOffset.value[0]}px`
  }
  return '0'
})

watch(
  () => drawerRoot.isOpen.value,
  (isOpen) => {
    if (isOpen) {
      setTimeout(() => {
        drawerRoot.isVisible.value = true
      }, 1)
    }
  }
)
</script>

<template>
  <DialogContent
    vaul-drawer=""
    :vaul-drawer-visible="drawerRoot.isVisible.value ? 'true' : 'false'"
    :ref="drawerRoot.drawerRef"
    :style="[attrs.style, { '--snap-point-height': snapPointHeight }]"
    @pointerdown="drawerRoot.handlePointerDown"
    @pointermove="drawerRoot.handlePointerMove"
    @pointerup="drawerRoot.handlePointerUp"
  >
    <slot />
  </DialogContent>
</template>
