<script setup lang="ts">
import type { DrawerSide } from 'vaul-vue'
import DemoDrawer from '@/components/DemoDrawer.vue'
import VButton from '@/components/v/Button.vue'
import { useRouteQuery } from '@vueuse/router'
import { ref } from 'vue'

const sides: DrawerSide[] = ['top', 'right', 'bottom', 'left']

const querySide = useRouteQuery<DrawerSide>('side', 'bottom')

const open = ref(false)

async function openDrawer(side: DrawerSide) {
  querySide.value = side
  open.value = true
}
</script>

<template>
  <div class="grid gap-4 place-content-center h-full">
    <VButton
      v-for="side in sides"
      :key="side"
      :data-testid="`trigger-${side}`"
      @click="openDrawer(side)"
    >
      Open from {{ side }}
    </VButton>

    <DemoDrawer v-model:open="open" :side="querySide">
      <template #content>
        <div :data-testid="`content-${querySide}`">
          <p>{{ querySide }}</p>
        </div>
      </template>
    </DemoDrawer>
  </div>
</template>
