<script setup lang="ts">
import { DialogRoot } from 'reka-ui'
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
import { TRANSITIONS } from './constants'
import './style.css'

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

    setTimeout(() => {
      emit('animationEnd', o)
    }, TRANSITIONS.DURATION * 1000)
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
