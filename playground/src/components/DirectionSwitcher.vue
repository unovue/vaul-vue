
<script setup lang="ts">
import type { DrawerDirection } from 'vaul-vue';

const direction = defineModel<DrawerDirection>({ required: true });
</script>

<template>
  <fieldset>
    <legend class="mb-2">
      Direction
    </legend>
    <div class="flex gap-4">
      <label>
        <input v-model="direction" type="radio" value="left">
        Left
      </label>
      <label>
        <input v-model="direction" type="radio" value="right">
        Right
      </label>
      <label>
        <input v-model="direction" type="radio" value="top">
        Top
      </label>
      <label>
        <input v-model="direction" type="radio" value="bottom">
        Bottom
      </label>
    </div>
  </fieldset>
</template>
