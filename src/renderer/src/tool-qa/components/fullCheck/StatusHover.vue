<script setup lang="ts">
import { ref } from "vue";

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
      <img v-if="checkingStatus === 'timeout'" alt="error" src="../../../assets/icons/auto-checked-error.svg"/>
      <img v-else-if="checkingStatus === 'checking'" alt="checking" src="../../../assets/icons/checking-loading.svg"/>
      <img v-else-if="passedStatus === 'failed' && checkingStatus !== 'checking'" alt="failed" src="../../../assets/icons/auto-checked-failed.svg"/>
      <img v-else-if="passedStatus === 'passed' && checkingStatus !== 'checking'" alt="passed" src="../../../assets/icons/auto-checked-passed.svg"/>
      <img v-else alt="empty" src="../../../assets/icons/auto-checked-empty.svg"/>
    </div>
    <Transition name="fade">
      <div v-if="isHovered" class="absolute w-40 bg-gray-100 border-[1px] border-gray-300 p-2 rounded-lg z-10">{{ message }}</div>
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