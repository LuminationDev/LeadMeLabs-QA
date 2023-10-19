<script setup lang="ts">
defineProps({
  fill: {
    type: String,
    required: false
  }
})
</script>
<template>
  <svg viewBox="0 0 22 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M21 15.5L20.3083 5.46975C20.1997 3.89504 20.1454 3.10768 19.8041 2.51082C19.5036 1.98533 19.0512 1.56304 18.5062 1.29942C17.8873 1 17.0981 1 15.5196 1H6.48037C4.90191 1 4.11268 1 3.49376 1.29942C2.94884 1.56304 2.49642 1.98533 2.19594 2.51082C1.85464 3.10768 1.80034 3.89503 1.69174 5.46975L1 15.5M21 15.5C21 17.433 19.433 19 17.5 19H4.5C2.567 19 1 17.433 1 15.5M21 15.5C21 13.567 19.433 12 17.5 12H4.5C2.567 12 1 13.567 1 15.5M5 15.5H5.01M11 15.5H17" :stroke="fill" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>
</template>
