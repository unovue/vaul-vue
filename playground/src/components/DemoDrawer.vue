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
import { ref } from 'vue'

const snapPoints = ref([0.5])

function addSnapPoint() {
  snapPoints.value.push(0.8)
}
</script>

<template>
  <DrawerRoot :snap-points="snapPoints">
    <DrawerTrigger>
      OpenDrawer, content height smaller than 0.5 snap point
    </DrawerTrigger>

    <DrawerPortal>
      <DrawerContent class="bg-gray-300 flex flex-col rounded-t-lg fixed bottom-0 left-0 right-0">
        <div class="p-4 h-96">
          <DrawerHandle />

          <p>{{ snapPoints }}</p>
          <button @click="addSnapPoint">
            add snap point
          </button>
        </div>
      </DrawerContent>
    </DrawerPortal>
  </DrawerRoot>
</template>
