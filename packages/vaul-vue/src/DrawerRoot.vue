<script setup lang="ts">
import { DialogRoot } from 'reka-ui'
import { useVModel } from '@vueuse/core'
import { type WritableComputedRef, computed, toRefs } from 'vue'
import { provideDrawerRootContext } from './context'
import {
  type DrawerRootEmits,
  type DrawerRootProps,
  useDrawer,
} from './controls'
import { CLOSE_THRESHOLD, SCROLL_LOCK_TIMEOUT, TRANSITIONS } from './constants'
import './style.css'

const props = withDefaults(defineProps<DrawerRootProps>(), {
  open: undefined,
  defaultOpen: undefined,
  fixed: undefined,
  dismissible: true,
  activeSnapPoint: undefined,
  snapPoints: undefined,
  shouldScaleBackground: undefined,
  setBackgroundColorOnScale: true,
  closeThreshold: CLOSE_THRESHOLD,
  fadeFromIndex: undefined,
  nested: false,
  modal: true,
  scrollLockTimeout: SCROLL_LOCK_TIMEOUT,
  direction: 'bottom',
  handleOnly: false,
})

const emit = defineEmits<DrawerRootEmits>()

const slots = defineSlots<{
  default: (props: {
    open: typeof isOpen.value
    close: () => void
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
  isOpen.value = o

  if (o) {
    hasBeenOpened.value = true
  }
  else {
    closeDrawer()
  }
}

defineExpose({
  open: isOpen,
})
</script>

<template>
  <DialogRoot
    v-slot="{ close }"
    :open="isOpen"
    :modal="modal"
    @update:open="handleOpenChange"
  >
    <slot :open="isOpen" :close="close" />
  </DialogRoot>
</template>
