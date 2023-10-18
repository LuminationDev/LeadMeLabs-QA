<script setup lang="ts">
defineProps({
  passedStatus: {
    type: String,
    required: true
  },
  checkingStatus: {
    type: String,
    required: true
  },
  message: {
    type: String,
    required: true
  }
});
</script>

<template>
  <div class="p-3 w-16">
    <div class="font-semibold rounded-xl w-full items-center justify-center h-4">
      <div v-if="passedStatus === 'skipped'" class="bg-yellow-500 h-3 w-3 rounded-xl"/>
      <div v-else-if="checkingStatus === 'timeout' || (passedStatus === 'failed' && checkingStatus !== 'checking')"
           class="bg-red-500 h-3 w-3 rounded-xl"/>
      <div v-else-if="passedStatus === 'passed' && checkingStatus !== 'checking'" class="bg-green-500 h-3 w-3 rounded-xl"/>
      <div v-else class="text-xs">N/A</div>
    </div>
  </div>
</template>