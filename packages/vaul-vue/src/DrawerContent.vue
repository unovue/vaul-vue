<script setup lang="ts">
import { DialogContent } from 'reka-ui'
import { computed, toValue } from 'vue'
import { injectDrawerRootContext } from './context'
// import { computed, ref, watchEffect } from 'vue'
// import { injectDrawerRootContext } from './context'

// const {
//   open,
//   snapPointsOffset,
//   hasSnapPoints,
//   drawerRef,
//   onPress,
//   onDrag,
//   onRelease,
//   modal,
//   emitOpenChange,
//   dismissible,
//   keyboardIsOpen,
//   direction,
//   handleOnly,
// } = injectDrawerRootContext()

// const delayedSnapPoints = ref(false)

// const snapPointHeight = computed(() => {
//   if (snapPointsOffset.value && snapPointsOffset.value.length > 0)
//     return `${snapPointsOffset.value[0]}px`

//   return '0'
// })

// function handlePointerDownOutside(event: Event) {
//   if (!modal.value || event.defaultPrevented) {
//     event.preventDefault()
//     return
//   }
//   if (keyboardIsOpen.value)
//     keyboardIsOpen.value = false

//   if (dismissible.value) {
//     open.value = false
//     emitOpenChange(false)
//   }
//   else {
//     event.preventDefault()
//   }
// }

// function handlePointerDown(event: PointerEvent) {
//   if (handleOnly.value)
//     return

//   onPress(event)
// }

// function handleOnDrag(event: PointerEvent) {
//   if (handleOnly.value)
//     return

//   onDrag(event)
// }

// watchEffect (() => {
//   if (hasSnapPoints.value) {
//     window.requestAnimationFrame(() => {
//       delayedSnapPoints.value = true
//     })
//   }
// })

const { drawerContentRef, onDrag, onDragEnd, onDragStart, isDragging, side, initialContainerStyle, handleOnly } = injectDrawerRootContext()

const eventListeners = computed(() => !toValue(handleOnly)
  ? {
      onPointerdown: onDragStart,
      onPointerup: onDragEnd,
      onpointermove: onDrag,
      onPointercancel: () => {
        console.log('pointercancel')
      }
    }
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
  >
    <!-- ref="drawerRef"
    data-vaul-drawer=""
    :data-vaul-drawer-direction="direction"
    :data-vaul-delayed-snap-points="delayedSnapPoints ? 'true' : 'false'"
    :data-vaul-snap-points="open && hasSnapPoints ? 'true' : 'false'"
    :style="{ '--vaul-snap-point-height': snapPointHeight }"
    @pointerdown="handlePointerDown"
    @pointermove="handleOnDrag"
    @pointerup="onRelease"
    @pointer-down-outside="handlePointerDownOutside"
    @open-auto-focus.prevent
    @escape-key-down="(event) => {
      if (!dismissible)
        event.preventDefault()
    }" -->
    <slot />
  </DialogContent>
</template>
