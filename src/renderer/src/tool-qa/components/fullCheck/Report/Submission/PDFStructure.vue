<script setup lang="ts">
import { computed } from "vue";
import { useFullStore } from "@renderer/tool-qa/store/fullStore";
import { useStateStore } from "@renderer/tool-qa/store/stateStore";
import PDFDevices from "@renderer/tool-qa/components/fullCheck/Report/Submission/PDFDevices.vue";

const fullStore = useFullStore();
const stateStore = useStateStore();
const props = defineProps({
  page: {
    type: String,
    required: false
  }
});

/**
 * Collect the information for the different report sections
 */
const checkDetails = computed(() => {
  return fullStore.reportTracker[props.page];
});
</script>

<!--TODO fix the following for some tests and all auto checks - check.id does not match-->
<template>
  <div class="flex flex-col" v-for="(section, page) in checkDetails" :key="page">
    <div class="font-semibold text-lg">
      {{stateStore.generateTitle(page)}}
    </div>

    <div v-for="(category, title) in section" class="flex flex-col my-4">
      <!--Category Title-->
      <div class="font-semibold text-base">{{stateStore.generateTitle(title)}}</div>

      <!--Category Description-->
      <div class="mb-2">Description: {{category.description}}</div>

      <!--Devices with tests results-->
      <div>Devices:</div>
      <div v-for="(device, index) in fullStore.orderedDevices" :key="index">
        <PDFDevices v-if="category.targets[device.type]" :title="title" :device="device"/>
      </div>
    </div>

    <hr>
  </div>
</template>
