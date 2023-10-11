<script setup lang="ts">
import GenericLayout from "@renderer/tool-qa/components/checks/GenericLayout.vue";
import ReportResults from "@renderer/tool-qa/components/fullCheck/Report/Results/ReportResults.vue";
import CheckTable from "@renderer/tool-qa/components/fullCheck/Report/Results/CheckTable.vue";
import { useFullStore } from "@renderer/tool-qa/store/fullStore";
import { useStateStore } from "@renderer/tool-qa/store/stateStore";
import { useRoute } from "vue-router";
import { computed } from "vue";

const fullStore = useFullStore();
const stateStore = useStateStore();
const route = useRoute();

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
  return fullStore.reportTracker[props.page ?? route.meta['page']];
});
</script>

<template>
  <GenericLayout>
    <template v-slot:title v-if="page === undefined">
      <p class="text-2xl text-black font-semibold mb-2">{{stateStore.generateTitle(props.page ?? route.meta['page'] as string)}} (Report)</p>
      <p class="text-base text-black mb-4">{{route.meta['description'] as string ?? "No description set"}}</p>
    </template>

    <template v-slot:content>
      <div class="flex flex-col">
        <ReportResults :parent="props.page ?? <string>route.meta['page']"/>

        <template v-for="(section, page) in checkDetails" :key="page">
          <CheckTable :parent="props.page ?? <string>route.meta['page']" :category="<string>page" :section="section"/>
        </template>
      </div>
    </template>
  </GenericLayout>
</template>
