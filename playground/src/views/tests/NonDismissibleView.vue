<script setup lang="ts">
import {
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
    <DrawerRoot v-model:open="open" :dismissible="false">
      <DrawerTrigger as-child>
        <button data-testid="trigger" class="text-2xl">
          Open Drawer
        </button>
      </DrawerTrigger>
      <DrawerPortal>
        <DrawerOverlay data-testid="overlay" class="fixed inset-0 bg-black/40" />
        <DrawerContent
          data-testid="content"
          class="bg-zinc-100 flex flex-col rounded-t-[10px] h-[96%] mt-24 fixed bottom-0 left-0 right-0"
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
          <button
            type="button"
            data-testid="dismiss-button"
            class="rounded-md mb-6 w-full bg-gray-900 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-gray-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-600"
            @click="() => (open = false)"
          >
            Click to close
          </button>
        </DrawerContent>
      </DrawerPortal>
    </DrawerRoot>
  </div>
</template>

<style scoped></style>
