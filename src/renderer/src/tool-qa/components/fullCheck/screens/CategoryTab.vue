<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps({
  category: {
    type: Object as () => { key: string, description: string }
  },
  index: {
    type: Number
  },
  currentCategoryIndex: {
    type: Number
  }
})

const tabClasses = computed(() => ({
  'h-1 w-48 mb-2': true,
  'bg-blue-500': props.index <= props.currentCategoryIndex,
  'bg-zinc-300': props.index > props.currentCategoryIndex
}));

const textClasses = computed(() => ({
  'text-blue-500': props.index === props.currentCategoryIndex
}));
</script>

<template>
  <div class="flex flex-col mr-4">
    <div :class="tabClasses"></div>
    <div class="text-sm font-semibold" :class="textClasses">{{ category.key }}</div>
    <div class="text-xs" :class="textClasses">{{ category.description }}</div>
  </div>
</template>
