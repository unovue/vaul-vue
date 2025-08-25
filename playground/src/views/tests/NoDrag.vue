<script setup lang="ts">
import DemoDrawer from '@/components/DemoDrawer.vue'
import VButton from '@/components/v/Button.vue'
</script>

<template>
  <div class="flex flex-1 gap-4 items-center justify-center">
    <DemoDrawer>
      <VButton>
        Open Drawer
      </VButton>

      <template #content>
        <div class="flex flex-col flex-1 h-full gap-4">
          <div data-testid="drag" class="flex-1 flex items-center justify-center p-14 border border-neutral-300 rounded-lg">
            <p>This container can be dragged</p>
          </div>

          <div
            data-vaul-no-drag
            class="flex-1 bg-neutral-200 flex items-center rounded-lg justify-center p-14"
          >
            <p>This container can't be dragged because of <span>data-vaul-no-drag</span> attribute</p>
          </div>
        </div>
      </template>
    </DemoDrawer>
  </div>
</template>
