<script setup lang="ts">
import type { DrawerSide } from 'vaul-vue'
import {
  DrawerContent,
  DrawerHandle,
  DrawerOverlay,
  DrawerPortal,
  DrawerRoot,

  DrawerTitle,
  DrawerTrigger,
} from 'vaul-vue'
import { nextTick, ref } from 'vue'

const sides = ['left', 'top', 'right', 'bottom'] satisfies DrawerSide[]

const snapPoints = ref([0.5, 0.8])

const i = 2

const side = ref(sides[i])
const sideIndex = ref(i)
</script>

<template>
  <DrawerRoot
    :snap-points="snapPoints" side="left" @snap="(s) => {
      console.log('on snap', s)
    }"
    @drag="() => {
      console.log('drag')
    }"
  >
    <DrawerTrigger>
      Drawer Left
    </DrawerTrigger>

    <DrawerPortal>
      <DrawerOverlay class="fixed inset-0 bg-black/75" />

      <DrawerContent class="bg-gray-300 flex flex-col">
        <div class="flex flex-col gap-4 p-4 h-96">
          <DrawerHandle />
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
