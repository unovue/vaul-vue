<script setup lang="ts">
import { DialogOverlay } from 'radix-vue'
import { computed } from 'vue'
import { injectDrawerRootContext } from './context'

const drawerRoot = injectDrawerRootContext()

const hasSnapPoints = computed(
  () => drawerRoot.snapPoints && (drawerRoot.snapPoints.value?.length ?? 0) > 0
)
</script>

<template>
  <DialogOverlay
    :ref="drawerRoot.overlayRef"
    :vaul-drawer-visible="drawerRoot.isVisible.value ? 'true' : 'false'"
    vaul-overlay=""
    :vaul-snap-points="drawerRoot.isOpen.value && hasSnapPoints ? 'true' : 'false'"
    :vaul-snap-points-overlay="drawerRoot.isOpen.value && drawerRoot.shouldFade.value ? 'true' : 'false'"
  />
</template>

<style scoped></style>
