<script setup lang="ts">
defineProps({
  title: {
    type: String,
    required: true
  },
  currentKeys: {
    type: Number,
    required: true
  },
  totalKeys: {
    type: Number,
    required: true
  }
})
</script>

<template>
  <div class="flex flex-row justify-between">
    <div>
      {{title}}
    </div>
    <div>
      {{currentKeys}}/{{totalKeys}}
    </div>
  </div>
</template>
