<script setup lang="ts">
import { computed } from "vue";
import { useFullStore } from "@renderer/tool-qa/store/fullStore";

const props = defineProps({
  parent: {
    type: String,
    required: true
  }
});

const fullStore = useFullStore();

/**
 * Show the user a quick view of the test results
 */
const generateCategoryResults = computed(() => {
  let { failed, skipped, passed, not_applicable, failedWithoutComments, failedWithComments, total } =
      { failed: 0, skipped: 0, passed: 0, not_applicable: 0, failedWithoutComments: 0, failedWithComments: 0, total: 0 };

  for (const section in fullStore.reportTracker[props.parent]) {
    const categories = fullStore.reportTracker[props.parent][section];

    for (const key in categories) {
      const { devices, comments } = categories[key];
      const deviceIds = Object.keys(devices);

      total += deviceIds.length;

      let updateComments = false;
      for (const deviceId of deviceIds) {
        const { passedStatus: status } = devices[deviceId];

        switch (status) {
          case 'passed':
            passed++;
            break;
          case 'not_applicable':
            not_applicable++;
            break;
          case 'failed':
            failed++;
            updateComments = true;
            break;
          case 'skipped':
            skipped++;
            break;
        }
      }

      //A device has failed a test and there is no comments.
      if (updateComments && comments.length === 0) {
        failedWithoutComments++;
      } else if (updateComments) { //A device failed but there was a comment
        failedWithComments++;
      }
    }
  }

  return { failed, skipped, passed, not_applicable, failedWithoutComments, failedWithComments, total };
});

const passedStatusPercentage = computed(() => {
  return generateCategoryResults.value.total ? (((generateCategoryResults.value.passed + generateCategoryResults.value.not_applicable) / generateCategoryResults.value.total) * 100).toFixed(0) : 0;
});

const skippedStatusPercentage = computed(() => {
  const percent = ((generateCategoryResults.value.skipped / generateCategoryResults.value.total) * 100).toFixed(0);
  const leftover = passedStatusPercentage.value;
  return parseInt(percent) + parseInt(<string>leftover);
});
</script>

<template>
  <div>
    <!--Passed tests information-->
    <div class="w-2/3 mb-4 p-4 flex flex-col rounded-lg border-2 border-gray-200">
      <div class="flex flex-row justify-between">
        <div class="flex flex-col text-sm mb-3">
          <div class="font-semibold mb-1">
            Test results
          </div>
          <div class="flex flex-row">
            <div>
              {{generateCategoryResults.passed + generateCategoryResults.not_applicable}} out of {{generateCategoryResults.total}} tests were passed or N/A.
            </div>
            <div v-if="generateCategoryResults.skipped > 0" class="ml-1">
              {{generateCategoryResults.skipped}} were skipped.
            </div>
          </div>
        </div>

        <div class="font-semibold text-4xl">
          {{passedStatusPercentage}}%
        </div>
      </div>

      <div class="flex flex-row my-3 items-center">
        <div class="w-full relative">
          <div
              class="bg-yellow-100 rounded-full h-2 absolute z-[5]"
              :style="{ width: skippedStatusPercentage + '%' }"
          ></div>
          <div
              class="bg-blue-500 rounded-full h-2 absolute z-10"
              :style="{ width: passedStatusPercentage + '%' }"
          ></div>
          <div class="w-full bg-zinc-300 rounded-full h-2 absolute"></div>
        </div>
      </div>
    </div>

    <!--Failed tests information-->
    <div v-if="1 > 0" class="w-1/3 ml-4 mb-4 flex flex-col rounded-lg border-2 border-gray-200">
      <div class="flex flex-row pt-4 pl-4 pr-4 justify-between">
        <div class="flex flex-col text-sm mb-3">
          <div class="font-semibold mb-1">Tests failed</div>
          <div v-if="generateCategoryResults.failed === 0">No tests were failed.</div>
          <div v-else-if="generateCategoryResults.failedWithoutComments > 0">{{generateCategoryResults.failedWithoutComments}} without comment.</div>
          <div v-else>{{generateCategoryResults.failedWithComments}} with comment.</div>
        </div>

        <div class="font-semibold text-4xl">{{generateCategoryResults.failed}}</div>
      </div>

      <div class="flex flex-row my-3 items-center px-3 pb-4">
        <div v-if="generateCategoryResults.failed === 0" class="w-full bg-green-600 rounded-full h-2 mx-1"/>
        <template v-else>
          <div v-for="error in generateCategoryResults.failedWithoutComments" class="w-full bg-red-700 rounded-full h-2 mx-1"/>
          <div v-for="error in generateCategoryResults.failedWithComments" class="w-full bg-red-300 rounded-full h-2 mx-1"/>
        </template>
      </div>
    </div>
  </div>
</template>