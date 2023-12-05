<script setup lang="ts">
import GenericLayout from "@renderer/components/layouts/GenericLayout.vue";
import ReportResults from "@renderer/src-qa/components/Report/Results/ReportResults.vue";
import CheckTable from "@renderer/src-qa/components/Report/Results/CheckTable.vue";
import { useFullStore } from "@renderer/src-qa/store/fullStore";
import { useStateStore } from "@renderer/src-qa/store/stateStore";
import { useRoute } from "vue-router";
import { computed } from "vue";
import {Section} from "@renderer/src-qa/interfaces/_report";

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
const checkDetails = computed((): Section => {
  const page: string|undefined = <string|undefined>props.page || <string|undefined>route.meta['page'];

  if (page !== undefined) {
    return fullStore.reportTracker[page];
  } else {
    return {};
  }
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
  <GenericLayout>
    <template v-slot:title v-if="page === undefined">
      <p class="text-2xl text-black font-semibold mb-2">{{stateStore.generateTitle(props.page ?? route.meta['page'] as string)}} (Report)</p>
      <p class="text-base text-black mb-4">{{route.meta['description'] as string ?? "No description set"}}</p>
    </template>

    <template v-slot:content>
      <div class="flex flex-col">
        <ReportResults :parent="props.page ?? <string>route.meta['page']"/>

        <!--All auto checks include _checks in their title-->
        <CheckTable v-for="(section, page) in computedChecks.auto" :key="page"
                    :parent="props.page ?? <string>route.meta['page']"
                    :category="<string>page"
                    :section="section"/>

        <CheckTable v-for="(section, page) in computedChecks.manual" :key="page"
                    :parent="props.page ?? <string>route.meta['page']"
                    :category="<string>page"
                    :section="section"/>
      </div>
    </template>
  </GenericLayout>
</template>
