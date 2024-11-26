<script setup lang="ts">
import { injectDrawerRootContext } from './context'

const {
  onPress,
  onDrag,
  handleOnly,
} = injectDrawerRootContext()

function handlePointerDown(event: PointerEvent) {
  if (handleOnly.value)
    onPress(event)
}

function handleOnDrag(event: PointerEvent) {
  if (handleOnly.value)
    onDrag(event)
}
</script>

<template>
  <div
    @pointerdown="handlePointerDown"
    @pointermove="handleOnDrag"
  >
    <slot />
  </div>
</template>
