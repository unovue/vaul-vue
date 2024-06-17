<script setup lang="ts">
import {
  DrawerClose,
  type DrawerDirection,
  DrawerOverlay,
  DrawerPortal,
  DrawerRoot,
  DrawerTitle,
  DrawerTrigger,
} from 'vaul-vue'
import { ref } from 'vue'
import { useRoute } from 'vue-router'
import DrawerContentWrapper from '../../components/DrawerContent.vue'

const route = useRoute()
const direction = ref<DrawerDirection>(route.query.direction as DrawerDirection ?? 'bottom')
</script>

<template>
  <div
    class="w-screen h-screen bg-white p-8 flex justify-center items-center"
    vaul-drawer-wrapper=""
  >
    <DrawerRoot :direction="direction">
      <DrawerTrigger as-child>
        <button data-testid="trigger" class="text-2xl">
          Open Drawer
        </button>
      </DrawerTrigger>
      <DrawerPortal>
        <DrawerOverlay data-testid="overlay" class="fixed inset-0 bg-black/40" />
        <DrawerContentWrapper
          :direction="direction"
        >
          <div class="max-w-md mx-auto">
            <DrawerTitle class="font-medium mb-4">
              Unstyled drawer for Vue.
            </DrawerTitle>
            <p class="text-zinc-600 mb-2">
              This component can be used as a replacement for a Dialog on mobile and tablet devices.
            </p>
          </div>
        </DrawerContentWrapper>
      </DrawerPortal>
    </DrawerRoot>
  </div>
</template>

<style scoped></style>
