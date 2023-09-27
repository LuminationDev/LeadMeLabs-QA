<script setup lang="ts">
import TestResults from "@renderer/tool-qa/components/fullCheck/Report/TestResults.vue";
import CommentModal from "@renderer/tool-qa/modals/CommentModal.vue";
import { useFullStore } from "@renderer/tool-qa/store/fullStore";
import { useStateStore } from "@renderer/tool-qa/store/stateStore";
import { computed, ref } from "vue";
import ItemHover from "@renderer/tool-qa/components/fullCheck/Report/ItemHover.vue";
import AutoSection from "@renderer/tool-qa/components/fullCheck/Report/AutoSection.vue";

interface ReportItem { [key: string]: any }

const fullStore = useFullStore();
const stateStore = useStateStore();
const currentlySelected = ref("");
const showAutoChecks = ref(false);

const props = defineProps({
  auto: {
    type: String,
    required: false
  },
  section: {
    type: Array<string>,
    required: false
  }
});

/**
 * Filter out the report items that are part of the supplied section.
 */
const reportItems = computed((): ReportItem => {
  if(props.section === undefined) {
    return fullStore.reportTracker;
  }

  const extractedValues: { [key: string]: any } = {};
  props.section.forEach(key => {
    if (fullStore.reportTracker[key]) {
      extractedValues[key] = fullStore.reportTracker[key];
    }
  });

  return extractedValues;
});

/**
 * Collect all the test results into one array.
 */
const testResults = computed(() => {
  const extractedValues: { [key: string]: any } = {};
  props.section.forEach(key => {
    if (fullStore.reportTracker[key]) {
      extractedValues[key] = fullStore.reportTracker[key];
    }
  });

  if(props.auto) {
    //Add the checks from the auto result section, these are grouped by station and hence need a bit more work
    Object.entries(fullStore.reportTracker[props.auto]).forEach(([key, value]) => {
      extractedValues[props.auto] = extractedValues[props.auto] || {};
      extractedValues[props.auto][key] = extractedValues[props.auto][key] || [];
      extractedValues[props.auto] = value;
    });
  }

  return extractedValues;
})

/**
 * Add a comment to the fullStore reportTracker item that has been selected
 */
const addComment = (comment: string) => {
  let key = null;

  for (const mainKey in reportItems.value) {
    if (reportItems.value.hasOwnProperty(mainKey)) {
      const entry = reportItems.value[mainKey].find((childEntry: { id: string }) => childEntry.id === currentlySelected.value);

      if (entry) {
        key = mainKey;
      }
    }
  }

  //Update the original tracker
  fullStore.reportTracker[key].find(item => item.id === currentlySelected.value)['comment'] = comment;
}

/**
 * Calculate how many tests have failed, passed or been skipped.
 */
const counts = computed(() => {
  const extractedValues = {};

  props.section.forEach(item => {
    if (fullStore.reportTracker[item]) {
      extractedValues[item] = getCounts(fullStore.reportTracker[item]);
    }
  });

  if (props.auto) {
    //Add the checks from the auto result section, these are grouped by station and hence need a bit more work
    Object.entries(fullStore.reportTracker[props.auto]).forEach(([key, value]) => {
      extractedValues[props.auto] = extractedValues[props.auto] || {};
      extractedValues[props.auto][key] = extractedValues[props.auto][key] || [];
      extractedValues[props.auto][key] = getCounts(fullStore.reportTracker[props.auto][key]);
    });
  }

  return extractedValues;
});

/**
 * Calculate just the automatic checks failed, passed and total counts.
 */
const allAutoCounts = computed(() => {
  const extractedValues = {};
  const flattenArray = []

  //Add the checks from the auto result section, these are grouped by station and hence need a bit more work
  Object.entries(fullStore.reportTracker[props.auto]).forEach(([key, value]) => {
    value.forEach(item => {
      flattenArray.push(item);
    })
  });
  extractedValues[props.auto] = getCounts(flattenArray);

  return extractedValues;
});

const getCounts = (entries: any) => {
  const { totalEntries, passedStatusCount, failedCount } = entries.reduce(
      (acc, item) => {
        acc.totalEntries += 1; // Increase totalEntries by 1 for each object in the array
        acc.passedStatusCount += item['passedStatus'] === 'passed' ? 1 : 0; // Increment passedStatusCount if 'passed'
        acc.failedCount += item['passedStatus'] === 'failed' ? 1 : 0; // Increment failedCount if 'failed'
        return acc;
      },
      { totalEntries: 0, passedStatusCount: 0, failedCount: 0 }
  );

  return { totalEntries, passedStatusCount, failedCount };
}

const statusValue = (category) => {
  if (category.failedCount > 0) {
    return category.failedCount + " Failed";
  } else if (category.passedStatusCount === category.totalEntries) {
    return "Passed";
  } else {
    return "Skipped";
  }
}

/**
 * Change the currently selected sub-check for assigning a comment to.
 */
