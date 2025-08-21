<script setup lang="ts">
import VButton from '@/components/v/Button.vue'
import { computed } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const testPages = computed(() => {
  const testRoute = router.getRoutes().filter(route => route.path.includes('/test'))
  return testRoute?.map(child => ({
    path: child.path,
    name: child.name,
  }))
})
</script>

<template>
  <nav class="p-4">
    <ul class="flex flex-wrap gap-4">
      <VButton to="/">
        Home
      </VButton>

      <li
        v-for="page in testPages"
        :key="page.path"
        class="shrink-0"
      >
        <VButton :to="page.path">
          {{ page.name }}
        </VButton>
      </li>
    </ul>
  </nav>
</template>
