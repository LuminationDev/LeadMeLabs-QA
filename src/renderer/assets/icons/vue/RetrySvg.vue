<script setup lang="ts">
defineProps({
  fill: {
    type: String,
    required: false
  }
})
</script>
<template>
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M17.5 8.33333C17.5 8.33333 15.8291 6.05685 14.4718 4.69854C13.1144 3.34022 11.2386 2.5 9.16663 2.5C5.02449 2.5 1.66663 5.85786 1.66663 10C1.66663 14.1421 5.02449 17.5 9.16663 17.5C12.5859 17.5 15.4707 15.2119 16.3735 12.0833M17.5 8.33333V3.33333M17.5 8.33333H12.5" :stroke="fill" stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>
</template>
