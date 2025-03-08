<script setup lang="ts">
import { DialogOverlay } from 'reka-ui'
import { computed } from 'vue'
import { injectDrawerRootContext } from './context'

const { overlayRef, hasSnapPoints, isOpen, shouldFade } = injectDrawerRootContext()
</script>

<template>
  <DialogOverlay
    ref="overlayRef"
    data-vaul-overlay=""
    :data-vaul-snap-points="isOpen && hasSnapPoints ? 'true' : 'false'"
    :data-vaul-snap-points-overlay="isOpen && shouldFade ? 'true' : 'false'"
  />
</template>

<style scoped></style>
