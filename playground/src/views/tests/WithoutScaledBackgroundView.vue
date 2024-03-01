<script setup lang="ts">
import {
  DrawerClose,
  DrawerContent,
  DrawerOverlay,
  DrawerPortal,
  DrawerRoot,
  DrawerTitle,
  DrawerTrigger,
} from 'vaul-vue'
import { ref } from 'vue'

const open = ref < boolean > (false)
</script>

<template>
  <div
    class="w-screen h-screen bg-white p-8 flex justify-center items-center"
    vaul-drawer-wrapper=""
  >
    <DrawerRoot v-model:open="open">
      <DrawerTrigger as-child>
        <button data-testid="trigger" class="text-2xl">
          Open Drawer
        </button>
      </DrawerTrigger>
      <DrawerPortal>
        <DrawerOverlay data-testid="overlay" class="fixed inset-0 bg-black/40" />
        <DrawerContent
          data-testid="content"
          class="bg-zinc-100 flex flex-col rounded-t-[10px] h-[90%] mt-24 fixed bottom-0 left-0 right-0"
        >
          <div class="p-4 bg-white rounded-t-[10px] flex-1">
            <div class="mx-auto w-12 h-1.5 flex-shrink-0 rounded-full bg-zinc-300 mb-8" />
            <div class="max-w-md mx-auto">
              <DrawerTitle class="font-medium mb-4">
                Unstyled drawer for Vue.
              </DrawerTitle>
            </div>
            <p class="text-zinc-600 mb-2">
              This component can be used as a replacement for a Dialog on mobile and tablet devices.
            </p>
          </div>
          <!-- Move close button to bottom -->
          <DrawerClose data-testid="drawer-close">
            Close
          </DrawerClose>
          <button data-testid="controlled-close" class="text-2xl" @click="open = false">
            Close
          </button>
        </DrawerContent>
      </DrawerPortal>
    </DrawerRoot>
  </div>
</template>

<style scoped></style>
