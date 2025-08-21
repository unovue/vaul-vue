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
  <DrawerRoot v-slot="{ open, close }">
    <DrawerTrigger>
      <slot />
    </DrawerTrigger>

    <DrawerPortal>
      <DrawerOverlay class="fixed inset-0 bg-black/75" />

      <DrawerContent class="flex flex-col rounded-t-lg h-1/2 bg-neutral-100 border-t border-neutral-300 drop-shadow-lg shadow-black">
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
