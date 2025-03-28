<script setup lang="ts">
import type { DrawerRootEmits, DrawerRootProps } from './controls'
import { useForwardPropsEmits } from 'reka-ui'
import { injectDrawerRootContext } from './context'
import DrawerRoot from './DrawerRoot.vue'
import { watchEffect } from 'vue';

const props = defineProps<DrawerRootProps>()

const emits = defineEmits<DrawerRootEmits>()

const {
  onNestedDrag,
  onNestedOpenChange,
  onNestedRelease,
} = injectDrawerRootContext()

const open = defineModel<boolean>('open', {
  required: false,
  default: false,
})

const activeSnapPoint = defineModel<number | string | null>('activeSnapPoint', {
  required: false,
  default: null,
})

const forwarded: ReturnType<typeof useForwardPropsEmits> = useForwardPropsEmits(props, emits)

watchEffect(() => {
  onNestedOpenChange(open.value)
})
</script>

<template>
  <DrawerRoot
    v-bind="forwarded"
    v-model:open="open"
    :should-scale-background="false"
    :active-snap-point="activeSnapPoint"
    nested
    @close="onNestedOpenChange(false)"
    @drag="onNestedDrag"
    @release="onNestedRelease"
  >
    <slot />
  </DrawerRoot>
</template>
