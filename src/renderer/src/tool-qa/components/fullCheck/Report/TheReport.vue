<script setup lang="ts">
import BasicReport from "@renderer/tool-qa/components/fullCheck/Report/BasicReport.vue";
import GenericLayout from "@renderer/tool-qa/components/checks/GenericLayout.vue";
import ReportNavigation from "@renderer/tool-qa/components/fullCheck/Report/ReportNavigation.vue";
import { useFullStore } from "@renderer/tool-qa/store/fullStore";
import { computed, ref } from "vue";

const fullStore = useFullStore();
const currentReport = ref('Network');

//Report titles with their associated sections
const sections = {
  'Network': { auto: [], manual: ['CABLING', 'NETWORK', 'CBUS'] },
  'Windows': { auto: ['windows_checks'], manual: ['BIOS', 'WINDOWS'] },
  'Software': { auto: ['software_checks', 'steam_config_checks'], manual: ['STEAM'] },
  'Physical': { auto: [], manual: ['KEYBOARD', 'VIVE', 'PROJECTOR'] },
  'Security': { auto: [], manual: ['BITWARDEN'] }
};

const getSections = computed(() => {
  return Object.keys(sections).map(key => ({
    name: key,
    manualItems: sections[key].manual,
    autoItem: sections[key].auto
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
