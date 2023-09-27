<script setup lang="ts">
import AutoSection from "@renderer/tool-qa/components/fullCheck/Report/AutoSection.vue";
import { computed, ref } from "vue";
import { useFullStore } from "@renderer/tool-qa/store/fullStore";

const fullStore = useFullStore();
const showAutoChecks = ref(false);
const currentlySelected = ref("");

const props = defineProps({
  autoCheck: {
    type: String,
    required: false
  }
});

const counts = computed(() => {
  const extractedValues = {};

  if(props.autoCheck) {
    if (fullStore.reportTracker[props.autoCheck] !== undefined) {
      //Add the checks from the auto result section, these are grouped by station and hence need a bit more work
      Object.entries(fullStore.reportTracker[props.autoCheck]).forEach(([subKey, value]) => {
        extractedValues[props.autoCheck] = extractedValues[props.autoCheck] || {};
        extractedValues[props.autoCheck][subKey] = extractedValues[props.autoCheck][subKey] || [];
        extractedValues[props.autoCheck][subKey] = fullStore.getCounts(fullStore.reportTracker[props.autoCheck][subKey]);
      });
    }
  }

  return extractedValues;
});

const autoCounts = computed(() => {
  const extractedValues = {};
  const flattenArray = []

  if(props.autoCheck) {
    if (fullStore.reportTracker[props.autoCheck] !== undefined) {
      //Add the checks from the auto result section, these are grouped by station and hence need a bit more work
      Object.entries(fullStore.reportTracker[props.autoCheck]).forEach(([subKey, value]) => {
        value.forEach(item => {
          flattenArray.push(item);
        })
      });
      extractedValues[props.autoCheck] = fullStore.getCounts(flattenArray);
    } else {
      //Default values if the auto section has been skipped
      extractedValues[props.autoCheck] = { totalEntries: 0, passedStatusCount: 0, failedCount: 0 }
    }
  }

  return extractedValues;
});

/**
 * Change the currently selected sub-check for assigning a comment to.
 */
const updateCurrentlySelected = (newValue: string) => {
  currentlySelected.value = newValue;
}
</script>

<template>
  <div class="flex flex-col w-full mt-4 rounded-lg border-2 border-gray-200">
    <div class="flex flex-row justify-between items-center">
      <div class="flex items-center grow">
        <!--Category Title-->
        <h2 class="font-semibold text-lg p-3">{{autoCheck}}</h2>

        <!--Quick look at all the auto results-->
        <div class="flex items-center rounded-xl w-fit h-5 text-sm px-2 font-semibold" :class="{
                      'bg-red-100 border-[1px] border-red-300 text-red-700': autoCounts[autoCheck].failedCount > 0,
                      'bg-green-100 border-[1px] border-green-300 text-green-700': autoCounts[autoCheck].passedStatusCount === autoCounts[autoCheck].totalEntries && autoCounts[autoCheck].totalEntries > 0,
                      'bg-blue-100 border-[1px] border-blue-300 text-blue-700': (autoCounts[autoCheck].failedCount + autoCounts[autoCheck].passedStatusCount !== autoCounts[autoCheck].totalEntries) || autoCounts[autoCheck].totalEntries === 0,
                    }">
          {{fullStore.statusValue(autoCounts[autoCheck])}}
        </div>
      </div>

      <img v-if="autoCounts[autoCheck].totalEntries > 0"
           @click="showAutoChecks = !showAutoChecks"
           class="w-6 h-6 mr-6 cursor-pointer"
           :class="{'scale-y-[-1]': showAutoChecks}"
           alt="down"
           src="../../../../assets/icons/chevron-down.svg"/>
    </div>

    <AutoSection v-if="showAutoChecks" v-for="(stationChecks, key) in fullStore.reportTracker[autoCheck]" :key="key"
                 @update="updateCurrentlySelected"
                 :auto="autoCheck"
                 :station-id="key"
                 :currentlySelected="currentlySelected"
                 :station-checks="stationChecks"
                 :quick-ref="fullStore.statusValue(counts[autoCheck][key])"
                 :failed-count="counts[autoCheck][key].failedCount"
                 :passed-status-count="counts[autoCheck][key].passedStatusCount"
                 :total-entries="counts[autoCheck][key].totalEntries"/>
  </div>
</template>
