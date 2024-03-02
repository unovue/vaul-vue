<script setup lang="ts">
import { DialogRoot } from 'radix-vue'
import { useVModel } from '@vueuse/core'
import { type WritableComputedRef, computed, toRefs } from 'vue'
import { provideDrawerRootContext } from './context'
import {
  CLOSE_THRESHOLD,
  type DrawerRootEmits,
  type DrawerRootProps,
  SCROLL_LOCK_TIMEOUT,
  useDrawer,
} from './controls'

const props = withDefaults(defineProps<DrawerRootProps>(), {
  open: undefined,
  fixed: undefined,
  dismissible: true,
  activeSnapPoint: undefined,
  snapPoints: undefined,
  shouldScaleBackground: undefined,
  closeThreshold: CLOSE_THRESHOLD,
  fadeFromIndex: undefined,
  nested: false,
  modal: true,
  scrollLockTimeout: SCROLL_LOCK_TIMEOUT,
})

const emit = defineEmits<DrawerRootEmits>()

const fadeFromIndex = computed(() => props.fadeFromIndex ?? (props.snapPoints && props.snapPoints.length - 1))

const open = useVModel(props, 'open', emit, {
  defaultValue: props.defaultOpen,
  passive: (props.open === undefined) as false,
}) as WritableComputedRef<boolean>

const activeSnapPoint = useVModel(props, 'activeSnapPoint', emit, {
  passive: (props.activeSnapPoint === undefined) as false,
})

const emitHandlers = {
  emitDrag: (percentageDragged: number) => emit('drag', percentageDragged),
  emitRelease: (open: boolean) => emit('release', open),
  emitClose: () => emit('close'),
  emitOpenChange: (o: boolean) => {
    open.value = o
  },
}

const { closeDrawer, hasBeenOpened, modal } = provideDrawerRootContext(
  useDrawer({
    ...emitHandlers,
    ...toRefs(props),
    activeSnapPoint,
    fadeFromIndex,
    open,
  }),
)

function handleOpenChange(o: boolean) {
  if (!o) {
    closeDrawer()
  }
  else {
    hasBeenOpened.value = true
    open.value = o
  }
}
</script>

<template>
  <DialogRoot
    :open="open"
    :modal="modal"
    @update:open="handleOpenChange"
  >
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

[vaul-overlay][vaul-snap-points='true']:not([vaul-snap-points-overlay='true']):not([data-state='closed']) {
  opacity: 0;
}

[vaul-overlay][vaul-snap-points-overlay='true']:not([vaul-drawer-visible='false']) {
  opacity: 1;
}

/* This will allow us to not animate via animation, but still benefit from delaying unmount via Radix. */
@keyframes fake-animation {
  from {}
  to {}
}

@media (hover: hover) and (pointer: fine) {
  [vaul-drawer] {
    user-select: none;
  }
}
</style>
