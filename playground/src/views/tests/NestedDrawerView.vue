<script setup lang="ts">
import type { DrawerDirection } from 'vaul-vue'
import {
  DrawerClose,
  DrawerContent,
  DrawerOverlay,
  DrawerPortal,
  DrawerRoot,
  DrawerRootNested,
  DrawerTitle,
  DrawerTrigger,
} from 'vaul-vue'

import { computed, ref } from 'vue'
import DirectionSwitcher from '@/components/DirectionSwitcher.vue'

const direction = ref<DrawerDirection>('bottom')

const directionShort = computed(() => {
  switch (direction.value) {
    case 'top': return 't'
    case 'bottom': return 'b'
    case 'left': return 'l'
    case 'right': return 'r'
    default: return direction.value satisfies never
  }
})

const directionShortOpposite = computed(() => {
  switch (direction.value) {
    case 'top': return 'b'
    case 'bottom': return 't'
    case 'left': return 'r'
    case 'right': return 'l'
    default: return direction.value satisfies never
  }
})

const inset = computed(() => {
  switch (direction.value) {
    case 'top': return 'top-0 left-0 right-0'
    case 'bottom': return 'bottom-0 left-0 right-0'
    case 'left': return 'top-0 bottom-0 left-0'
    case 'right': return 'top-0 bottom-0 right-0'
    default: return direction.value satisfies never
  }
})

const isVertical = computed(() => direction.value === 'top' || direction.value === 'bottom')

const contentClasses = computed(() => [
  'bg-zinc-100 flex flex-col fixed',
  `rounded-${directionShortOpposite.value}-[10px]`,
  `m${directionShortOpposite.value}-24`,
  isVertical.value ? 'w-[100%] h-[96%] max-h-[800px]' : 'w-[96%] max-w-[800px] h-[100%]',
  inset.value,
])

const handleClasses = computed(() => [
  'flex-shrink-0 rounded-full bg-zinc-300',
  isVertical.value ? 'mx-auto w-12 h-1.5' : 'my-auto w-1.5 h-12',
  `m${directionShort.value}-8`,
])

const contentInnerClasses = computed(() => {
  switch (direction.value) {
    case 'top': return 'flex-col-reverse'
    case 'bottom': return 'flex-col'
    case 'left': return 'flex-row-reverse items-center'
    case 'right': return 'flex-row items-center'
    default: return direction.value satisfies never
  }
})
</script>

<template>
  <div class="w-screen h-screen bg-white p-8 flex flex-col gap-6 justify-center items-center" data-vaul-drawer-wrapper>
    <DirectionSwitcher v-model="direction"/>

    <DrawerRoot should-scale-background :direction="direction">
      <DrawerTrigger as-child>
        <button data-testid="trigger" class="text-2xl">
          Open Drawer
        </button>
      </DrawerTrigger>
      <DrawerPortal>
        <DrawerOverlay data-testid="overlay" class="fixed inset-0 bg-black/40" />
        <DrawerContent
          data-testid="content"
          :class="contentClasses"
        >
          <div class="p-4 flex-1 flex" :class="contentInnerClasses">
            <div :class="handleClasses" />
            <div class="max-w-md mx-auto">
              <DrawerTitle class="font-medium mb-4">
                Unstyled drawer for Vue.
              </DrawerTitle>
              <p class="text-zinc-600 mb-2">
                This component can be used as a replacement for a Dialog on mobile and tablet
                devices.
              </p>
              <DrawerRootNested :direction="direction">
                <DrawerTrigger as-child>
                  <button data-testid="nested-trigger" class="text-2xl">
                    Open Second Drawer
                  </button>
                </DrawerTrigger>
                <DrawerPortal>
                  <DrawerOverlay data-testid="nested-overlay" class="fixed inset-0 bg-black/40" />
                  <DrawerContent
                    data-testid="nested-content"
                    :class="contentClasses"
                  >
                    <div class="p-4 flex-1 flex" :class="contentInnerClasses">
                      <div :class="handleClasses" />
                      <div class="max-w-md mx-auto">
                        <DrawerTitle class="font-medium mb-4">
                          Unstyled drawer for Vue.
                        </DrawerTitle>
                        <p class="text-zinc-600 mb-2">
                          This component can be used as a replacement for a Dialog on mobile
                          and tablet devices.
                        </p>
                        <p class="text-gray-600 mb-2">
                          Place a <span
                            class="font-mono text-[15px] font-semibold"
                          >`Drawer.NestedRoot`</span> inside another drawer
                          and it will be nested automatically for you.
                        </p>
                        <DrawerClose data-testid="nested-close">
                          Close
                        </DrawerClose>
                      </div>
                    </div>
                  </DrawerContent>
                </DrawerPortal>
              </DrawerRootNested>
            </div>
          </div>
        </DrawerContent>
      </DrawerPortal>
    </DrawerRoot>
  </div>
</template>

<style>
:root {
  --vaul-duration: 1s;
  --vaul-easing: linear(
    0, 0.007, 0.029 2.1%, 0.118 4.6%, 0.626 14%, 0.828, 0.964 23.2%, 1.01,
    1.043 28.1%, 1.065 31.4%, 1.071 35.2%, 1.062 39.5%, 1.015 52.2%, 0.999 60.4%,
    0.995 69.6%, 1
  );
}
</style>
