<script setup lang="ts">
import { computed } from "vue";

const props = defineProps({
  reportItems: {
    type: Object as () => { [key: string]: any },
    required: false
  }
});

const counts = computed(() => {
  const { totalEntries, passedStatusCount, failedCount, withoutComment } = Object.values(props.reportItems).reduce(
      (acc, item) => {
        acc.totalEntries += item.length;
        acc.passedStatusCount += item.filter(entry => entry['passedStatus'] === 'passed').length;
        acc.failedCount += item.filter(entry => entry['passedStatus'] === 'failed').length;
        acc.withoutComment += item.filter(entry => entry['passedStatus'] === 'failed' && entry['comment'] === undefined).length;
        return acc;
      },
      { totalEntries: 0, passedStatusCount: 0, failedCount: 0, withoutComment: 0 }
  );

  return { totalEntries, passedStatusCount, failedCount, withoutComment };
});

const passedTests = computed(() => {
  return counts.value.passedStatusCount;
});

const failedTests = computed(() => {
  return counts.value.failedCount;
});

const withoutComment = computed(() => {
  return counts.value.withoutComment;
});

const totalTests = computed(() => {
  return counts.value.totalEntries;
});

const passedStatusPercentage = computed(() => {
  return totalTests.value ? ((passedTests.value / totalTests.value) * 100).toFixed(0) : 0;
});
</script>

<template>
  <!--Test result details-->
  <div>
    <!--Passed tests information-->
    <div class="w-2/3 mb-4 p-4 flex flex-col rounded-lg border-2 border-gray-200">
      <div class="flex flex-row justify-between">
        <div class="flex flex-col text-sm mb-3">
          <div class="font-semibold">
            Test results
          </div>
          <div>
            {{passedTests}} out of {{totalTests}} tests were passed.
          </div>
        </div>

        <div class="font-semibold text-4xl">
          {{passedStatusPercentage}}%
        </div>
      </div>

      <div class="flex flex-row my-3 items-center">
        <div class="w-full relative">
          <div
              class="bg-blue-500 rounded-full h-2 absolute z-10"
              :style="{ width: passedStatusPercentage + '%' }"
          ></div>
          <div class="w-full bg-zinc-300 rounded-full h-2 absolute"></div>
        </div>
      </div>
    </div>

    <!--Failed tests information-->
    <div v-if="failedTests > 0" class="w-1/3 ml-4 mb-4 flex flex-col rounded-lg border-2 border-gray-200">
      <div class="flex flex-row pt-4 pl-4 pr-4 justify-between">
        <div class="flex flex-col text-sm mb-3">
          <div class="font-semibold">
            Tests failed
          </div>
          <div>
            {{withoutComment}} without comment.
          </div>
        </div>

        <div class="font-semibold text-4xl">
          {{failedTests}}
        </div>
      </div>

      <div class="flex flex-row my-3 items-center px-3 pb-4">
        <div v-for="error in failedTests" class="w-full bg-red-700 rounded-full h-2 mx-1"></div>
      </div>
    </div>
  </div>
</template>
