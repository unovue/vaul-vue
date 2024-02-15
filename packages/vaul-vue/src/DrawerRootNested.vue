<script setup lang="ts">
import DrawerRoot from './DrawerRoot.vue'
import { type DialogEmits, type DialogProps } from './controls'
import { injectDrawerRootContext } from './context'

const props = defineProps<DialogProps>()
const emits = defineEmits<DialogEmits>()

const { onNestedDrag, onNestedOpenChange, onNestedRelease } = injectDrawerRootContext()
const onClose = () => {
  onNestedOpenChange(false)
  emits('close')
}

const onDrag = (p: number) => {
  onNestedDrag(p)
  emits('drag', p)
}

const onOpenChange = (o: boolean) => {
  if (o) {
    onNestedOpenChange(o)
  }
  emits('update:open', o)
}
</script>

<template>
  <DrawerRoot
    v-bind="props"
    nested
    @close="onClose"
    @drag="onDrag"
    @release="onNestedRelease"
    @update:open="onOpenChange"
  >
    <slot />
  </DrawerRoot>
</template>
