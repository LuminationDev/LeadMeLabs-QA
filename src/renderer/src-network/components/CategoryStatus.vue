<script setup lang="ts">
import { useStateStore } from "../../src-qa/store/stateStore";
import { useNetworkStore } from "../store/networkStore";
import { computed } from "vue";

const stateStore = useStateStore();
const networkStore = useNetworkStore();

const props = defineProps({
  category: {
    type: String,
    required: true
  }
})

/**
 * Show the user a quick view of if the tests were passed by all devices.
 */
const generateCategoryStatus = computed(() => {
  let { unchecked, failed, skipped, passed, warning, not_applicable, total } =
      { unchecked: 0, failed: 0, skipped: 0, passed: 0, warning: 0, not_applicable: 0, total: 0 };

  Object.entries(networkStore.reportTracker[props.category]).forEach(([key, item]) => {
    // Now 'key' is the key, and 'item' is the corresponding object
    total += 1;

    const { passedStatus: status, checkingStatus: checking } = item;

    if (checking === 'unchecked') unchecked++;
    else if (status === 'passed') passed++;
    else if (status === 'warning') warning++;
    else if (status === 'failed') failed++;
    else if (status === 'not_applicable') not_applicable++;
    else if (status === 'skipped' || status === undefined || 'unchecked') skipped++;
  });

  if (unchecked === total) return "not_started";
  if (unchecked > 0) return "testing...";
  if (failed > 0) return 'failed';
  if (warning > 0) return 'warning';
  if (skipped > 0 && (failed > 0 || passed > 0)) return 'incomplete';
  if (skipped > 0) return 'skipped';
  if (passed > 0 && passed + not_applicable === total) return 'passed';
  if (total === 0 || not_applicable > 0) return 'N/A';

  return 'unknown';
});
</script>

<template>
  <td class="p-3 text-sm h-12 w-28 font-semibold">
    <div v-if="generateCategoryStatus !== 'not_started'" class="rounded-xl w-fit px-2"
       :class="{
        'bg-blue-100 border-[1px] border-blue-300 text-blue-700': generateCategoryStatus === 'testing...',
        'bg-red-100 border-[1px] border-red-300 text-red-700': generateCategoryStatus === 'failed',
        'bg-green-100 border-[1px] border-green-300 text-green-700': generateCategoryStatus === 'passed',
        'bg-yellow-100 border-[1px] border-yellow-300 text-yellow-600': generateCategoryStatus !== 'failed'
                                                                      && generateCategoryStatus !== 'passed'
                                                                      && generateCategoryStatus !== 'testing...',
    }">
      {{stateStore.capitalizeFirstLetter(typeof generateCategoryStatus === "string" ? generateCategoryStatus : "Skipped") ?? 'Skipped'}}
    </div>
  </td>
</template>
