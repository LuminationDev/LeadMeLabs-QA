<script setup lang="ts">
import BasicReport from "./results/BasicReport.vue";
import GenericLayout from "../../components/layouts/GenericLayout.vue";
import * as CONSTANT from "../../assets/constants";
import { useStateStore } from "../../store/stateStore";
import { ref } from "vue";

const stateStore = useStateStore();
const tempStore = stateStore.getStore;
const reportCategory = ref(stateStore.toolType === CONSTANT.TOOL.EXPERIENCE_LAUNCHER ? 'imvr' : 'hardware');

/**
 * Show the user a quick view of if the tests were passed by all devices.
 */
const generateCategoryStatus = (parent: string) => {
  let { failed, skipped, passed, total } = { failed: 0, skipped: 0, passed: 0, total: 0 };

  const sections = tempStore.reportTracker[parent];

  for (const section in sections) {
    const categories = tempStore.reportTracker[parent][section];

    //Need to add one more layer for sections?
    for (const key in categories) {
      const {devices} = categories[key];
      if(devices === undefined) continue;
      const deviceIds = Object.keys(devices);

      total += deviceIds.length;

      for (const deviceId of deviceIds) {
        const {passedStatus: status} = devices[deviceId];

        if (status === 'passed' || status === 'detail') passed++;
        else if (status === 'failed') failed++;
        else if (status === 'skipped') skipped++;
      }
    }
  }

  return { failed, skipped, passed, total };
};
</script>

<template>
  <GenericLayout :separator="false">
    <template v-slot:title>
      <p class="text-2xl text-black font-semibold mb-2">Test Report</p>
      <p class="text-base text-black mb-4">Full report of Learning Lab QA Test</p>

      <div class="flex flex-row">
        <div v-for="title in tempStore.getReportTitles" :key="title"
            class="flex items-center mx-2 p-2 rounded-lg cursor-pointer
            font-semibold hover:bg-blue-50 hover:text-blue-500"
            :class="{
              'bg-blue-50 text-blue-500': reportCategory === title,
              'text-slate-600': reportCategory !== title
            }"
          @click="reportCategory = title"
        >
          {{stateStore.generateTitle(title)}}
          <div v-if="generateCategoryStatus(title).failed > 0" class="ml-2 px-1.5 bg-red-200 rounded-2xl text-sm text-red-700 font-semibold border-[1px] border-red-400">{{generateCategoryStatus(title).failed}}</div>
        </div>
      </div>


    </template>

    <template v-slot:content>
      <template v-for="title in tempStore.getReportTitles">
        <BasicReport v-if="reportCategory === title" :page="title" :key="title"/>
      </template>
    </template>
  </GenericLayout>
</template>
