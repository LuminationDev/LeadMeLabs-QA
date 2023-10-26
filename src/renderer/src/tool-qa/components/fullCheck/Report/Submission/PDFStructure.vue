<script setup lang="ts">
import PDFTable from "@renderer/tool-qa/components/fullCheck/Report/Submission/PDFTable.vue";
import ReportResults from "@renderer/tool-qa/components/fullCheck/Report/Results/ReportResults.vue";
import { computed } from "vue";
import { useFullStore } from "@renderer/tool-qa/store/fullStore";
import { useStateStore } from "@renderer/tool-qa/store/stateStore";
import { Section } from "@renderer/tool-qa/interfaces/_report";

const fullStore = useFullStore();
const stateStore = useStateStore();
const props = defineProps({
  parent: {
    type: String,
    required: true
  }
});

/**
 * Collect the information for the different report sections
 */
const checkDetails = computed((): Section => {
  return fullStore.reportTracker[props.parent];
});

/**
 * Split the checks into auto (name includes _checks) and manual (all other ones).
 */
const computedChecks = computed(() => {
  const auto = {};
  const manual = {};

  for (const [key, value] of Object.entries(checkDetails.value)) {
    key.includes('_checks') ? auto[key] = value : manual[key] = value;
  }

  return { auto, manual };
});
</script>

<template>
  <div class="flex flex-col mt-6">
    <p class="text-xl text-black font-semibold mb-2">
      {{stateStore.generateTitle(props.parent)}} (Report)
    </p>

    <hr class="my-2">

    <div class="flex flex-col mb-6">
      <ReportResults :parent="props.parent" :margin="false"/>

      <PDFTable v-for="(section, page) in computedChecks.auto" :key="page"
                :parent="props.parent"
                :category="<string>page"
                :section="section"/>

      <PDFTable v-for="(section, page) in computedChecks.manual" :key="page"
                :parent="props.parent"
                :category="<string>page"
                :section="section"/>
    </div>
  </div>
</template>
