<script setup lang="ts">
import { RouterLink } from 'vue-router'

const props = defineProps<{
  to?: string
}>()
</script>

<template>
  <component
    :is="props.to ? RouterLink : 'button'"
    class="flex bg-neutral-100 hover:bg-neutral-200 text-sm transition-colors font-medium px-4 py-2 rounded-lg shrink-0"
    :to="props.to"
  >
    <slot />
  </component>
</template>
