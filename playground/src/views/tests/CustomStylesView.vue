<script setup lang="ts">
import {
  DrawerOverlay,
  DrawerPortal,
  DrawerRoot,
  DrawerTitle,
  DrawerTrigger,
} from 'vaul-vue'
import DrawerContentWrapper from '@/components/DrawerContent.vue'
</script>

<template>
  <div
    class="w-screen h-screen bg-white p-8 flex flex-col gap-6 justify-center items-center"
    data-vaul-drawer-wrapper
  >
    <DrawerRoot direction="right" should-scale-background no-body-styles>
      <DrawerTrigger as-child>
        <button data-testid="trigger" class="text-2xl">
          Open Drawer
        </button>
      </DrawerTrigger>
      <DrawerPortal>
        <DrawerOverlay data-testid="overlay" class="fixed inset-0 bg-black/40" />
        <DrawerContentWrapper direction="right" class="w-[50%] max-w-[600px]">
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

<style>
:root {
  --vaul-duration: 1s;
  --vaul-easing: linear(
    0, 0.002, 0.01 3.6%, 0.034, 0.074 9.1%, 0.128 11.4%, 0.194 13.4%, 0.271 15%,
    0.344 16.1%, 0.544, 0.66 20.6%, 0.717 22.4%, 0.765 24.6%, 0.808 27.3%,
    0.845 30.4%, 0.883 35.1%, 0.916 40.6%, 0.942 47.2%, 0.963 55%, 0.979 64%,
    0.991 74.4%, 0.998 86.4%, 1
  );
}

body {
  background: radial-gradient(
    circle at 50% 50%,
    rgba(9, 5, 31, 0.5) 0%,
    rgba(0, 17, 50, 0.5) 50%,
    rgba(41, 41, 41, 0) 100%
  );
}

#app {
  perspective: 1600px;
}

[data-vaul-drawer-wrapper] {
  --vaul-wrapper-border-radius: 2rem;
  --vaul-wrapper-scale-px-unitless: 0;

  translate: none;
  scale: none;
  transition-property: transform, border-radius, filter;
  transition-timing-function: ease;
  filter: blur(calc(var(--vaul-opened-percentage) * 4px)) brightness(calc(1 - var(--vaul-opened-percentage) * 0.4));
  transform:
    scale(calc(var(--vaul-wrapper-target-size) / var(--vaul-window-opposite-size)))
    translate3d(calc(var(--vaul-opened-percentage) * 5%), 0, calc(var(--vaul-opened-percentage) * -200px))
    rotate3d(0, calc(var(--vaul-opened-percentage) * 3), calc(var(--vaul-opened-percentage) * -0.4), calc(var(--vaul-opened-percentage) * 40deg));
}
</style>
