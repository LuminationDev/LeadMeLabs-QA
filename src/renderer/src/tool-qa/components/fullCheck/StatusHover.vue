<script setup lang="ts">
import { ref } from "vue";
import { useStateStore } from "@renderer/tool-qa/store/stateStore";

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
})

const stateStore = useStateStore();
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
  <td class="p-3 w-28 relative">
    <div @mouseover="startHoverTimer" @mouseout="clearHoverTimer" class="cursor-help font-semibold rounded-xl w-fit px-2" :class="{
        'bg-blue-100 border-[1px] border-blue-300 text-blue-700': (passedStatus !== 'failed' && passedStatus !== 'passed') || checkingStatus === 'checking',
        'bg-red-100 border-[1px] border-red-300 text-red-700': passedStatus === 'failed' && checkingStatus !== 'checking',
        'bg-green-100 border-[1px] border-green-300 text-green-700': passedStatus === 'passed' && checkingStatus !== 'checking',
      }">
      {{ stateStore.capitalizeFirstLetter(checkingStatus === 'checked' ? passedStatus : checkingStatus) }}
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