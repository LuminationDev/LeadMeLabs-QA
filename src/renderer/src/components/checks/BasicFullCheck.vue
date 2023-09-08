<script setup lang="ts">
import InformationTitle from "@renderer/components/checks/InformationTitle.vue";
import InformationRow from '@renderer/components/checks/InformationRow.vue';
import { computed, onBeforeMount, watchEffect } from "vue";
import { useStateStore } from "@renderer/store/stateStore";
import { useFullStore } from "@renderer/store/fullStore";
import { QaCheck, ReportTrackerItem } from "@renderer/interfaces";

const fullStore = useFullStore();
const props = defineProps({
  title: {
    type: String,
    required: true
  },
  objectName: {
    type: String,
    required: true
  }
});

const stateStore = useStateStore();

const currentlyAnswered = computed(() => {
  return fullStore.reportTracker[props.objectName].filter(item => item.passedCheck !== null).length;
})

const keyAnswered = (key: string, value: boolean) => {
  const reportTracker: QaCheck[] = fullStore.reportTracker[props.objectName];
  reportTracker.find(item => item.checkId === key).passedCheck = value;
}

/**
 * The precedent for if a user can continue to the next segment.
 */
const calcProceed = () => {
  stateStore.canProceed = currentlyAnswered.value === Object.keys(fullStore.reportTracker[props.objectName]).length;
}

/**
 * Watch for any changes in the calcProceed to re-evaluate if the user can continue.
 */
watchEffect(() => {
  calcProceed();
});

/**
 * Determine if the necessary values are currently inputted to allow a user to progress with the tool.
 * If not, block the 'Next' button on the BottomBar until they are.
 */
onBeforeMount(() => {
  calcProceed();
});
</script>

<template>
  <InformationTitle
      class="mb-4"
      :title="title"
      :current-keys="currentlyAnswered"
      :total-keys="fullStore.reportTracker[props.objectName].length"/>

  <InformationRow
      v-for="(check, index) in fullStore.reportTracker[props.objectName] as ReportTrackerItem" :key="index"
      @answered="keyAnswered"
      :title="check.checkId"
      :text="check.message"
      :correct="check.passedCheck"/>
</template>
