<script setup lang="ts">
import { DialogOverlay } from 'radix-vue'
import { computed } from 'vue'
import { injectDrawerRootContext } from './context'

const drawerRoot = injectDrawerRootContext()

const hasSnapPoints = computed(() => drawerRoot.snapPoints && drawerRoot.snapPoints.length > 0)
</script>

<template>
  <DialogOverlay
    :ref="drawerRoot.overlayRef"
    :vaul-drawer-visible="drawerRoot.isVisible ? 'true' : 'false'"
    vaul-overlay=""
    :vaul-snap-points="drawerRoot.isOpen && hasSnapPoints ? 'true' : 'false'"
  />
</template>

<style scoped></style>
