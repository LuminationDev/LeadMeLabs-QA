<script setup lang="ts">
defineProps({
  active: {
    type: Boolean,
    required: true
  },
  setup: {
    type: Boolean,
    required: false,
    default: false
  }
});
</script>

<template>
  <div
    class="absolute top-8 -bottom-3"
    :class="{
      'left-[7px] border-l-[1px] border-gray-300': !active,
      'left-[6px] border-l-[3px]': active,
      'border-blue-600': active && !setup,
      'border-purple-800': active && setup
    }"/>
</template>
