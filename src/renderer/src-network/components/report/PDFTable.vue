<script setup lang="ts">
import { useStateStore } from "../../../store/stateStore";
import { computed } from "vue";
import PDFTableRow from "./PDFTableRow.vue";
import { useNetworkStore } from "../../store/networkStore";
import {DESCRIPTIONS} from "../../../assets/checks/_networkValues";

const props = defineProps({
  category: {
    type: String,
    required: true
  }
});

const networkStore = useNetworkStore();
const stateStore = useStateStore();

const generateTitle = (text: string|null) => {
  if (text === "not_started" || text === null) {
    return "Skipped"
  }

  return stateStore.capitalizeFirstLetter(typeof generateCategoryStatus === "string" ? generateCategoryStatus : "Skipped")
}

/**
 * Show the user a quick view of if the tests were passed by all devices.
 */
const generateCategoryStatus = computed(() => {
  return networkStore.generateCategoryStatus(props.category);
});
</script>

<template>
  <div class="w-full my-8 flex flex-col rounded-lg border-2 border-gray-200">
    <div class="flex flex-row items-center">
      <!--Category Title-->
      <h2 class="font-semibold text-lg p-3">{{ stateStore.generateTitle(category) }}</h2>

      <!--Quick look at category status-->
      <div class="p-3 text-sm h-12 w-28 font-semibold">
        <div class="rounded-xl w-fit px-2" :class="{
                      'bg-red-100 border border-red-300 text-red-700': generateCategoryStatus === 'failed',
                      'bg-green-100 border border-green-300 text-green-700': generateCategoryStatus === 'passed',
                      'bg-yellow-100 border border-yellow-300 text-yellow-600': generateCategoryStatus !== 'failed' && generateCategoryStatus !== 'passed',
                    }">
          {{generateTitle(generateCategoryStatus)}}
        </div>
      </div>
    </div>

    <table class="w-full border-collapse">
      <tr class="text-xs">
        <td colspan="3" class="px-3 pb-2">
          {{DESCRIPTIONS[props.category].passed}}
        </td>
      </tr>

      <tr class="text-left text-xs bg-gray-100 border border-gray-200">
        <th class="p-3 w-2/3">Name</th>
        <th class="p-3 w-1/6 text-center">Date</th>
        <th class="p-3 w-1/6 text-center">Status</th>
        <th></th> <!--Empty on purpose-->
      </tr>

      <template v-for="(check) in networkStore.reportTracker[props.category]">
        <PDFTableRow :check-id="<string>check.id" :check="check"/>
      </template>
    </table>
  </div>
</template>
