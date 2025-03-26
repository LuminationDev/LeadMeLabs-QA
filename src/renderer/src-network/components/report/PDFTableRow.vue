<script setup lang="ts">
import { useStateStore } from "../../../store/stateStore";
import { Check } from "../../interfaces/_report";
import { useNetworkStore } from "../../store/networkStore";

defineProps({
  checkId: {
    type: String,
    required: true
  },
  check: {
    type: Object as () => Check,
    required: true
  }
});

useNetworkStore();
const stateStore = useStateStore();
</script>

<template>
  <tr class="h-12 w-full text-sm border-l border-t border-r border-gray-200">
    <td class="flex flex-row items-center">
      <div class="p-3 font-semibold mr-1">{{ stateStore.generateTitle(checkId) }}</div>
    </td>

    <td class="p-3 w-36 text-center">
      {{check.date ?? "-"}}
    </td>

    <td class="p-3 w-28 font-semibold">
      <div class="flex mx-auto justify-center items-center rounded-xl w-24 px-2" :class="{
                  'bg-red-100 border border-red-300 text-red-700': check.passedStatus === 'failed',
                  'bg-green-100 border border-green-300 text-green-700': check.passedStatus === 'passed',
                  'bg-yellow-100 border border-yellow-300 text-yellow-600': check.passedStatus !== 'failed' && check.passedStatus !== 'passed',
                }">
        {{ stateStore.capitalizeFirstLetter(check.passedStatus ?? "Skipped") }}
      </div>
    </td>
  </tr>

  <tr v-if="check.message !== ''" class="bg-gray-50 text-xs">
    <td colspan="3" class="pl-8 p-3">
      <div>
        <span class="font-semibold mr-1">Details:</span> {{check.message}}
      </div>
    </td>
  </tr>
</template>
