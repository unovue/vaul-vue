<script setup lang="ts">
import DemoDrawer from '@/components/DemoDrawer.vue'
import VButton from '@/components/v/Button.vue'

const open = defineModel('open', {
  default: false,
})
</script>

<template>
  <div class="grid gap-4 place-content-center h-full p-4 justify-items-center">
    <p>This example will not unmount the drawer when closed. You have to set <span>modal</span> to false.</p>
    <p>If <span>modal</span> is not set to false you can't click anything because <span>pointer-events: none</span> is applied to body. by Reka UI</p>

    <DemoDrawer
      v-model:open="open"
      :keep-mounted="true"
      :modal="false"
    >
      <VButton>Open Drawer {{ open }}</VButton>

      <template #content>
        <p>Drawer Content {{ open }}</p>
      </template>
    </DemoDrawer>
  </div>
</template>
