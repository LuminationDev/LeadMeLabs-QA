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
    <g clip-path="url(#clip0_481_1061)">
      <rect width="16" height="16" rx="8" :fill="fill"/>
      <path d="M11.6667 6L7.08333 10.8889L5 8.66667" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      <rect x="0.75" y="0.75" width="14.5" height="14.5" rx="7.25" :stroke="fill" stroke-width="1.5"/>
    </g>
    <defs>
      <clipPath id="clip0_481_1061">
        <rect width="16" height="16" rx="8" fill="white"/>
      </clipPath>
    </defs>
  </svg>
</template>