const updateCurrentlySelected = (newValue: string) => {
  currentlySelected.value = newValue;
}
</script>

<template>
  <div class="flex flex-col">
    <TestResults :report-items="testResults"/>

    <div v-if="props.auto" class="flex flex-col w-full mb-4 rounded-lg border-2 border-gray-200">
      <div class="flex flex-row justify-between items-center">
        <div class="flex items-center grow">
          <!--Category Title-->
          <h2 class="font-semibold text-lg p-3">Auto Checks</h2>

          <!--Quick look at all the auto results-->
          <div class="flex items-center rounded-xl w-fit h-5 text-sm px-2 font-semibold" :class="{
                    'bg-red-100 border-[1px] border-red-300 text-red-700': allAutoCounts[auto].failedCount > 0,
                    'bg-green-100 border-[1px] border-green-300 text-green-700': allAutoCounts[auto].passedStatusCount === allAutoCounts[auto].totalEntries,
                    'bg-blue-100 border-[1px] border-blue-300 text-blue-700': allAutoCounts[auto].failedCount + allAutoCounts[auto].passedStatusCount !== allAutoCounts[auto].totalEntries,
                  }">
            {{statusValue(allAutoCounts[auto])}}
          </div>
        </div>

        <img @click="showAutoChecks = !showAutoChecks" class="w-6 h-6 mr-6 cursor-pointer" alt="down" src="../../../../assets/icons/chevron-down.svg"/>
      </div>

      <AutoSection v-if="showAutoChecks" v-for="(stationChecks, key) in fullStore.reportTracker[auto]" :key="key"
         @update="updateCurrentlySelected"
         :auto="auto"
         :station-id="key"
         :currentlySelected="currentlySelected"
         :station-checks="stationChecks"
         :quick-ref="statusValue(counts[auto][key])"
         :failed-count="counts[auto][key].failedCount"
         :passed-status-count="counts[auto][key].passedStatusCount"
         :total-entries="counts[auto][key].totalEntries"/>
    </div>

    <div class="w-full mb-3" v-for="(categories, categoryKey) in reportItems" :key="categoryKey">
      <div class="w-full mb-4 flex flex-col rounded-lg border-2 border-gray-200">

        <div class="flex flex-row items-center">
          <!--Category Title-->
          <h2 class="font-semibold text-lg p-3">{{ stateStore.capitalizeFirstLetter(categoryKey.toLowerCase()) }}</h2>

          <!--Quick look at category status-->
          <div class="flex items-center rounded-xl w-fit h-5 text-sm px-2 font-semibold" :class="{
                  'bg-red-100 border-[1px] border-red-300 text-red-700': counts[categoryKey].failedCount > 0,
                  'bg-green-100 border-[1px] border-green-300 text-green-700': counts[categoryKey].passedStatusCount === counts[categoryKey].totalEntries,
                  'bg-blue-100 border-[1px] border-blue-300 text-blue-700': counts[categoryKey].failedCount + counts[categoryKey].passedStatusCount !== counts[categoryKey].totalEntries,
                }">
            {{statusValue(counts[categoryKey])}}
          </div>
        </div>

        <!--General Category Comments-->
        <div v-if="categories['comment'] !== undefined" class="mb-2 text-sm flex flex-row">
          <div class="font-semibold ml-3 mr-2">
            Comments:
          </div>
          <div>
            {{categories['comment']}}
          </div>
        </div>

        <table class="w-full border-collapse">
          <tr class="text-left text-xs bg-gray-100 border border-gray-200">
            <th class="p-3">Name</th>
            <th class="p-3">Date</th>
            <th class="p-3">Status</th>
            <th></th> <!--Empty on purpose-->
          </tr>

          <tr v-for="(item, index) in categories" :key="index" class="text-sm border border-gray-200">
            <ItemHover :title="item.id" :message="item.message "/>

            <td class="p-3 w-36">
              <div>{{item.date}}</div>
            </td>

            <td class="p-3 w-28 font-semibold">
              <div class="rounded-xl w-fit px-2" :class="{
                'bg-red-100 border-[1px] border-red-300 text-red-700': item['passedStatus'] === 'failed',
                'bg-green-100 border-[1px] border-green-300 text-green-700': item['passedStatus'] === 'passed',
                'bg-blue-100 border-[1px] border-blue-300 text-blue-700': item['passedStatus'] !== 'failed' && item['passedStatus'] !== 'passed',
              }">
                {{stateStore.capitalizeFirstLetter(typeof item['passedStatus'] === "string" ? item['passedStatus'] : "Skipped") ?? 'Skipped'}}
              </div>
            </td>
            <td class="p-3 w-28" v-on:click="currentlySelected = item.id">
              <CommentModal :mode="item['comment'] !== undefined && item['comment'].length > 0 ? 'icon' : 'icon-empty'"
                            :current-comment="item['comment']"
                            :callback="addComment"/>
            </td>
          </tr>
        </table>
      </div>
    </div>
  </div>
</template>
