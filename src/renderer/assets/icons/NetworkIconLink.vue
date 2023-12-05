<script setup lang="ts">
defineProps({
  fill: {
    type: String,
    required: false
  }
})
</script>
<template>
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M8.47167 12.2428L7.52886 13.1856C6.22711 14.4873 4.11656 14.4873 2.81481 13.1856C1.51306 11.8838 1.51306 9.77329 2.81481 8.47154L3.75762 7.52874M12.2429 8.47154L13.1857 7.52874C14.4875 6.22699 14.4875 4.11644 13.1857 2.81469C11.884 1.51294 9.77341 1.51294 8.47167 2.81469L7.52886 3.7575M5.66693 10.3335L10.3336 5.66679" :stroke="fill" stroke-width="1.33333" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>

</template>
