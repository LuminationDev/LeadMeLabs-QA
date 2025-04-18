<script setup lang="ts">
import GenericLayout from "../../../components/layouts/GenericLayout.vue";
import ReportResults from "./ReportResults.vue";
import CheckTable from "./CheckTable.vue";
import { useStateStore } from "../../../store/stateStore";
import { useRoute } from "vue-router";
import { computed } from "vue";
import { Section } from "../../../interfaces/_report";

const stateStore = useStateStore();
const tempStore = stateStore.getStore;
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
    return tempStore.reportTracker[page];
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
