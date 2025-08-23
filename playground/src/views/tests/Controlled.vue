<script setup lang="ts">
import DemoDrawer from '@/components/DemoDrawer.vue'
import VButton from '@/components/v/Button.vue'

import { ref } from 'vue'

const open = ref(false)
const fullyControlled = ref(false)
</script>

<template>
  <div class="flex flex-1 gap-4 items-center justify-center">
    <VButton data-testid="trigger-open-prop" @click="open = true">
      Open using <code>:open</code> prop
    </VButton>

    <DemoDrawer :open="open">
      <VButton>
        Open using default slot
      </VButton>

      <template #content="{ close }">
        <VButton @click="close">
          Close using v-slot function
        </VButton>
        <VButton data-testid="trigger-open-prop-close" @click="open = false">
          Close using <code>:open</code>
        </VButton>
      </template>
    </DemoDrawer>

    <VButton data-testid="trigger-v-model" @click="fullyControlled = true">
      Open using <code>v-model:code</code>
    </VButton>

    <DemoDrawer v-model:open="fullyControlled">
      <template #content>
        <VButton data-testid="trigger-v-model-close" @click="fullyControlled = false">
          Close using <code>v-model:code</code>
        </VButton>
      </template>
    </DemoDrawer>
  </div>
</template>

<style scoped></style>
