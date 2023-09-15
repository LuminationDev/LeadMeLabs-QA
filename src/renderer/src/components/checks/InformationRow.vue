<script setup lang="ts">
import { onBeforeMount, ref } from 'vue';

const emit = defineEmits<{
    (e: 'answered', key: string, value: boolean): void
}>();

const props = defineProps({
  title: {
    type: String,
    required: true
  },
  text: {
    type: [String, Number, null, undefined],
    required: true
  },
  correct: {
    type: String,
    required: false
  }
});

const selected = ref();

/**
 * Change the currently selected answer, if the answer was undefined emit answered for the 'key' count.
 * @param selection A string of 'yes' or 'no'.
 */
const changeSelection = (selection: boolean) => {
  emit('answered', props.title, selection);
  selected.value = selection;
}

onBeforeMount(() => {
  if(props.correct !== undefined && props.correct !== null) {
    changeSelection(props.correct === 'passed');
  }
})
</script>

<template>
  <div class="my-2 w-full">
    <span class="w-52 flex-shrink-0 font-semibold">{{title}}</span>
    <span class="flex-grow">{{text}}</span>

    <div class="w-52">
      <div class="mx-6 font-semibold">Correct?</div>
      <div v-on:click="changeSelection(true)"
        class="w-12 h-6 mr-2 flex items-center justify-center cursor-pointer text-white rounded-lg"
        :class="{
          'bg-green-500 hover:bg-green-400': selected === true,
          'bg-gray-400 hover:bg-gray-300': selected === false || selected === undefined
        }"
      >Yes</div>

      <div v-on:click="changeSelection(false)"
        class="w-12 h-6 flex items-center justify-center cursor-pointer text-white rounded-lg"
        :class="{
          'bg-red-500 hover:bg-red-400': selected === false,
          'bg-gray-400 hover:bg-gray-300': selected === true || selected === undefined
        }"
      >No</div>
    </div>
  </div>
</template>
