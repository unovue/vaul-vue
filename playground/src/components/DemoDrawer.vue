<script setup lang="ts">
import {
  DrawerContent,
  DrawerHandle,
  DrawerOverlay,
  DrawerPortal,
  DrawerRoot,
  DrawerTrigger,
} from 'vaul-vue'
</script>

<template>
  <DrawerRoot v-slot="{ close, open }">
    <DrawerTrigger>
      <slot :close="close" :open="open" />
    </DrawerTrigger>

    <DrawerPortal>
      <DrawerOverlay class="fixed inset-0 bg-black/75" />

      <DrawerContent class="flex flex-col rounded-t-lg h-1/2 bg-neutral-100 border-t border-neutral-300 drop-shadow-lg shadow-black">
        <DrawerHandle class="flex items-center justify-center p-4">
          <div class="h-2 w-12 bg-neutral-300 rounded-full" />
        </DrawerHandle>

        <slot name="content" :close="close" :open="open" />
      </DrawerContent>
    </DrawerPortal>
  </DrawerRoot>
</template>
