<script setup lang="ts">
import { useFullStore } from "@renderer/tool-qa/store/fullStore";
import BasicReport from "@renderer/tool-qa/components/fullCheck/Report/BasicReport.vue";
import GenericLayout from "@renderer/tool-qa/components/checks/GenericLayout.vue";
import {computed, ref} from "vue";
import ReportNavigation from "@renderer/tool-qa/components/fullCheck/Report/ReportNavigation.vue";

const fullStore = useFullStore();
const currentReport = ref('Network');

//Report titles with their associated sections
const sections = {
  'Network': ['CABLING', 'NETWORK', 'CBUS'],
  'Windows': ['BIOS', 'WINDOWS'],
  'Software': ['STEAM'],
  'Physical': ['KEYBOARD', 'VIVE', 'PROJECTOR'],
  'Security': ['BITWARDEN']
};

const getSections = computed(() => {
  return Object.keys(sections).map(key => ({
    name: key,
    items: sections[key]
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
        <ReportNavigation @update="changeReport" v-for="section in getSections" :key="section.name" :title="section.name" :section="section.items" :active="false"/>
      </div>
    </template>

    <template v-slot:content>
      <div v-for="section in getSections" class="w-full">
        <BasicReport v-if="currentReport === section.name" :section="section.items" class="w-full"/>
      </div>

<!--      <BasicReport v-if="currentReport === 'NETWORK'" :section="['CABLING', 'NETWORK', 'CBUS']"/>-->
<!--      <BasicReport v-if="currentReport === 'WINDOWS'" :section="['BIOS', 'WINDOWS']"/>-->
<!--      <BasicReport v-if="currentReport === 'SOFTWARE'" :section="['STEAM']"/>-->
<!--      <BasicReport v-if="currentReport === 'PHYSICAL'" :section="['KEYBOARD', 'VIVE', 'PROJECTOR']"/>-->
<!--      <BasicReport v-if="currentReport === 'SECURITY'" :section="['BITWARDEN']"/>-->
    </template>
  </GenericLayout>
</template>
