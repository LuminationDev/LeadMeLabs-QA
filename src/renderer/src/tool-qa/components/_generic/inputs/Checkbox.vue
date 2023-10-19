<script setup lang="ts">
import { useFullStore } from "@renderer/tool-qa/store/fullStore";
import { computed, onMounted } from "vue";
import { Device } from "@renderer/tool-qa/interfaces/_deviceMap";

const fullStore = useFullStore();
const props = defineProps({
  index: {
    type: Number,
    required: true
  },
  parent: {
    type: String,
    required: true
  },
  page: {
    type: String,
    required: true
  },
  itemKey: {
    type: String,
    required: true
  },
  device: {
    type: Object as () => Device,
    required: true
  }
});

const status = computed(() => {
  return props.device.checks[props.itemKey]?.passedStatus
});

//Update a default entry for the device map.
onMounted(() => {
  fullStore.updateReport(
      props.parent,
      props.page,
      { passedStatus: status.value },
      props.itemKey,
      props.device.id);
});

function nextOption() {
  let next: string;
  switch (status.value) {
    case 'passed':
      next = 'failed'
      break;
    case 'failed':
      next = 'not_applicable'
      break;
    case 'not_applicable':
      next = 'skipped'
      break;
    default:
      next = 'passed'
  }
  console.log(status.value, next)
  fullStore.updateReport(
      props.parent,
      props.page,
      { passedStatus: next },
      props.itemKey,
      props.device.id)
}

</script>

<template>
  <div class="container">
    <button :key="index + '-' + itemKey" @click="nextOption">
      <span class="checkmark rounded-lg" :class="{
        'hocus:bg-green-300 bg-green-100 border-green-300 hocus:border-green-400': status === 'passed',
        'hocus:bg-red-300 bg-red-100 border-red-300 hocus:border-red-400': status === 'failed',
        'na-icon hocus:bg-blue-300 bg-blue-100 border-blue-300 hocus:border-blue-400': status === 'not_applicable',
        'border-gray-400 hocus:border-gray-600': status === 'skipped' || !status
      }">
        <span  class="flex justify-center items-center text-[8px] w-full h-full">
          <img v-if="status === 'passed'" src="../../../../assets/icons/check-green.svg" alt="passed"/>
          <img v-else-if="status === 'failed'" src="../../../../assets/icons/cross.svg" alt="failed"/>
          <span v-else-if="status === 'not_applicable'">N/A</span>
        </span>
      </span>
    </button>
  </div>
</template>

<style scoped>
/* Customize the label (the container) */
.container {
  display: block;
  position: relative;
  padding-left: 35px;
  margin-bottom: 12px;
  cursor: pointer;
  font-size: 22px;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}

/* Create a custom checkbox */
.checkmark {
  position: absolute;
  top: -6px;
  left: 8px;
  height: 25px;
  width: 25px;
  border-width: 2px;
  border-style: solid;
}

</style>
