<script setup lang="ts">
import DemoDrawer from '@/components/DemoDrawer.vue'
import VButton from '@/components/v/Button.vue'

const open = defineModel('open', {
  default: false
})
</script>

<template>
  <div class="flex flex-col gap-4 flex-1 items-center justify-center">
    <p>This example will not unmount the drawer when closed. You have to set <code>modal</code> to false.</p>
    <p>If <code>modal</code> is not set to false you can't click anything because <code>pointer-events: none</code> is applied to body. by Reka UI</p>

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
