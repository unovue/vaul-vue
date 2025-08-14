<script setup lang="ts">
import {
  DrawerContent,
  DrawerHandle,
  DrawerOverlay,
  DrawerPortal,
  DrawerRoot,
  DrawerTitle,
  DrawerTrigger,
} from 'vaul-vue'
</script>

<template>
  <DrawerRoot :snap-points="[0.2]">
    <DrawerTrigger>
      OpenDrawer
    </DrawerTrigger>

    <DrawerPortal>
      <DrawerContent class="bg-gray-300 flex flex-col rounded-t-lg fixed bottom-0 left-0 right-0">
        <div class="p-4 h-96">
          <DrawerHandle />

          <p>a lot of content wow</p>
        </div>
      </DrawerContent>
    </DrawerPortal>
  </DrawerRoot>
</template>
