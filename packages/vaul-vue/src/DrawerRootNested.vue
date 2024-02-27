<script setup lang="ts">
import { useForwardPropsEmits } from 'radix-vue'
import DrawerRoot from './DrawerRoot.vue'
import type { DialogEmits, DialogProps } from './controls'
import { injectDrawerRootContext } from './context'

const props = defineProps<DialogProps>()
const emits = defineEmits<DialogEmits>()

const { onNestedDrag, onNestedOpenChange, onNestedRelease } = injectDrawerRootContext()
function onClose() {
  onNestedOpenChange(false)
}

function onDrag(p: number) {
  onNestedDrag(p)
}

function onOpenChange(o: boolean) {
  if (o)
    onNestedOpenChange(o)

  emits('update:open', o)
}

const forwarded = useForwardPropsEmits(props, emits)
</script>

<template>
  <DrawerRoot
    v-bind="forwarded"
    nested
    @close="onClose"
    @drag="onDrag"
    @release="onNestedRelease"
    @update:open="onOpenChange"
  >
    <slot />
  </DrawerRoot>
</template>
