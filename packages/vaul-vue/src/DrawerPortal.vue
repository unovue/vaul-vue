<script setup lang="ts">
import { DialogPortal, Presence } from 'reka-ui'
import { injectDrawerRootContext } from './context'

const { shouldMount, keepMounted } = injectDrawerRootContext()
</script>

<template>
  <Presence :present="keepMounted ? true : shouldMount">
    <DialogPortal>
      <slot />
    </DialogPortal>
  </Presence>
</template>
