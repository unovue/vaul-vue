<script setup lang="ts">
import { DrawerContent, DrawerOverlay, DrawerPortal, DrawerRoot, DrawerTrigger } from 'vaul-vue'
</script>

<template>
  <div
    class="w-screen h-screen bg-white p-8 flex justify-center items-center"
    vaul-drawer-wrapper=""
  >
    <DrawerRoot should-scale-background>
      <DrawerTrigger
        class="rounded-full bg-white px-4 py-2.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
      >
        <button data-testid="trigger" class="text-2xl">
          Open Drawer
        </button>
      </DrawerTrigger>
      <DrawerPortal>
        <DrawerOverlay data-testid="overlay" class="fixed bg-black/40 inset-0" />
        <DrawerContent
          data-testid="content"
          class="bg-gray-100 flex flex-col rounded-t-[10px] h-full mt-24 max-h-[96%] fixed bottom-0 left-0 right-0"
        >
          <div class="p-4 bg-white rounded-t-[10px] flex-1">
            <div data-testid="handler" class="mx-auto w-12 h-1.5 flex-shrink-0 rounded-full bg-gray-300 mb-8" />
            <div class="max-w-md mx-auto" data-vaul-no-drag>
              <h2 id="radix-:R3emdaH1:" class="font-medium mb-4">
                The whole content is not draggable
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
          </div>
        </DrawerContent>
      </DrawerPortal>
    </DrawerRoot>
  </div>
</template>
