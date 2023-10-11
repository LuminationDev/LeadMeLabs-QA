<script setup lang="ts">
import { computed } from "vue";
import { useStateStore } from "@renderer/tool-qa/store/stateStore";
import { Device } from "@renderer/tool-qa/interfaces/_deviceMap";

const stateStore = useStateStore();
const props = defineProps({
  device: {
    type: Object as () => Device,
    required: true
  },
  title: {
    type: String,
    required: true
  }
});

const status = computed(() => {
  return props.device.checks[props.title]?.passedStatus ?? 'skipped';
});
</script>

<template>
  <div class="ml-4">
    <div class="font-light mr-1">{{device.prefix}}{{device.id}}: </div>

    <div :class="{
            'text-blue-400': status === 'skipped',
            'text-red-400': status === 'failed',
            'text-green-500': status === 'passed',
          }">{{stateStore.capitalizeFirstLetter(status)}}</div>
  </div>
</template>
