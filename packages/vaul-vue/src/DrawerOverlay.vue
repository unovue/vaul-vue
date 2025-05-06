<script setup lang="ts">
import { DialogOverlay } from 'reka-ui'
import { injectDrawerRootContext } from './context'

const {
  overlayRef,
  hasSnapPoints,
  open,
  shouldFade,
} = injectDrawerRootContext()

defineExpose({
  el: overlayRef,
})
</script>

<template>
  <DialogOverlay
    ref="overlayRef"
    data-vaul-overlay=""
    :data-vaul-snap-points="open && hasSnapPoints ? 'true' : 'false'"
    :data-vaul-snap-points-overlay="open && shouldFade ? 'true' : 'false'"
  />
</template>

<style scoped></style>
