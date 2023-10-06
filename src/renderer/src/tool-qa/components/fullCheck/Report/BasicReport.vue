<script setup lang="ts">
import * as FULL from "@renderer/assets/checks/_fullcheckValues";
import GenericLayout from "@renderer/tool-qa/components/checks/GenericLayout.vue";
import ReportResults from "@renderer/tool-qa/components/fullCheck/Report/ReportResults.vue";
import CheckTable from "@renderer/tool-qa/components/fullCheck/Report/CheckTable.vue";
import { useFullStore } from "@renderer/tool-qa/store/fullStore";
import { useStateStore } from "@renderer/tool-qa/store/stateStore";
import { useRoute } from "vue-router";
import { computed } from "vue";

const fullStore = useFullStore();
const stateStore = useStateStore();
const route = useRoute();

const checkDetails = computed(() => {
  return FULL[route.meta['page'].toUpperCase()];
});
</script>

<template>
  <GenericLayout>
    <template v-slot:title>
      <p class="text-2xl text-black font-semibold mb-2">{{stateStore.generateTitle(route.meta['page'] as string)}} (Report)</p>
      <p class="text-base text-black mb-4">{{route.meta['description'] as string ?? "No description set"}}</p>
    </template>

    <template v-slot:content>
      <div class="flex flex-col">
        <ReportResults :parent="<string>route.meta['page']"/>

        <template v-for="(section, index) in checkDetails" :key="index">
          <CheckTable :section="section"/>
        </template>
      </div>
    </template>
  </GenericLayout>
</template>
