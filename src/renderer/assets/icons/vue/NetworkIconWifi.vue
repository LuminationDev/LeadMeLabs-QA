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
    <path d="M7.99996 13H8.00663M15.2042 5.80051C13.3063 4.06133 10.777 3 7.99988 3C5.22272 3 2.69345 4.06133 0.795532 5.80051M3.15458 8.16198C4.44666 7.02377 6.14267 6.33333 7.99994 6.33333C9.85721 6.33333 11.5532 7.02377 12.8453 8.16198M10.4655 10.5167C9.78611 9.98418 8.93007 9.66667 7.99988 9.66667C7.05562 9.66667 6.18778 9.99386 5.50354 10.5411" :stroke="fill" stroke-width="1.33333" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>
</template>
