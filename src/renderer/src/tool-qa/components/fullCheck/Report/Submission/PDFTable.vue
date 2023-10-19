<script setup lang="ts">
import { useStateStore } from "@renderer/tool-qa/store/stateStore";
import { useFullStore } from "@renderer/tool-qa/store/fullStore";
import { computed } from "vue";
import { Category } from "@renderer/tool-qa/interfaces/_report";
import PDFTableRow from "@renderer/tool-qa/components/fullCheck/Report/Submission/PDFTableRow.vue";

const props = defineProps({
  parent: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true
  },
  section: {
    type: Object as () => Category,
    required: true
  }
});

const fullStore = useFullStore();
const stateStore = useStateStore();

/**
 * Show the user a quick view of if the tests were passed by all devices.
 */
const generateCategoryStatus = computed(() => {
  let { failed, skipped, passed, total } = { failed: 0, skipped: 0, passed: 0, total: 0 };

  const categories = fullStore.reportTracker[props.parent][props.category];

  for (const key in categories) {
    const { devices } = categories[key];
    const deviceIds = Object.keys(devices);

    total += deviceIds.length;

    for (const deviceId of deviceIds) {
      const { passedStatus: status } = devices[deviceId];

      if (status === 'passed') passed++;
      else if (status === 'failed') failed++;
      else if (status === 'skipped') skipped++;
    }
  }

  if (total === 0 || skipped > 0) return 'skipped';
  if (failed > 0) return 'failed';
  if (passed === total) return 'passed';

  return 'unknown';
});
</script>

<template>
  <div class="w-full mb-4 flex flex-col rounded-lg border-2 border-gray-200">
    <div class="flex flex-row items-center">
      <!--Category Title-->
      <h2 class="font-semibold text-lg p-3">{{ stateStore.generateTitle(category) }}</h2>

      <!--Quick look at category status-->
      <div class="p-3 text-sm h-12 w-28 font-semibold">
        <div class="rounded-xl w-fit px-2" :class="{
                      'bg-red-100 border-[1px] border-red-300 text-red-700': generateCategoryStatus === 'failed',
                      'bg-green-100 border-[1px] border-green-300 text-green-700': generateCategoryStatus === 'passed',
                      'bg-yellow-100 border-[1px] border-yellow-300 text-yellow-600': generateCategoryStatus !== 'failed' && generateCategoryStatus !== 'passed',
                    }">
          {{stateStore.capitalizeFirstLetter(typeof generateCategoryStatus === "string" ? generateCategoryStatus : "Skipped") ?? 'Skipped'}}
        </div>
      </div>
    </div>

    <table class="w-full border-collapse">
      <tr class="text-left text-xs bg-gray-100 border border-gray-200">
        <th class="p-3">Name</th>
        <th class="p-3 text-center">Date</th>
        <th class="p-3 text-center">Status</th>
        <th></th> <!--Empty on purpose-->
      </tr>

      <template v-for="(check, key) in props.section">
        <PDFTableRow :check-id="<string>key" :check="check" :status="'passed'"/>
      </template>
    </table>
  </div>
</template>
