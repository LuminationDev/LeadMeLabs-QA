<script setup lang="ts">
import { computed, ref } from "vue";
import { Appliance } from "@renderer/tool-qa/interfaces";
import CircleSpinner from "@renderer/tool-qa/components/_generic/loading/CircleSpinner.vue";

const props = defineProps({
  currentlyChecking: {
    type: Boolean,
    required: true
  },
  appliances: {
    type: Array<Appliance>,
    required: true
  }
});

/**
 * From the appliance list, track how many have the correct ID and how many do not.
 */
const passedStatus = computed(() => {
  return props.appliances.reduce((acc, appliance) => {
    const correctIdValue = appliance.correctId;
    if (correctIdValue === true) {
      acc.trueCount++;
    } else if (correctIdValue === false) {
      acc.falseCount++;
    }
    return acc;
  }, { trueCount: 0, falseCount: 0 });
});

/**
 * Determine if there are on-going tests for the current category.
 */
const checkedStatus = computed(() => {
  return props.appliances.reduce((acc, appliance) => {
    const checkedValue = appliance.checked;
    if (checkedValue === true) {
      acc.trueCount++;
    } else if (!checkedValue) {
      acc.nullCount++;
    }
    return acc;
  }, { trueCount: 0, nullCount: 0 });
});

/**
 * Generate a message to show to the user, depending on outcome of the tests.
 */
const message = computed(() => {
  if (props.currentlyChecking === true) {
    return "Currently checking devices";
  } else if (checkedStatus.value.nullCount !== 0) {
    return "Checks have not started";
  } else if (passedStatus.value.falseCount !== 0) {
    return `${passedStatus.value.falseCount}/${props.appliances.length} appliances do not have the correct ID`;
  } else if (passedStatus.value.falseCount === 0) {
    return 'All appliances have the correct ID';
  } else {
    return "Should not reach this....";
  }
});

const isHovered = ref(false);
let hoverTimer;

/**
 * Only show the message after a set time period as to not overwhelm the user.
 */
const startHoverTimer = () => {
  hoverTimer = setTimeout(() => {
    isHovered.value = true;
  }, 500);
};

const clearHoverTimer = () => {
  clearTimeout(hoverTimer);
  isHovered.value = false;
};
</script>

<template>
  <td class="p-3 w-16 relative">
    <div @mouseover="startHoverTimer" @mouseout="clearHoverTimer" class="cursor-help font-semibold rounded-xl w-full justify-center h-4">
      <CircleSpinner v-if="currentlyChecking === true" color="#175CD3"/>
      <img v-else-if="checkedStatus.nullCount !== 0" alt="empty" src="../../../../assets/icons/auto-checked-empty.svg"/>
      <img v-else-if="passedStatus.falseCount !== 0" alt="failed" src="../../../../assets/icons/auto-checked-failed.svg"/>
      <img v-else-if="passedStatus.falseCount === 0" alt="passed" src="../../../../assets/icons/auto-checked-passed.svg"/>
    </div>
    <Transition name="fade">
      <div v-if="isHovered" class="absolute w-40 bg-gray-100 border-[1px] border-gray-300 p-2 rounded-lg z-10">{{ message }}</div>
    </Transition>
  </td>
</template>
