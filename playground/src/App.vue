<script setup lang="ts">
import TheNav from '@/components/TheNav.vue'
import { Toaster } from 'vue-sonner'
import 'vue-sonner/style.css'
</script>

<template>
  <div
    data-vaul-drawer-wrapper
    class="flex flex-col w-screen h-screen bg-white"
  >
    <TheNav />
    <RouterView />

    <Toaster class="z-50 bg-red-500" rich-colors />
  </div>
</template>
about:blank
