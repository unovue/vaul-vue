<script setup lang="ts">
import TheNav from '@/components/TheNav.vue'
</script>

<template>
  <div
    data-vaul-drawer-wrapper
    class="flex flex-col w-screen h-screen"
  >
    <TheNav />
    <RouterView />
  </div>
</template>
