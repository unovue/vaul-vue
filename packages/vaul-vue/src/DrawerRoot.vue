<script setup lang="ts">
import type { DrawerRootEmits, DrawerRootProps } from './controls'
import { DialogRoot } from 'reka-ui'
import { computed, ref, toRefs } from 'vue'
import { CLOSE_THRESHOLD, SCROLL_LOCK_TIMEOUT, TRANSITIONS } from './constants'
import { provideDrawerRootContext } from './context'
import { useDrawer } from './controls'
import { transitionDurationToMs } from './helpers'
import './style.css'

const props = withDefaults(defineProps<DrawerRootProps>(), {
  fixed: false,
  dismissible: true,
  snapPoints: undefined,
  shouldScaleBackground: false,
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
    open: typeof open.value
  }) => any
}>()

const open = defineModel<boolean>('open', {
  required: false,
  default: false,
})

const activeSnapPoint = defineModel<number | string | null>('activeSnapPoint', {
  required: false,
  default: null,
})

const defaultOpen = ref(open.value)

const fadeFromIndex = computed(() => props.fadeFromIndex ?? (props.snapPoints && props.snapPoints.length - 1))

const emitHandlers = {
  emitDrag: (percentageClosed: number) => emit('drag', percentageClosed),
  emitRelease: (open: boolean) => emit('release', open),
  emitClose: () => emit('close'),
  emitOpenChange: (o: boolean) => {
    window.setTimeout(() => {
      emit('animationEnd', o)
    }, transitionDurationToMs(TRANSITIONS.DURATION))
  },
}

const context = useDrawer({
  ...emitHandlers,
  ...toRefs(props),
  activeSnapPoint,
  fadeFromIndex,
  open,
})

const { hasBeenOpened, modal } = context

provideDrawerRootContext(context)

const openProxy = computed({
  get: () => open.value,
  set: (o: boolean) => {
    open.value = o

    if (o) {
      hasBeenOpened.value = true
    }
  },
})

defineExpose({
  open,
})
</script>

<template>
  <DialogRoot
    v-model:open="openProxy"
    :default-open="defaultOpen"
    :modal="modal"
  >
    <slot :open="open" />
  </DialogRoot>
</template>
