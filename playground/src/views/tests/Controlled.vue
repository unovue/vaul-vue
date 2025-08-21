<script setup lang="ts">
import DemoDrawer from '@/components/DemoDrawer.vue'
import VButton from '@/components/v/Button.vue'

import { ref } from 'vue'

const open = ref(false)
const fullyControlled = ref(false)
</script>

<template>
  <div class="flex flex-1 gap-4 items-center justify-center">
    <VButton @click="open=true">
      Open using <code>:open</code> prop
    </VButton>

    <DemoDrawer :open="open">
      <VButton>
        Open using default slot
      </VButton>

      <!-- <DrawerTrigger as-child @click="open=true">
        <VButton>Open using prop controlled <code>:open</code></VButton>
      </DrawerTrigger> -->

      <template #content="{ close }">
        <VButton @click="close">Close using v-slot function</VButton>
        <VButton @click="open = false">Close using <code>:open</code></VButton>
      </template>
    </DemoDrawer>

    <DemoDrawer v-model:open="fullyControlled">
      <VButton>
        Open using <code>v-model:code</code>
      </VButton>

      <template #content>
        <VButton @click="fullyControlled = false">
          Close using <code>v-model:code</code>
        </VButton>
      </template>
    </DemoDrawer>
  </div>
</template>

<style scoped></style>
