<script setup lang="ts">
import { type DrawerDirection, DrawerOverlay, DrawerPortal, DrawerRoot, DrawerTrigger } from 'vaul-vue'
import { ref } from 'vue'
import DrawerContentWrapper from './DrawerContent.vue'

const direction = ref<DrawerDirection>('bottom')
</script>

<template>
  <DrawerRoot should-scale-background :direction="direction">
    <DrawerTrigger
      class="rounded-full bg-white px-4 py-2.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
    >
      Open Drawer
    </DrawerTrigger>
    <DrawerPortal>
      <DrawerOverlay class="fixed bg-black/40 inset-0" />
      <DrawerContentWrapper :direction="direction">
        <div class="max-w-md mx-auto">
          <h2 id="radix-:R3emdaH1:" class="font-medium mb-4">
            Drawer for Vue.
          </h2>
          <p class="text-gray-600 mb-2">
            This component can be used as a Dialog replacement on mobile and tablet devices.
          </p>
          <p class="text-gray-600 mb-2">
            It comes unstyled, has gesture-driven animations, and is made by
            <a href="https://emilkowal.ski/" class="underline" target="_blank">Emil Kowalski</a>.
          </p>
          <p class="text-gray-600 mb-8">
            It uses
            <a
              href="https://www.radix-ui.com/docs/primitives/components/dialog"
              class="underline"
              target="_blank"
            >Radix's Dialog primitive</a>
            under the hood and is inspired by
            <a
              href="https://twitter.com/devongovett/status/1674470185783402496"
              class="underline"
              target="_blank"
            >this tweet.</a>
          </p>
        </div>
      </DrawerContentWrapper>
    </DrawerPortal>
  </DrawerRoot>
</template>
