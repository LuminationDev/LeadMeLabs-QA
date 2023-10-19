<script setup lang="ts">
defineProps({
  fill: {
    type: String,
    required: false
  },
  complete: {
    type: Boolean,
    required: false,
    default: true
  }
})
</script>
<template>
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <g clip-path="url(#clip0_481_1070)">
      <rect width="16" height="16" rx="8" fill="#EFF4FF"/>
      <rect x="0.75" y="0.75" width="14.5" height="14.5" rx="7.25" :fill="fill"/>
      <circle v-if="complete" cx="8" cy="8" r="3" fill="white"/>
      <rect x="0.75" y="0.75" width="14.5" height="14.5" rx="7.25" :stroke="fill" stroke-width="1.5"/>
    </g>
    <defs>
      <clipPath id="clip0_481_1070">
        <rect width="16" height="16" rx="8" fill="white"/>
      </clipPath>
    </defs>
  </svg>
</template>
