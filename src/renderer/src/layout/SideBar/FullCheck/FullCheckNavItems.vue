<script setup lang="ts">
import { useFullStore } from "@renderer/store/fullStore";
import { QaCheck } from "@renderer/interfaces";
import { computed } from "vue";

const fullStore = useFullStore();

const completed = computed(() => {
  const reportTracker: QaCheck[] = fullStore.reportTracker["CABLING"];
  const progress = reportTracker.filter(item => item.passedCheck !== null).length;

  if(progress === 0) { //Not started
    return 'pending'
  } else if (progress < reportTracker.length) { //Not finished
    return 'incomplete'
  } else { //Complete
    return 'complete'
  }
});
</script>

<template>
  <div class="flex flex-row items-center">
    <div class="w-4 h-4"
         :class="{
            'bg-amber-400': completed === 'pending',
            'bg-red-400': completed === 'incomplete',
            'bg-green-400': completed === 'complete',
          }"
    />
    <div>
      Cabling & Routing
    </div>
  </div>
</template>
