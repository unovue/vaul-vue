<script setup lang="ts">
import { ref } from 'vue'
import { injectDrawerRootContext } from './context'
import type { DrawerHandleProps } from './controls'

const props = withDefaults(defineProps<DrawerHandleProps>(), {
  preventCycle: false,
})

const LONG_HANDLE_PRESS_TIMEOUT = 250
const DOUBLE_TAP_TIMEOUT = 120

const { onPress, onDrag, handleRef, handleOnly, isOpen, snapPoints, activeSnapPoint, isDragging, dismissible, closeDrawer }
    = injectDrawerRootContext()

const closeTimeoutId = ref<number | null>(null)
const shouldCancelInteraction = ref(false)

function handleStartCycle() {
  // Stop if this is the second click of a double click
  if (shouldCancelInteraction.value) {
    handleCancelInteraction()
    return
  }

  window.setTimeout(() => {
    handleCycleSnapPoints()
  }, DOUBLE_TAP_TIMEOUT)
}

function handleCycleSnapPoints() {
  // Prevent accidental taps while resizing drawer
  if (isDragging.value || props.preventCycle || shouldCancelInteraction.value) {
    handleCancelInteraction()
    return
  }

  // Make sure to clear the timeout id if the user releases the handle before the cancel timeout
  handleCancelInteraction()

  if (!snapPoints.value || snapPoints.value.length === 0) {
    if (!dismissible.value)
      closeDrawer()

    return
  }

  const isLastSnapPoint = activeSnapPoint.value === snapPoints.value[snapPoints.value.length - 1]

  if (isLastSnapPoint && dismissible.value) {
    closeDrawer()
    return
  }

  const currentSnapIndex = snapPoints.value.findIndex(point => point === activeSnapPoint.value)

  if (currentSnapIndex === -1)
    return // activeSnapPoint not found in snapPoints

  const nextSnapPointIndex = isLastSnapPoint ? 0 : currentSnapIndex + 1

  activeSnapPoint.value = snapPoints.value[nextSnapPointIndex]
}

function handleStartInteraction() {
  closeTimeoutId.value = window.setTimeout(() => {
    // Cancel click interaction on a long press
    shouldCancelInteraction.value = true
  }, LONG_HANDLE_PRESS_TIMEOUT)
}

function handleCancelInteraction() {
  if (closeTimeoutId.value)
    window.clearTimeout(closeTimeoutId.value)

  shouldCancelInteraction.value = false
}

function handlePointerDown(event: PointerEvent) {
  if (handleOnly.value)
    onPress(event)
  handleStartInteraction()
}

function handleOnDrag(event: PointerEvent) {
  if (handleOnly.value)
    onDrag(event)
}
</script>

<template>
  <div
    ref="handleRef"
    :data-vaul-drawer-visible="isOpen ? 'true' : 'false'"
    data-vaul-handle=""
    aria-hidden="true"
    @click="handleStartCycle"
    @pointercancel="handleCancelInteraction"
    @pointerdown="handlePointerDown"
    @pointermove="handleOnDrag"
  >
    <span data-vaul-handle-hitarea="" aria-hidden="true">
      <slot />
    </span>
  </div>
</template>
