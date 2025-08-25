<script setup lang="ts">
import DemoDrawer from '@/components/DemoDrawer.vue'
import VButton from '@/components/v/Button.vue'
</script>

<template>
  <div class="flex flex-1 items-center justify-center">
    <DemoDrawer>
      <VButton data-testid="trigger-1">Open Drawer</VButton>

      <template #content>
        <p data-testid="content-nested-1">Drawer content</p>

        <DemoDrawer>
          <VButton data-testid="trigger-2">Open another drawer</VButton>

          <template #content>
            <p data-testid="content-nested-2">Drawer Content 2</p>

            <DemoDrawer side="left">
              <VButton>Open another one! but from left</VButton>

              <template #content>
                <p>Drawer Content 3</p>
              </template>
            </DemoDrawer>
          </template>
        </DemoDrawer>
      </template>
    </DemoDrawer>
  </div>
</template>
