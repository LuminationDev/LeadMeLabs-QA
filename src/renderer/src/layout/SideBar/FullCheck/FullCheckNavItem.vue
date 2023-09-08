<script setup lang="ts">
import { useFullStore } from "@renderer/store/fullStore";
import { QaCheck } from "@renderer/interfaces";
import { computed } from "vue";

const props = defineProps({
  title: {
    type: String,
    required: true
  },
  objectNames: {
    type: Array,
    required: true
  }
});

const fullStore = useFullStore();

const completed = computed(() => {
  let progress = 0;
  let total = 0;

  props.objectNames.forEach(type => {
    const reportTracker: QaCheck[] = fullStore.reportTracker[type];
    progress += reportTracker.filter(item => item.passedCheck !== null).length;
    total += fullStore.reportTracker[type].length;
  })

  if(progress === 0) { //Not started
    return 'pending'
  } else if (progress < total) { //Not finished
    return 'incomplete'
  } else { //Complete
    return 'complete'
  }
});
</script>

<template>
  <div class="flex flex-row items-center">
    <div class="w-3 h-3 rounded-xl mr-1"
         :class="{
            'border-2 border-gray-400': completed === 'pending',
            'bg-red-400': completed === 'incomplete',
            'bg-green-400': completed === 'complete',
          }"
    />
    <div>
      {{title}}
    </div>
  </div>
</template>
