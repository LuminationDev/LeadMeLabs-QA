<script setup lang="ts">
import { ref } from "vue";
import errorSrc from "../../../../assets/icons/auto-checked-error.svg";
import checkingSrc from "../../../../assets/icons/checking-loading.svg";
import failedSrc from "../../../../assets/icons/auto-checked-failed.svg";
import passedSrc from "../../../../assets/icons/auto-checked-passed.svg";
import warningSrc from "../../../../assets/icons/auto-checked-warning.svg";
import emptySrc from "../../../../assets/icons/auto-checked-empty.svg";

defineProps({
  message: {
    type: String,
    required: true
  },
  checkingStatus: {
    type: String,
    required: true
  },
  passedStatus: {
    type: String,
    required: true
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
      <img v-if="checkingStatus === 'timeout'" alt="error" :src="errorSrc"/>
      <img v-else-if="checkingStatus === 'checking'" alt="checking" :src="checkingSrc"/>
      <img v-else-if="passedStatus === 'failed' && checkingStatus !== 'checking'" alt="failed" :src="failedSrc"/>
      <img v-else-if="passedStatus === 'passed' && checkingStatus !== 'checking'" alt="passed" :src="passedSrc"/>
      <img v-else-if="passedStatus === 'warning' && checkingStatus !== 'checking'" alt="warning" :src="warningSrc"/>
      <div v-else-if="passedStatus === 'not_applicable' && checkingStatus !== 'checking'">N/A</div>
      <img v-else-if="passedStatus === 'skipped' && checkingStatus !== 'checking'" alt="skipped" :src="emptySrc"/>
      <img v-else alt="empty" :src="emptySrc"/>
    </div>
    <Transition name="fade">
      <div v-if="isHovered" class="absolute w-44 bg-gray-100 border-[1px] border-gray-300 p-2 rounded-lg -left-36 z-10">{{ message }}</div>
    </Transition>
  </td>
</template>

<style>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>