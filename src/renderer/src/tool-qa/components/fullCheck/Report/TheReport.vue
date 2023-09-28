<script setup lang="ts">
import BasicReport from "@renderer/tool-qa/components/fullCheck/Report/BasicReport.vue";
import GenericLayout from "@renderer/tool-qa/components/checks/GenericLayout.vue";
import ReportNavigation from "@renderer/tool-qa/components/fullCheck/Report/ReportNavigation.vue";
import { navigation } from "@renderer/router/checkRoutes";
import { useFullStore } from "@renderer/tool-qa/store/fullStore";
import { computed, ref } from "vue";

const fullStore = useFullStore();
const currentReport = ref(navigation[0].title);

const getSections = computed(() => {
  return navigation.map(key => ({
    name: key.title,
    manualItems: key.checks.manual,
    autoItem: key.checks.auto
  }));
});

const changeReport = (report: string) => {
  currentReport.value = report;
}
</script>

<template>
  <GenericLayout>
    <template v-slot:title>
      <p class="text-2xl text-black font-semibold mb-3">Test Report</p>
      <div class="flex flex-row">
        <ReportNavigation @update="changeReport" v-for="section in getSections"
                          :key="section.name"
                          :title="section.name"
                          :auto-section="section.autoItem"
                          :section="section.manualItems"
                          :active="false"/>
      </div>
    </template>

    <template v-slot:content>
      <div v-for="section in getSections" class="w-full">
        <BasicReport v-if="currentReport === section.name" :auto="section.autoItem.length !== 0 ? section.autoItem : undefined" :section="section.manualItems" class="w-full"/>
      </div>
    </template>
  </GenericLayout>
</template>
