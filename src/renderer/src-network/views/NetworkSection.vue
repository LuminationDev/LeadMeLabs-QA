<script setup lang="ts">
import GuideModal from "../../modals/GuideModal.vue";
import {computed} from "vue";

const props = defineProps({
  guide: {
    type: Array,
    required: true
  }
})

const guideComp = computed(() => {
  return [{ key: 'fake-key', guide: props.guide }]
})
</script>

<template>
  <div class="flex flex-col w-full h-full overflow-y-auto pt-10 pr-6 gray-scrollbar">
    <div class="flex flex-row justify-between items-center w-full">
      <div class="bg-blue-200 border-1 border-blue-400 text-blue-700 rounded-full h-5 font-semibold text-sm px-2">
        <slot name="step">Step 0</slot>
      </div>
      <!--@ts-ignore-->
      <GuideModal :guides="guideComp" />
    </div>

    <div>
      <h1 class="text-lg font-semibold text-black"><slot name="heading">This is the section heading</slot></h1>
    </div>

    <div>
      <h2 class="text-md text-gray-600"><slot name="subheading">This is the section subheading</slot></h2>
    </div>

    <div class="mt-6">
      <slot name="body">This massive section is where all of the content goes</slot>
    </div>

  </div>
</template>

<style scoped>
.gray-scrollbar::-webkit-scrollbar {
  width: 10px;
}

.gray-scrollbar::-webkit-scrollbar-track {
  background: lightgray;
  border-radius: 20px;
  margin-top: 2px;
  margin-bottom: 2px;
}

.gray-scrollbar::-webkit-scrollbar-thumb {
  background-color: gray;
  border-radius: 20px;
  border: 3px solid lightgray;
}
</style>
