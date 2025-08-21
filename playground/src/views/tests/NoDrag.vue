<script setup lang="ts">
import DemoDrawer from '@/components/DemoDrawer.vue';
import VButton from '@/components/v/Button.vue';
</script>

<template>
  <div class="flex flex-1 gap-4 items-center justify-center">
    <DemoDrawer :dismissible="false">
      <VButton>
        Open Drawer
      </VButton>

      <template #content>
        <div class="flex flex-col flex-1 h-full">
          <div class="flex-1 flex items-center justify-center">
            <p>This container can be dragged</p>
          </div>

          <div
            data-vaul-no-drag
            class="flex-1 bg-neutral-300 flex items-center justify-center"
          >
            <p>This container can't be dragged because of <code>data-vaul-no-drag</code> attribute</p>
          </div>
        </div>
      </template>
    </DemoDrawer>
  </div>
</template>
