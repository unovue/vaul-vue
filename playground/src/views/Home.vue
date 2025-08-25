<script setup lang="ts">
import DemoDrawer from '@/components/DemoDrawer.vue'

import VButton from '@/components/v/Button.vue'
</script>

<template>
  <main class="grow flex items-center justify-center">
    <div class="max-w-2xl mx-auto text-center">
      <div class="flex flex-col relative">
        <h1 class="text-7xl font-semibold mb-4 relative">
          Vaul <span class="text-[#42b883]">Vue</span>
        </h1>
        <h2 class="text-gray-600 text-xl">
          A Vue port of the popular React library created by <a
            target="_blank" href="https://emilkowal.ski/"
            class="underline decoration-1 underline-offset-2 decoration-gray-400"
          > Emil
            Kowalski </a>
        </h2>
      </div>

      <div class="flex gap-4 justify-center mt-6">
        <DemoDrawer>
          <VButton>
            Open sheet
          </VButton>

          <template #content="{ close }">
            <VButton data-testid="close-button" @click="close">
              Close Sheet
            </VButton>
          </template>
        </DemoDrawer>

        <a
          href="https://github.com/unovue/vaul-vue" target="_blank"
          class="font-semibold px-4 py-2 hover:bg-gray-200 transition-colors rounded-lg"
        > GitHub <span
          aria-hidden="true"
        >→</span></a>
      </div>
    </div>
  </main>
</template>
