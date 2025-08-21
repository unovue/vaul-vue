<script setup lang="ts">
import type { DrawerSide } from 'vaul-vue'
import DemoDrawer from '@/components/DemoDrawer.vue'

import VButton from '@/components/v/Button.vue'
import { ref } from 'vue'

const sides: DrawerSide[] = ['top', 'right', 'bottom', 'left']

const selectedSide = ref<DrawerSide>('bottom')
const open = ref(false)

function changeSide(newSide: DrawerSide) {
  selectedSide.value = newSide
  open.value = true
}
</script>

<template>
  <div class="flex flex-1 items-center justify-center gap-4">
    <VButton
      v-for="side in sides"
      :key="side"
      @click="changeSide(side)"
    >
      Open from {{ side }}
    </VButton>

    <DemoDrawer v-model:open="open" :side="selectedSide">
      <template #content>
        <p>Current side is {{ selectedSide }}</p>
      </template>
    </DemoDrawer>
  </div>
</template>

<style scoped></style>
