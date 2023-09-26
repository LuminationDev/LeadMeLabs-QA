<script setup lang="ts">
import { useStateStore } from "@renderer/tool-qa/store/stateStore";
import { useFullStore } from "@renderer/tool-qa/store/fullStore";
import { computed } from "vue";

const stateStore = useStateStore();
const fullStore = useFullStore();

const props = defineProps({
  title: {
    type: String,
    required: true
  },
  autoSection: {
    type: String,
    required: true
  },
  section: {
    type: Array<string>,
    required: true
  },
  active: {
    type: Boolean,
    required: true
  }
});

const failedCount = computed(() => {
  let extractedValues = [];

  props.section.forEach(item => {
    if (fullStore.reportTracker[item]) {
      extractedValues.push(...fullStore.reportTracker[item]);
    }
  });

  if(props.autoSection) {
    const flattenArray = []
    //Add the checks from the auto result section, these are grouped by station and hence need a bit more work
    Object.entries(fullStore.reportTracker[props.autoSection]).forEach(([key, value]) => {
      value.forEach(item => {
        flattenArray.push(item);
      })
    });
    extractedValues = extractedValues.concat(flattenArray);
  }

  return extractedValues.filter(entry => entry['passedStatus'] === 'failed').length;
});
</script>

<template>
  <div class="flex items-center mx-2 p-2 rounded-lg cursor-pointer font-semibold
      text-slate-600 hover:bg-blue-50 hover:text-blue-500"
      @click="$emit('update', title)"
  >
    {{title}}
    <div v-if="failedCount > 0" class="ml-2 px-2 bg-red-200 rounded-2xl text-red-700 font-semibold border-[1px] border-red-400">{{failedCount}}</div>
  </div>
</template>
