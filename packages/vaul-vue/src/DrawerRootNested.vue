<script setup lang="ts">
import DrawerRoot from './DrawerRoot.vue'
import { type DialogEmits, type DialogProps } from './controls'
import { injectDrawerRootContext } from './context'
import { useForwardPropsEmits } from 'radix-vue';

const props = defineProps<DialogProps>()
const emits = defineEmits<DialogEmits>()

const { onNestedDrag, onNestedOpenChange, onNestedRelease } = injectDrawerRootContext()
const onClose = () => {
  onNestedOpenChange(false)
}

const onDrag = (p: number) => {
  onNestedDrag(p)
}

const onOpenChange = (o: boolean) => {
  if (o) {
    onNestedOpenChange(o)
  }
  emits('update:open', o)
}

const forwarded = useForwardPropsEmits(props, emits)
</script>

<template>
  <DrawerRoot v-bind="forwarded" nested @close="onClose" @drag="onDrag" @release="onNestedRelease"
    @update:open="onOpenChange">
    <slot />
  </DrawerRoot>
</template>
