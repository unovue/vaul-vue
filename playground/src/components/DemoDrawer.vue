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

const snapPoints = ref([0.5, 0.8])
</script>

<template>
  <DrawerRoot side="left">
    <DrawerTrigger>
      Open sheet 1
    </DrawerTrigger>

    <DrawerPortal>
      <DrawerOverlay class="fixed inset-0 bg-black/75" />

      <DrawerContent class="w-1/2">
        <div class="bg-red-400 h-full p-4 w-full">
          <DrawerHandle />

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
        </div>
      </DrawerContent>
    </DrawerPortal>
  </DrawerRoot>

  <DrawerRoot :snap-points="snapPoints" side="right">
    <DrawerTrigger>
      Drawer Right
    </DrawerTrigger>

    <DrawerPortal>
      <DrawerContent class="bg-gray-300 flex flex-col">
        <div class="flex flex-col gap-4 p-4 h-96">
          <DrawerHandle />
        </div>
      </DrawerContent>
    </DrawerPortal>
  </DrawerRoot>

  <DrawerRoot :snap-points="snapPoints" side="top">
    <DrawerTrigger>
      Drawer Top
    </DrawerTrigger>

    <DrawerPortal>
      <DrawerContent class="bg-gray-300 flex flex-col">
        <div class="flex flex-col gap-4 p-4 h-96">
          <DrawerHandle />
        </div>
      </DrawerContent>
    </DrawerPortal>
  </DrawerRoot>

  <DrawerRoot :snap-points="snapPoints" side="bottom">
    <DrawerTrigger>
      Drawer Bottom
    </DrawerTrigger>

    <DrawerPortal>
      <DrawerContent class="bg-gray-300 flex flex-col">
        <div class="flex flex-col gap-4 p-4 h-96">
          <DrawerHandle />
        </div>
      </DrawerContent>
    </DrawerPortal>
  </DrawerRoot>
</template>
