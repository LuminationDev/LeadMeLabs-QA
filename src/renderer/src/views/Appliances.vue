<script setup lang="ts">
import TheAppliances from '../components/appliances/TheAppliances.vue'
</script>

<template>
  <div class="sidebar flex flex-col w-full bg-white rounded-3xl px-6 py-2">
    <div class="w-full h-auto my-4 flex flex-col">
      <p class="text-lg text-black mb-3">Appliances Page</p>

      <div class="w-full h-auto mb-4 flex flex-col">
        <hr class="my-4">

        <TheAppliances />
      </div>
    </div>
  </div>
</template>
