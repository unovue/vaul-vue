<script setup lang="ts">
import DemoDrawer from '@/components/DemoDrawer.vue'
import VButton from '@/components/v/Button.vue'
import { ref } from 'vue'

const eventHistory = ref<string[]>([])

function onEvent(label: string) {
  eventHistory.value.push(label)
}
</script>

<template>
  <div class="grid gap-4 place-content-center h-full">
    <div class="space-y-4">
      <ol>
        <li v-for="(event, index) in eventHistory" :key="index">
          <p>{{ event }}</p>
        </li>
      </ol>

      <DemoDrawer
        @close="onEvent('close')"
        @closed="onEvent('closed')"
        @open="onEvent('open')"
        @opened="onEvent('opened')"
      >
        <VButton>Open Drawer</VButton>

        <template #content>
          <p>Drawer Content</p>
        </template>
      </DemoDrawer>

      <VButton @click="eventHistory = []">
        Clear events
      </VButton>
    </div>
  </div>
</template>
