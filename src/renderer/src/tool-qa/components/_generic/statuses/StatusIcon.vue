<script setup lang="ts">
import {computed} from "vue";

const props = defineProps({
  status: {
    type: String,
    required: false,
    default: ""
  },
});

const colours = computed(() => {
  switch (props.status) {
    case 'success':
    case 'green':
      return {
        icon: '#059669',
        background: '#DCFCE7'
      }
    case 'failed':
    case 'red':
      return {
        icon: '#DC2626',
        background: '#FEE2E2'
      }
    case 'warning':
    case 'yellow':
      return {
        icon: '#D97706',
        background: '#FEF3C7'
      }
    case 'loading':
    case 'blue':
      return {
        icon: '#2563EB',
        background: '#DBEAFE'
      }
    case 'gray':
    case 'grey':
    case 'unstarted':
    case 'unchecked':
    default:
      return {
        icon: '#475569',
        background: '#F3F4F6'
      }
  }
})
</script>
<template>
  <div class="rounded-full h-16 w-16 flex justify-center items-center" :style="`background-color: ${colours.background}`">
    <div class="h-8 w-8 flex justify-center items-center">
      <slot name="icon" :fill="colours.icon"></slot>
    </div>
  </div>
</template>