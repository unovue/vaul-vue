<script setup lang="ts">
import { DialogRoot } from 'radix-vue'
import { provideDrawerRootContext } from './context'
import { type DialogEmits, type DialogProps, useDrawer } from './controls'
import { toRefs } from 'vue'

const props = toRefs(
  withDefaults(defineProps<DialogProps>(), {
    open: undefined,
    fixed: undefined,
    dismissible: true,
    activeSnapPoint: undefined,
    snapPoints: undefined,
    shouldScaleBackground: undefined,
    closeThreshold: undefined,
    fadeFromIndex: undefined,
    nested: false,
    modal: true,
    scrollLockTimeout: undefined
  })
)

const emit = defineEmits<DialogEmits>()

const emitHandlers = {
  emitDrag: (percentageDragged: number) => emit('drag', percentageDragged),
  emitRelease: (open: boolean) => emit('release', open),
  emitClose: () => emit('close'),
  emitOpenChange: (open: boolean) => emit('update:open', open)
}

const { isOpen, closeDrawer, hasBeenOpened, modal } = provideDrawerRootContext(
  useDrawer({ ...props, ...emitHandlers })
)

// if (props.snapPoints) {
//   snapPoints.value = props.snapPoints
//   activeSnapPoint.value = props.snapPoints[0]
// }
//
// if (props.shouldScaleBackground) {
//   shouldScaleBackground.value = props.shouldScaleBackground
// }
//
// fadeFromIndex.value = props.fadeFromIndex ?? (snapPoints.value && snapPoints.value.length - 1)
//
// if (props.nested) {
//   nested.value = props.nested
// }
//
// dismissible.value = props.dismissible ?? dismissible.value

const handleOpenChange = (o: boolean) => {
  // if (props.open !== undefined) {
  //   emit('update:open', o)
  //   return
  // }

  if (!o) {
    closeDrawer()
  } else {
    hasBeenOpened.value = true
    isOpen.value = true
  }
}
//
// watch(open, (o) => handleOpenChange(o), { immediate: true })
</script>

<template>
  <DialogRoot :open="isOpen" @update:open="handleOpenChange" :modal="modal">
    <slot />
  </DialogRoot>
</template>

<style>
[vaul-drawer] {
  touch-action: none;
  transform: translate3d(0, 100%, 0);
  transition: transform 0.5s cubic-bezier(0.32, 0.72, 0, 1);
}

.vaul-dragging .vaul-scrollable {
  overflow-y: hidden !important;
}

[vaul-drawer][vaul-drawer-visible='true'] {
  transform: translate3d(0, var(--snap-point-height, 0), 0);
}

[vaul-overlay] {
  opacity: 0;
  transition: opacity 0.5s cubic-bezier(0.32, 0.72, 0, 1);
}

[vaul-overlay][vaul-drawer-visible='true'] {
  opacity: 1;
}

[vaul-drawer]::after {
  content: '';
  position: absolute;
  top: 100%;
  background: inherit;
  background-color: inherit;
  left: 0;
  right: 0;
  height: 200%;
}

[vaul-overlay][vaul-snap-points='true']:not([vaul-snap-points-overlay='true']):not(
    [data-state='closed']
  ) {
  opacity: 0;
}

[vaul-overlay][vaul-snap-points-overlay='true']:not([vaul-drawer-visible='false']) {
  opacity: 1;
}

/* This will allow us to not animate via animation, but still benefit from delaying unmount via Radix. */
@keyframes fake-animation {
  from {
  }
  to {
  }
}

@media (hover: hover) and (pointer: fine) {
  [vaul-drawer] {
    user-select: none;
  }
}
</style>
