<script setup lang="ts">
import { DialogRoot } from 'radix-vue'
import { provideDrawerRootContext } from './context'
import { type DialogProps, drawerContext } from './controls'

const props = defineProps<DialogProps>()

const { isOpen, hasBeenOpened, snapPoints, activeSnapPoint, closeDrawer } =
  provideDrawerRootContext(drawerContext)

if (props.snapPoints) {
  snapPoints.value = props.snapPoints
  activeSnapPoint.value = props.snapPoints[0]
}

const handleOpenChange = (o: boolean) => {
  if (!o) {
    closeDrawer()
  } else {
    hasBeenOpened.value = true
    isOpen.value = o
  }
}
</script>

<template>
  <DialogRoot @update:open="handleOpenChange" :open="isOpen">
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
