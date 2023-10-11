<script setup lang="ts">
import { useFullStore } from "@renderer/tool-qa/store/fullStore";
import {computed, onMounted} from "vue";
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

const checkedState = computed(() => {
  return props.device.checks[props.itemKey]?.passedStatus === 'passed'
});

const updateReport = (checked: boolean) => {
  fullStore.updateReport(
      props.parent,
      props.page,
      { passedStatus: checked? 'passed' : 'skipped' },
      props.itemKey,
      props.device.id)
}

//Update a default entry for the device map.
onMounted(() => {
  updateReport(checkedState.value);
});
</script>

<template>
  <label class="container">
    <input :key="index + '-' + itemKey"
           :checked="checkedState"
           type="checkbox"
           @change="updateReport($event.target.checked)">
    <span class="checkmark rounded-lg"/>
  </label>
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

/* Hide the browser's default checkbox */
.container input {
  position: absolute;
  opacity: 0;
  cursor: pointer;
  height: 0;
  width: 0;
}

/* Create a custom checkbox */
.checkmark {
  position: absolute;
  top: -6px;
  left: 8px;
  height: 25px;
  width: 25px;
  background-color: white;
  border: 2px solid #B9C0D4;
}

/* On mouse-over, add a blue background and border */
.container:hover input ~ .checkmark {
  background-color: #D1E0FF;
  border: 2px solid #1570EF;
}

/* On focus, add a blue outline color */
.container input:focus ~ .checkmark {
  background-color: white;
  outline: 3px solid #D1E0FF;
  border: 2px solid #84ADFF;
}

/* When the checkbox is checked, add a blue background */
.container input:checked ~ .checkmark {
  background-color: #D1E0FF;
  border: 2px solid #1570EF;
}

/* Create the checkmark/indicator (hidden when not checked) */
.checkmark:after {
  content: "";
  position: absolute;
  display: none;
}

/* Show the checkmark when checked */
.container input:checked ~ .checkmark:after {
  display: block;
}

/* Style the checkmark/indicator */
.container .checkmark:after {
  left: 7.5px;
  top: 2px;
  width: 7px;
  height: 14px;
  border: solid #1570EF;
  border-width: 0 3px 3px 0;
  -webkit-transform: rotate(45deg);
  -ms-transform: rotate(45deg);
  transform: rotate(45deg);
}
</style>
