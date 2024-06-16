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
  defaultOpen: undefined,
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
  direction: 'bottom',
})

const emit = defineEmits<DrawerRootEmits>()

const slots = defineSlots<{
  default: (props: {
    open: typeof isOpen.value
  }) => any
}>()

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
    emit('update:open', o)
  },
}

const { closeDrawer, hasBeenOpened, modal, isOpen } = provideDrawerRootContext(
  useDrawer({
    ...emitHandlers,
    ...toRefs(props),
    activeSnapPoint,
    fadeFromIndex,
    open,
  }),
)

function handleOpenChange(o: boolean) {
  if (open.value !== undefined) {
    emitHandlers.emitOpenChange(o)
    return
  }
  if (!o) {
    closeDrawer()
  }
  else {
    hasBeenOpened.value = true
    isOpen.value = o
  }
}

defineExpose({
  open: isOpen,
})
</script>

<template>
  <DialogRoot
    :open="isOpen"
    :modal="modal"
    @update:open="handleOpenChange"
  >
    <slot :open="isOpen" />
  </DialogRoot>
</template>

<style>
[vaul-drawer] {
  touch-action: none;
  will-change: transform;
  transition: transform 0.5s cubic-bezier(0.32, 0.72, 0, 1);
}

[vaul-drawer][vaul-drawer-direction='bottom'] {
  transform: translate3d(0, 100%, 0);
}

[vaul-drawer][vaul-drawer-direction='top'] {
  transform: translate3d(0, -100%, 0);
}

[vaul-drawer][vaul-drawer-direction='left'] {
  transform: translate3d(-100%, 0, 0);
}

[vaul-drawer][vaul-drawer-direction='right'] {
  transform: translate3d(100%, 0, 0);
}

.vaul-dragging .vaul-scrollable [vault-drawer-direction='top'] {
  overflow-y: hidden !important;
}
.vaul-dragging .vaul-scrollable [vault-drawer-direction='bottom'] {
  overflow-y: hidden !important;
}

.vaul-dragging .vaul-scrollable [vault-drawer-direction='left'] {
  overflow-x: hidden !important;
}

.vaul-dragging .vaul-scrollable [vault-drawer-direction='right'] {
  overflow-x: hidden !important;
}

[vaul-drawer][vaul-drawer-visible='true'][vaul-drawer-direction='top'] {
  transform: translate3d(0, var(--snap-point-height, 0), 0);
}

[vaul-drawer][vaul-drawer-visible='true'][vaul-drawer-direction='bottom'] {
  transform: translate3d(0, var(--snap-point-height, 0), 0);
}

[vaul-drawer][vaul-drawer-visible='true'][vaul-drawer-direction='left'] {
  transform: translate3d(var(--snap-point-height, 0), 0, 0);
}

[vaul-drawer][vaul-drawer-visible='true'][vaul-drawer-direction='right'] {
  transform: translate3d(var(--snap-point-height, 0), 0, 0);
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
  background: inherit;
  background-color: inherit;
}

[vaul-drawer][vaul-drawer-direction='top']::after {
  top: initial;
  bottom: 100%;
  left: 0;
  right: 0;
  height: 200%;
}

[vaul-drawer][vaul-drawer-direction='bottom']::after {
  top: 100%;
  bottom: initial;
  left: 0;
  right: 0;
  height: 200%;
}

[vaul-drawer][vaul-drawer-direction='left']::after {
  left: initial;
  right: 100%;
  top: 0;
  bottom: 0;
  width: 200%;
}

[vaul-drawer][vaul-drawer-direction='right']::after {
  left: 100%;
  right: initial;
  top: 0;
  bottom: 0;
  width: 200%;
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
