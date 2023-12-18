<script setup lang="ts">
import { ref } from "vue";

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
    <button @click="isOpen = !isOpen"
            class="w-80 h-10 px-2 flex items-center justify-between border-[1px] border-gray-400 text-gray-800
            hover:bg-gray-100 rounded-lg shadow-sm"
            :class="{'border-blue-400 outline outline-4 outline-blue-200':isOpen}">
      {{title}}

      <img alt="down" src="../../assets/icons/chevron-down.svg"/>
    </button>

    <ul v-if="isOpen" class="mt-10 absolute left-0 w-80 bg-white border-[1px] border-gray-400 rounded-lg shadow-md z-10">
      <li v-for="(value) in items" :key="value"
          @click="$emit('update', value); isOpen = false;"
          class="flex flex-row justify-between my-1 py-2 mx-1 px-3 cursor-pointer rounded hover:bg-gray-50">

        {{value}}

        <img v-if="title === value" alt="down" src="../../assets/icons/check-blue.svg"/>
      </li>
    </ul>
  </div>
</template>
