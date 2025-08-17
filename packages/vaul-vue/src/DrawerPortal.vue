<script setup lang="ts">
import { DialogPortal } from 'reka-ui'
import { injectDrawerRootContext } from './context'

const { shouldMount } = injectDrawerRootContext()
</script>

<template>
  <DialogPortal v-if="shouldMount">
    <slot />
  </DialogPortal>
</template>
