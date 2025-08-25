<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { DialogContent } from 'reka-ui'
import { computed, toValue } from 'vue'
import { injectDrawerRootContext } from './context'

const { drawerContentRef, onDrag, onDragEnd, onDragStart, isDragging, initialContainerStyle, handleOnly, dismissible, side } = injectDrawerRootContext()

const eventListeners = computed(() => !toValue(handleOnly)
  ? {
    onPointerdown: onDragStart,
    onPointerup: onDragEnd,
    onPointermove: onDrag,
  } satisfies HTMLAttributes
  : {})
</script>

<template>
  <DialogContent
    ref="drawerContentRef"
    :style="initialContainerStyle"
    data-vaul-drawer
    :data-vaul-drawer-dragging="isDragging"
    :data-vaul-drawer-side="side"
    force-mount
    v-bind="eventListeners"
    @escape-key-down="(event) => {
      if (dismissible)
        return

      event.preventDefault()
    }"
    @pointer-down-outside="(event) => {
      if (dismissible)
        return

      event.preventDefault()
    }"
  >
    <slot />
  </DialogContent>
</template>
