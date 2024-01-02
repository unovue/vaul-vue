<script setup lang="ts">
import {
  DrawerRoot,
  DrawerTrigger,
  DrawerOverlay,
  DrawerContent,
  DrawerPortal,
  DrawerTitle
} from 'vaul-vue'
</script>

<template>
  <DrawerRoot>
    <!-- <DrawerRoot :snap-points="['148px', '355px', 1]"> -->
    <DrawerTrigger> Open </DrawerTrigger>
    <DrawerPortal>
      <DrawerOverlay class="fixed bg-black/40 inset-0" />
      <DrawerContent
        class="bg-gray-100 flex flex-col rounded-t-[10px] h-full mt-24 max-h-[96%] fixed bottom-0 left-0 right-0 vaul-dragging p-4"
      >
        <DrawerTitle class="text-xl font-bold">Drawer</DrawerTitle>
        <div class="mt-4">
          <p class="text-sm">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, voluptatum.
          </p>
        </div>
      </DrawerContent>
    </DrawerPortal>
  </DrawerRoot>
</template>
