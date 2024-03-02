<script setup lang="ts">
import DemoDrawer from '@/components/DemoDrawer.vue'
import BackgroundTexture from '@/components/BackgroundTexture.vue'
</script>

<template>
  <main vaul-drawer-wrapper>
    <div class="relative">
      <div
        aria-hidden="true"
        class="absolute top-0 w-[1000px] z-10 h-[400px] left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-[0.15] pointer-events-none"
        style="background-image: radial-gradient(#a4a4a3, transparent 50%)"
      />
      <BackgroundTexture />
      <div class="max-w-2xl mx-auto text-center pt-64">
        <div class="flex flex-col relative">
          <h1 class="text-7xl font-semibold mb-4 relative">
            Vaul <span class="text-[#42b883]">Vue</span>
          </h1>
          <h2 class="text-gray-600 text-xl">
            A Vue port of the popular React library created by <a
              target="_blank"
              href="https://emilkowal.ski/" class="underline decoration-1 underline-offset-2 decoration-gray-400"
            > Emil
              Kowalski </a>
          </h2>
        </div>
        <div class="flex gap-4 justify-center mt-6">
          <DemoDrawer />
          <a
            href="https://github.com/radix-vue/vaul-vue" target="_blank"
            class="font-semibold text-sm px-4 py-2.5 hover:bg-gray-100 rounded-full"
          > GitHub <span
            aria-hidden="true"
          >→</span></a>
        </div>
      </div>
    </div>
  </main>
</template>

<style scoped></style>
