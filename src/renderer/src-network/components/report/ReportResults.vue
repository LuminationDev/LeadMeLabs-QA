<script setup lang="ts">
import { computed } from "vue";
import { useNetworkStore } from "../../store/networkStore";

const props = defineProps({
  parent: {
    type: String,
    required: true
  },
  margin: {
    type: Boolean,
    required: false,
    default: true
  }
});

const networkStore = useNetworkStore();

/**
 * Show the user a quick view of the test results
 */
const generateCategoryResults = computed(() => {
  let { failed, skipped, passed, total } =
      { failed: 0, skipped: 0, passed: 0, total: 0 };

  Object.entries(networkStore.reportTracker[props.parent]).forEach(([_, item]) => {
    total += 1;

    const { passedStatus: status } = item;

    switch (status) {
      case 'passed':
        passed++;
        break;
      case 'failed':
        failed++;
        break;
      case 'unchecked':
      case undefined:
      case 'skipped':
        skipped++;
        break;
    }
  });

  return { failed, skipped, passed, total };
});

const passedStatusPercentage = computed(() => {
  return generateCategoryResults.value.total ? ((generateCategoryResults.value.passed / generateCategoryResults.value.total) * 100).toFixed(0) : 0;
});

const skippedStatusPercentage = computed(() => {
  const percent = ((generateCategoryResults.value.skipped / generateCategoryResults.value.total) * 100).toFixed(0);
  const leftover = passedStatusPercentage.value;
  return parseInt(percent) + parseInt(<string>leftover);
});
</script>

<template>
  <div class="w-full">
    <!--Passed tests information-->
    <div class="w-2/3 mb-4 p-4 flex flex-col rounded-lg border-2 border-gray-200">
      <div class="flex flex-row justify-between">
        <div class="flex flex-col text-sm mb-3">
          <div class="font-semibold mb-1">
            Test results
          </div>
          <div class="flex flex-row">
            <div>
              {{generateCategoryResults.passed}} out of {{generateCategoryResults.total}} tests were passed or N/A.
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
    <div class="w-1/3 mb-4 flex flex-col rounded-lg border-2 border-gray-200" :class="{ 'ml-4': margin }">
      <div class="flex flex-row pt-4 pl-4 pr-4 justify-between">
        <div class="flex flex-col text-sm mb-3">
          <div class="font-semibold mb-1">Tests failed</div>
          <div v-if="generateCategoryResults.failed === 0">No tests were failed.</div>
          <div v-else>{{generateCategoryResults.failed}}</div>
        </div>

        <div class="font-semibold text-4xl">{{generateCategoryResults.failed}}</div>
      </div>

      <div class="flex flex-row my-3 items-center px-3 pb-4">
        <div v-if="generateCategoryResults.failed === 0" class="w-full bg-green-600 rounded-full h-2 mx-1"/>
        <template v-else>
          <div v-for="index in generateCategoryResults.failed" :key="index" class="w-full bg-red-700 rounded-full h-2 mx-1"/>
        </template>
      </div>
    </div>
  </div>
</template>
