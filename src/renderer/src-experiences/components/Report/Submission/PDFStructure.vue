<script setup lang="ts">
import PDFTable from "./PDFTable.vue";
import ReportResults from "../Results/ReportResults.vue";
import { computed } from "vue";
import { useExperienceStore } from "../../../store/experienceStore";
import { useStateStore } from "../../../../store/stateStore";
import { Section } from "../../../interfaces/_report";

const experienceStore = useExperienceStore();
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
  return experienceStore.reportTracker[props.parent];
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
