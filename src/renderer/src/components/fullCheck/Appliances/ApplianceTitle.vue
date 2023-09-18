<script setup lang="ts">
import { computed, onBeforeMount, ref, watch } from "vue";
import { useFullStore } from "@renderer/store/fullStore";

const fullStore = useFullStore();

const props = defineProps({
  title: {
    type: String,
    required: true
  },
  id: {
    type: String,
    required: true
  }
});

const selected = ref();

const changeSelection = (selection: boolean) => {
  selected.value = selection;
  const selectedItem = fullStore.ApplianceList.find(item => item.id === props.id);
  if (selectedItem) {
    selectedItem.correct = selection;
  }
}

const isCorrect = computed(() => {
  const selectedItem = fullStore.ApplianceList.find(item => item.id === props.id);
  return selectedItem ? selectedItem.correct : false;
});

// Watch for changes in the correct variable and update selected accordingly
watch(isCorrect, (newValue) => {
  selected.value = newValue;
});

onBeforeMount(() => {
  selected.value = isCorrect.value;  // Trigger the computed property to set up the watcher
});
</script>

<template>
  <div class="flex flex-row justify-between">
    <span class="w-56 font-semibold">
      {{ title }}
    </span>

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
