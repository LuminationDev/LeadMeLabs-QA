<script setup lang="ts">
import { useFullStore } from "@renderer/tool-qa/store/fullStore";
import { QaCheck } from "src/renderer/src/tool-qa/interfaces";
import { computed } from "vue";
import base from '@renderer/assets/icons/nav-icon-base.svg';
import active from '@renderer/assets/icons/nav-icon-active.svg';
import incomplete from '@renderer/assets/icons/nav-icon-incomplete.svg';
import complete from '@renderer/assets/icons/nav-icon-complete.svg';

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
    correct += reportTracker.filter(item => item.passedStatus === 'passed').length;
    progress += reportTracker.filter(item => item.passedStatus !== null).length;
    total += fullStore.reportTracker[type].length;
  })

  if(progress === 0) {
    return 'pending' //Not started
  } else if (progress < total) {
    return 'active' //Not finished
  } else if (correct < total) {
    return 'unpolished' //Finished but with some no's
  } else {
    return 'complete' //Complete
  }
});
</script>

<template>
  <div class="flex flex-row items-center">
    <div class="mr-2">
      <img v-if="completed === 'pending'" :src="base" alt="base"/>
      <img v-else-if="completed === 'active'" :src="active" alt="active"/>
      <img v-else-if="completed === 'unpolished'" :src="incomplete" alt="incomplete"/>
      <img v-else-if="completed === 'complete'" :src="complete" alt="complete"/>
    </div>

    <div>
      {{title}}
    </div>
  </div>
</template>
