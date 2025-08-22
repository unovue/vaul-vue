<script setup lang="ts">
import DemoDrawer from '@/components/DemoDrawer.vue'
import VButton from '@/components/v/Button.vue'

import { ref } from 'vue'

const open = ref<boolean>(false)
</script>

<template>
  <div class="flex flex-1 items-center justify-center">
    <DemoDrawer
      v-model:open="open"
      :dismissible="false"
    >
      <VButton>Open Drawer</VButton>

      <template #content>
        <div class="flex flex-col items-center gap-4">
          <p>This drawer is not dismissible. Dragging it down or clicking outside won't close it.</p>
          <p>If you want to disable dragging too you can checkout No Drag Element example. It uses data-vaul-no-drag attribute</p>

          <VButton @click="open = false">
            Close
          </VButton>
        </div>
      </template>
    </DemoDrawer>
  </div>
</template>
