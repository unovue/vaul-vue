<script setup lang="ts">
import { useForwardPropsEmits } from 'reka-ui'
import DrawerRoot from './DrawerRoot.vue'
import type { DrawerRootEmits, DrawerRootProps } from './controls'
import { injectDrawerRootContext } from './context'

const props = defineProps<DrawerRootProps>()
const emits = defineEmits<DrawerRootEmits>()
const slots = defineSlots<{
  default: (props: {
    close: () => void
  }) => any
}>()

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
    v-slot="{ close }"
    v-bind="forwarded"
    nested
    @close="onClose"
    @drag="onDrag"
    @release="onNestedRelease"
    @update:open="onOpenChange"
  >
    <slot :close="close" />
  </DrawerRoot>
</template>
