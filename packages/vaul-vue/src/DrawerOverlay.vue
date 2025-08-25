<script setup lang="ts">
import { DialogOverlay } from 'reka-ui'
import { injectDrawerRootContext } from './context'

const { drawerOverlayRef } = injectDrawerRootContext()
</script>

<template>
  <DialogOverlay
    ref="drawerOverlayRef"
    data-vaul-overlay
    force-mount
  />

  <!-- <DialogOverlay
    ref="overlayRef"
    data-vaul-overlay=""
    :data-vaul-snap-points="open && hasSnapPoints ? 'true' : 'false'"
    :data-vaul-snap-points-overlay="open && shouldFade ? 'true' : 'false'"
  /> -->
</template>
