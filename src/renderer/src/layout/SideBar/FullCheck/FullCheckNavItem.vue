<script setup lang="ts">
import { useFullStore } from "@renderer/tool-qa/store/fullStore";
import { QaCheck } from "src/renderer/src/tool-qa/interfaces";
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
  let correct = 0;
  let progress = 0;
  let total = 0;

  props.objectNames.forEach(type => {
    const reportTracker: QaCheck[] = fullStore.reportTracker[type];
    correct += reportTracker.filter(item => item.passedCheck === true).length;
    progress += reportTracker.filter(item => item.passedCheck !== null).length;
    total += fullStore.reportTracker[type].length;
  })

  if(progress === 0) {
    return 'pending' //Not started
  } else if (progress < total) {
    return 'incomplete' //Not finished
  } else if (correct < total) {
    return 'unpolished' //Finished but with some no's
  } else {
    return 'complete' //Complete
  }
});
</script>

<template>
  <div class="flex flex-row items-center">
    <div class="w-3 h-3 rounded-xl mr-1"
         :class="{
            'border-2 border-gray-400': completed === 'pending',
            'bg-amber-400': completed === 'unpolished',
            'bg-red-400': completed === 'incomplete',
            'bg-green-400': completed === 'complete',
          }"
    />
    <div>
      {{title}}
    </div>
  </div>
</template>
