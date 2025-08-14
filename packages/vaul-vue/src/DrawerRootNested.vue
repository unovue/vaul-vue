<script setup lang="ts">
import { useVModel } from '@vueuse/core'
import { useForwardPropsEmits } from 'reka-ui'
import { computed } from 'vue'
import type { DrawerRootEmits, DrawerRootProps } from './controls'
import { injectDrawerRootContext } from './context'
import DrawerRoot from './DrawerRoot.vue'

const props = defineProps<DrawerRootProps>()

const emits = defineEmits<DrawerRootEmits>()

const {
  onNestedDrag,
  onNestedOpenChange,
  onNestedRelease,
} = injectDrawerRootContext()

const delegatedProps = computed(() => {
  const { nested: _, ...delegated } = props

  return delegated
})

const forwarded = useForwardPropsEmits(delegatedProps, emits)
</script>

<template>
  <DrawerRoot
    nested
    v-bind="forwarded"
    @update:open="(o) => {
      if (o) {
        onNestedOpenChange(o);
      }
    }"
    @close="onNestedOpenChange(false)"
    @drag="onNestedDrag"
    @release="onNestedRelease"
  >
    <slot />
  </DrawerRoot>
</template>
