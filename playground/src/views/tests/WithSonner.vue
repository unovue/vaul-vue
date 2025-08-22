<script setup lang="ts">
import DemoDrawer from '@/components/DemoDrawer.vue'
import VButton from '@/components/v/Button.vue'
import { toast } from 'vue-sonner'

const open = defineModel('open', {
  default: false,
})

function openToast() {
  toast('Example Toast', {
    position: 'top-right',
    action: {
      label: 'Accept',
    },
  })
}
</script>

<template>
  <div class="flex flex-col gap-4 flex-1 items-center justify-center">
    <DemoDrawer
      v-model:open="open"
      :modal="false"
      :content="{
        onInteractOutside: (event: PointerEvent) => {
          const target = event.target as HTMLElement | null
          if (target?.closest('[data-sonner-toaster]')) return event.preventDefault()
        },
      }"
    >
      <VButton>Open Drawer {{ open }}</VButton>

      <template #content>
        <p>Drawer Content {{ open }}</p>

        <VButton @click="openToast">
          Open Toast
        </VButton>
      </template>
    </DemoDrawer>
  </div>
</template>
