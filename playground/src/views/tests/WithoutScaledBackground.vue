<script setup lang="ts">
import DemoDrawer from '@/components/DemoDrawer.vue'
import VButton from '@/components/v/Button.vue'
</script>

<template>
  <div class="flex flex-1 items-center justify-center">
    <DemoDrawer
      :scale-background="false"
      :set-background-color-on-scale="false"
    >
      <VButton>Open Drawer</VButton>

      <template #content>
        <p>drawer content. This drawer will not scale background</p>

        <DemoDrawer>
          <VButton>Open Drawer 2</VButton>

          <template #content>
            <p>drawer content 2.</p>
          </template>
        </DemoDrawer>
      </template>
    </DemoDrawer>
  </div>
</template>

<style scoped></style>
