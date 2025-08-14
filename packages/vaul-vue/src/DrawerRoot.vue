<script setup lang="ts">
import type { DrawerRootProps } from './types'
import { syncRef } from '@vueuse/core'
import { DialogRoot } from 'reka-ui'
import { useDrawer } from './composables/useDrawer'
import { useSnapPoints } from './composables/useSnapPoints'
import { provideDrawerRootContext } from './context'

// import type { DrawerRootEmits, DrawerRootProps } from './controls'
// import { useVModel } from '@vueuse/core'
// import { DialogRoot } from 'reka-ui'
// import { computed, ref, toRefs } from 'vue'
// import { CLOSE_THRESHOLD, SCROLL_LOCK_TIMEOUT, TRANSITIONS } from './constants'
// import { provideDrawerRootContext } from './context'
// import { useDrawer } from './controls'
// import { transitionDurationToMs } from './helpers'
// import './style.css'

// const props = withDefaults(defineProps<DrawerRootProps>(), {
//   open: undefined,
//   defaultOpen: undefined,
//   fixed: false,
//   dismissible: true,
//   snapPoints: undefined,
//   shouldScaleBackground: false,
//   setBackgroundColorOnScale: true,
//   closeThreshold: CLOSE_THRESHOLD,
//   fadeFromIndex: undefined,
//   nested: false,
//   modal: true,
//   scrollLockTimeout: SCROLL_LOCK_TIMEOUT,
//   direction: 'bottom',
//   handleOnly: false,
// })

const props = withDefaults(defineProps<DrawerRootProps>(), {
  snapPoints: undefined,
  direction: 'bottom'
})

// const emits = defineEmits<DrawerRootEmits>()

// const slots = defineSlots<{
//   default: (props: {
//     open: typeof open.value
//   }) => any
// }>()

// const open = useVModel(props, 'open', emits, {
//   defaultValue: props.defaultOpen,
//   passive: (props.open === undefined) as false,
// })

// const activeSnapPoint = useVModel(props, 'activeSnapPoint', emits, {
//   passive: (props.activeSnapPoint === undefined) as false,
// })

// const fadeFromIndex = computed(() => props.fadeFromIndex ?? (props.snapPoints && props.snapPoints.length - 1))

// const emitHandlers = {
//   emitDrag: (percentageClosed: number) => emits('drag', percentageClosed),
//   emitRelease: (open: boolean) => emits('release', open),
//   emitClose: () => emits('close'),
//   emitOpenChange: (o: boolean) => {
//     window.setTimeout(() => {
//       emits('animationEnd', o)
//     }, transitionDurationToMs(TRANSITIONS.DURATION))
//   },
// }

// const context = useDrawer({
//   ...emitHandlers,
//   ...toRefs(props),
//   activeSnapPoint,
//   fadeFromIndex,
//   open: open as any,
// })

// const { hasBeenOpened, modal } = context

// provideDrawerRootContext(context)

// const openProxy = computed({
//   get: () => open.value,
//   set: (o: boolean) => {
//     if (!props.dismissible && !open.value)
//       return

//     if (o) {
//       hasBeenOpened.value = true
//     }
//     else {
//       context.closeDrawer(true)
//     }

//     open.value = o
//   },
// })

// defineExpose({
//   open,
// })

const drawerContext = useDrawer(props)
const snapPointsContext = useSnapPoints(props)

const modelValueOpen = defineModel('open', {
  default: false,
  required: false,
})

syncRef(modelValueOpen, drawerContext.open)

provideDrawerRootContext({
  ...drawerContext,
  ...snapPointsContext,
})
</script>

<template>
  <DialogRoot
    v-model:open="modelValueOpen"
    :default-open="modelValueOpen"
  >
    <slot :open="modelValueOpen" />
  </DialogRoot>
</template>
