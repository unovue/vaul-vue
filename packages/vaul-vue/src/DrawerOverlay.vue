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
    :vaul-drawer-visible="drawerRoot.isVisible ? 'true' : 'false'"
    vaul-overlay=""
    :vaul-snap-points="drawerRoot.isOpen && hasSnapPoints ? 'true' : 'false'"
    :vaul-snap-points-overlay="drawerRoot.isOpen && drawerRoot.shouldFade ? 'true' : 'false'"
  />
</template>

<style scoped></style>
