<script setup lang="ts">
import {
  DrawerContent,
  DrawerHandle,
  DrawerOverlay,
  DrawerPortal,
  DrawerRoot,
  DrawerTrigger,
} from 'vaul-vue'
import { ref } from 'vue'
</script>

<template>
  <DrawerRoot side="left" handle-only>
    <DrawerTrigger>
      Open sheet 1
    </DrawerTrigger>

    <DrawerPortal>
      <DrawerOverlay class="fixed inset-0 bg-black/75" />

      <DrawerContent class="flex justify-between w-1/2">
        <div class="flex justify-between bg-neutral-100 rounded-r-lg drop-shadow shadow-black h-full w-full">
          <DrawerRoot side="bottom">
            <DrawerTrigger>
              Open sheet 2
            </DrawerTrigger>

            <DrawerPortal>
              <DrawerContent class="h-1/2">
                <div class="bg-blue-400 p-4 h-full">
                  <p>nested draver content here</p>

                  <DrawerRoot>
                    <DrawerTrigger>Open sheet 3</DrawerTrigger>

                    <DrawerPortal>
                      <DrawerContent class="h-1/2">
                        <div class="bg-purple-400 p-4 h-full">
                          <p>sheet 3 content</p>
                        </div>
                      </DrawerContent>
                    </DrawerPortal>
                  </DrawerRoot>
                </div>
              </DrawerContent>
            </DrawerPortal>
          </DrawerRoot>

          <DrawerHandle class="flex items-center h-full p-4">
            <div class="w-3 h-12 bg-neutral-200 rounded-full" />
          </DrawerHandle>
        </div>
      </DrawerContent>
    </DrawerPortal>
  </DrawerRoot>
</template>
