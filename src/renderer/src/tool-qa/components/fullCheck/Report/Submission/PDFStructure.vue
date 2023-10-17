<script setup lang="ts">
import PDFTable from "@renderer/tool-qa/components/fullCheck/Report/Submission/PDFTable.vue";
import ReportResults from "@renderer/tool-qa/components/fullCheck/Report/Results/ReportResults.vue";
import { computed } from "vue";
import { useFullStore } from "@renderer/tool-qa/store/fullStore";
import { useStateStore } from "@renderer/tool-qa/store/stateStore";

const fullStore = useFullStore();
const stateStore = useStateStore();
const props = defineProps({
  parent: {
    type: String,
    required: false
  }
});

/**
 * Collect the information for the different report sections
 */
const checkDetails = computed(() => {
  return fullStore.reportTracker[props.parent];
});
</script>

<template>
  <div class="flex flex-col mt-6">
    <p class="text-center text-2xl text-black font-semibold mb-3">QA Lab Report</p>
    <p class="text-black mb-1"><span class="font-semibold">Lab Location: </span>{{fullStore.reportTracker['labLocation']}}</p>
    <p class="text-black mb-5"><span class="font-semibold">Prepared by: </span>{{fullStore.reportTracker['technicianName']}}</p>

    <p class="text-xl text-black font-semibold mb-2">
      {{stateStore.generateTitle(props.parent)}} (Report)
    </p>

    <hr class="my-2">

    <div class="flex flex-col mb-6">
      <ReportResults :parent="props.parent"/>

      <PDFTable v-for="(section, page) in checkDetails" :key="page"
                  :parent="props.parent"
                  :category="<string>page"
                  :section="section"/>
    </div>
  </div>
</template>
