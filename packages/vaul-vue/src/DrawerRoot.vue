<script setup lang="ts">
import type { DrawerRootEmits, DrawerRootProps } from './types/drawer'

import { DialogRoot } from 'reka-ui'

import { useDrawer } from './composables/useDrawer'
import { provideDrawerRootContext } from './context'
import './css/drawer.css'
import './css/overlay.css'
import './css/style.css'

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
  snapPoints: () => [],
  side: 'bottom',
  scaleBackground: true,
  setBackgroundColorOnScale: true,
  defaultOpen: false,
  modal: true,
  handleOnly: false,
  dismissible: true,
  keepMounted: false,
})

const emit = defineEmits<DrawerRootEmits>()

const modelValueOpen = defineModel('open', {
  default: false,
  required: false,
})

const modelValueSnapIndex = defineModel('snap-index', {
  default: 0,
  required: false,
})

modelValueOpen.value = props.defaultOpen

const drawerContext = useDrawer(
  props,
  emit,
  modelValueSnapIndex,
  modelValueOpen,
)

provideDrawerRootContext({
  ...drawerContext,
})
</script>

<template>
  <DialogRoot
    v-slot="{ open, close }"
    v-model:open="modelValueOpen"
    :modal="modal"
  >
    <slot
      :open="open"
      :close="close"
    />
  </DialogRoot>
</template>
