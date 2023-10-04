<script setup lang="ts">
defineProps({
  active: {
    type: Boolean,
    required: true
  }
})
</script>

<template>
  <div
      class="absolute top-9 -bottom-3"
      :class="{
        'left-[7px] border-l-[1px] border-gray-300': !active,
        'left-[6px] border-l-[3px] border-blue-600': active,
      }"/>
</template>
