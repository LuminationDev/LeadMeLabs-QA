<script setup lang="ts">
import PDFTable from "./PDFTable.vue";
import ReportResults from "./ReportResults.vue";
import { useStateStore } from "../../../store/stateStore";
import { useNetworkStore } from "../../store/networkStore";

const networkStore = useNetworkStore();
const stateStore = useStateStore();
const props = defineProps({
  parent: {
    type: String,
    required: true
  }
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

      <PDFTable :category="<string>props.parent"/>
    </div>
  </div>
</template>
