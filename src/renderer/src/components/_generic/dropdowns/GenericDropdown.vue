<script setup lang="ts">
import {ref} from "vue";

const isOpen = ref(false);

defineEmits<{
  (e: 'update', value: string): void
}>();

defineProps({
  title: {
    type: String,
    required: true
  },
  items: {
    type: Array<string>,
    required: true
  }
});
</script>

<template>
  <div class="dropdown relative">
    <button @click="isOpen = !isOpen" class="w-32 h-8 flex items-center justify-center bg-blue-500 hover:bg-blue-700 text-white rounded">{{title}}</button>
    <ul v-if="isOpen" class="mt-8 absolute left-0 w-32 bg-white border rounded shadow-md z-10">
      <li v-for="(value) in items" :key="value" @click="$emit('update', value); isOpen = false;" class="py-2 px-4 cursor-pointer hover:bg-gray-200">
        {{value}}
      </li>
    </ul>
  </div>
</template>
