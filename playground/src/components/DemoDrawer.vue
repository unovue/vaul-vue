<script setup lang="ts">
import type { DialogContentProps } from 'reka-ui'
import {
  DrawerContent,
  DrawerHandle,
  DrawerOverlay,
  DrawerPortal,
  DrawerRoot,
  DrawerTrigger,
} from 'vaul-vue'

defineProps<{
  content?: DialogContentProps
}>()
</script>

<template>
  <DrawerRoot v-slot="{ open, close }">
    <DrawerTrigger data-testid="trigger">
      <slot />
    </DrawerTrigger>

    <DrawerPortal>
      <DrawerOverlay
        data-testid="overlay"
        class="fixed inset-0 bg-black/75"
      />

      <DrawerContent
        class="flex flex-col rounded-t-lg bg-neutral-100 border-t border-neutral-300 drop-shadow-lg shadow-black data-[vaul-drawer-side=bottom]:h-1/2 data-[vaul-drawer-side=top]:h-1/2 data-[vaul-drawer-side=left]:w-1/2 data-[vaul-drawer-side=right]:w-1/2"
        v-bind="content"
        data-testid="content"
      >
        <DrawerHandle class="flex items-center justify-center p-4">
          <div class="h-2 w-12 bg-neutral-300 rounded-full" />
        </DrawerHandle>

        <div class="flex flex-1 items-center justify-center gap-4">
          <slot name="content" :open="open" :close="close" />
        </div>
      </DrawerContent>
    </DrawerPortal>
  </DrawerRoot>
</template>
