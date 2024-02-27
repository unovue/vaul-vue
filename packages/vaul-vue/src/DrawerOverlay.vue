<script setup lang="ts">
import { DialogOverlay } from 'radix-vue'
import { computed } from 'vue'
import { injectDrawerRootContext } from './context'

const { overlayRef, snapPoints, isVisible, isOpen, shouldFade } = injectDrawerRootContext()

const hasSnapPoints = computed(() => snapPoints && (snapPoints.value?.length ?? 0) > 0)
</script>

<template>
  <DialogOverlay
    ref="overlayRef"
    :vaul-drawer-visible="isVisible ? 'true' : 'false'"
    vaul-overlay=""
    :vaul-snap-points="isOpen && hasSnapPoints ? 'true' : 'false'"
    :vaul-snap-points-overlay="isOpen && shouldFade ? 'true' : 'false'"
  />
</template>

<style scoped></style>
