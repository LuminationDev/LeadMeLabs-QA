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
    <g clip-path="url(#clip0_1210_11247)">
      <path d="M10 1.875V3.95833M10 15V18.3333M4.79167 10H1.875M17.7083 10H16.4583M15.3809 15.3809L14.7917 14.7917M15.5535 4.51316L14.375 5.69167M4.10131 15.8987L6.45833 13.5417M4.2739 4.34057L6.04167 6.10833" :stroke="fill" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
    </g>
    <defs>
      <clipPath id="clip0_1210_11247">
        <rect width="20" height="20" fill="white"/>
      </clipPath>
    </defs>
  </svg>
</template>
