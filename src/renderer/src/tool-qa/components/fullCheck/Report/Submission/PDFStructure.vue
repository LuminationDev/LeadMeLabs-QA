<script setup lang="ts">
import PDFTable from "@renderer/tool-qa/components/fullCheck/Report/Submission/PDFTable.vue";
import { computed } from "vue";
import { useFullStore } from "@renderer/tool-qa/store/fullStore";
import { useStateStore } from "@renderer/tool-qa/store/stateStore";
import ReportResults from "@renderer/tool-qa/components/fullCheck/Report/Results/ReportResults.vue";

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
  <div class="flex flex-col">
    <p class="text-2xl text-black font-semibold mb-2">
      {{stateStore.generateTitle(props.parent)}} (Report)
    </p>

    <hr>

    <div class="flex flex-col">
      <ReportResults :parent="props.parent"/>

      <PDFTable v-for="(section, page) in checkDetails" :key="page"
                  :parent="props.parent"
                  :category="<string>page"
                  :section="section"/>
    </div>
  </div>
</template>
