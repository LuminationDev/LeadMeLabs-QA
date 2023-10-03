<script setup lang="ts">
import { ref } from "vue";

defineProps({
  title: {
    type: String,
    required: true
  },
  message: {
    type: String,
    required: true
  }
})

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
  <td class="p-3 grow relative">
    <div class="flex flex-row">
      <div class="font-semibold mr-1">{{ title }}</div>
      <img @mouseover="startHoverTimer" @mouseout="clearHoverTimer" class="cursor-help" src="../../../assets/icons/help-hover.svg" alt="help"/>
    </div>
    <Transition name="fade">
      <div v-if="isHovered" class="absolute bg-gray-100 border-[1px] border-gray-300 p-2 rounded-lg z-10">{{ message }}</div>
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