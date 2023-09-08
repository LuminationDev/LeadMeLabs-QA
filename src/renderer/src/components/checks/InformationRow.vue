<script setup lang="ts">
import { onBeforeMount, ref } from 'vue';
const selected = ref();

const props = defineProps({
  title: {
    type: String,
    required: true
  },
  text: {
    type: [String, Number, null],
    required: true
  },
  correct: {
    type: Boolean,
    required: false
  }
});

onBeforeMount(() => {
  if(props.correct) {
    selected.value = 'yes';
  }
})
</script>

<template>
  <div class="my-2">
    <span class="w-52 font-semibold">{{title}}</span>
    <span class="w-72">{{text ?? 'Not found'}}</span>

    <div class="mx-6 font-semibold">Correct?</div>
    <div v-on:click="selected = 'yes'"
      class="w-12 h-6 mr-2 flex items-center justify-center cursor-pointer text-white rounded-lg"
      :class="{
        'bg-green-500 hover:bg-green-400': selected === 'yes',
        'bg-gray-400 hover:bg-gray-300': selected !== 'yes'
      }"
    >Yes</div>

    <div v-on:click="selected = 'no'"
      class="w-12 h-6 flex items-center justify-center cursor-pointer text-white rounded-lg"
      :class="{
        'bg-red-500 hover:bg-red-400': selected === 'no',
        'bg-gray-400 hover:bg-gray-300': selected !== 'no'
      }"
    >No</div>
  </div>
</template>
