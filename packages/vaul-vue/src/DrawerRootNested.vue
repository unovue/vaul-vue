<script setup lang="ts">
import DrawerRoot from './DrawerRoot.vue'
import { type DialogProps } from './controls'
import { injectDrawerRootContext } from './context'

const { onNestedDrag, onNestedOpenChange, onNestedRelease } = injectDrawerRootContext()

const props = defineProps<DialogProps>()
const onClose = () => {
  console.log('Nested', 'onClose')
  onNestedOpenChange(false)
}

const onDrag = (e: PointerEvent, p: number) => {
  console.log('Nested', 'onDrag')
  onNestedDrag(e, p)
  props.onDrag?.(e, p)
}

const onOpenChange = (o: boolean) => {
  console.log('Nested', 'onOpenChange')
  if (o) {
    onNestedOpenChange(o)
  }
  props.onOpenChange?.(o)
}
</script>

<template>
  <DrawerRoot
    nested
    :onClose="onClose"
    :onDrag="onDrag"
    :onOpenChange="onOpenChange"
    :onRelease="onNestedRelease"
  >
    <slot />
  </DrawerRoot>
</template>
