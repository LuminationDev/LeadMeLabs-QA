<script setup lang="ts">
defineProps({
  fill: {
    type: String,
    required: false
  }
})
</script>
<template>
  <svg width="44" height="44" viewBox="12 12 19 19" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M28 16L16 28M16 16L28 28" :stroke="fill" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>
</template>
