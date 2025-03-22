<script setup lang="ts">
import {
  DrawerClose,
  DrawerContent,
  type DrawerDirection,
  DrawerOverlay,
  DrawerPortal,
  DrawerRoot,
  DrawerRootNested,
  DrawerTitle,
  DrawerTrigger,
} from 'vaul-vue'
import { computed, ref } from 'vue'

const open = ref(false)
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
  'bg-zinc-100 flex flex-col fixed overflow-hidden',
  `rounded-${directionShortOpposite.value}-[10px]`,
  `m${directionShortOpposite.value}-24`,
  isVertical.value ? 'w-[100%] h-[96%]' : 'w-[96%] h-[100%]',
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
  <div class="w-screen h-screen bg-white p-8 flex flex-col gap-6 justify-center items-center" data-vaul-drawer-wrapper="">
    <div class="flex gap-2 items-center">
      <label for="direction">Direction</label>
      <select id="direction" v-model="direction" class="p-2">
        <option value="left">
          Left
        </option>
        <option value="right">
          Right
        </option>
        <option value="top">
          Top
        </option>
        <option value="bottom">
          Bottom
        </option>
      </select>
    </div>

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
          <div class="p-4 bg-white flex-1 flex" :class="contentInnerClasses">
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
                    <div class="p-4 bg-white flex-1 flex" :class="contentInnerClasses">
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

<style scoped></style>
