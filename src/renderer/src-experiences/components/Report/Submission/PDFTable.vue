<script setup lang="ts">
import { useStateStore } from "../../../../store/stateStore";
import { useExperienceStore } from "../../../store/experienceStore";
import { computed } from "vue";
import { Category, Comment } from "../../../interfaces/_report";
import PDFTableRow from "./PDFTableRow.vue";

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

const experienceStore = useExperienceStore();
const stateStore = useStateStore();

/**
 * Show the user a quick view of if the tests were passed by all devices.
 */
const generateCategoryStatus = computed(() => {
  let { failed, skipped, passed, warning, not_applicable, total } =
      { failed: 0, skipped: 0, passed: 0, warning:0, not_applicable: 0, total: 0 };

  const categories = experienceStore.reportTracker[props.parent][props.category];

  for (const key in categories) {
    const { devices } = categories[key];
    if(devices === undefined) continue;
    const deviceIds = Object.keys(devices);

    total += deviceIds.length;

    for (const deviceId of deviceIds) {
      const { passedStatus: status } = devices[deviceId];

      if (status === 'passed' || status === 'detail') passed++;
      else if (status === 'warning') warning++;
      else if (status === 'failed') failed++;
      else if (status === 'not_applicable') not_applicable++;
      else if (status === 'skipped' || status === undefined || 'unchecked') skipped++;
    }
  }

  if (failed > 0) return 'failed';
  if (warning > 0) return 'warning';
  if (skipped > 0 && (failed > 0 || passed > 0)) return 'incomplete';
  if (skipped > 0) return 'skipped';
  if (passed > 0 && passed + not_applicable === total) return 'passed';
  if (total === 0 || not_applicable > 0) return 'N/A';

  return 'unknown';
});

const getComments = computed((): Comment[] => {
  //@ts-ignore
  return <Comment[]>props.section['comments'] || [];
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
          {{stateStore.capitalizeFirstLetter(typeof generateCategoryStatus === "string" ? generateCategoryStatus : "Skipped") ?? 'Skipped'}}
        </div>
      </div>
    </div>

    <table class="w-full border-collapse">
      <tr class="bg-gray-50 text-xs" v-for="comment in getComments">
        <td colspan="3" class="pl-8 p-3">
          <div>
            {{comment.date}}
          </div>
          <div>
            <span class="font-semibold mr-1">Comment:</span> {{comment.content}}
          </div>
        </td>
      </tr>

      <tr class="text-left text-xs bg-gray-100 border border-gray-200">
        <th class="p-3 w-2/3">Name</th>
        <th class="p-3 w-1/6 text-center">Date</th>
        <th class="p-3 w-1/6 text-center">Status</th>
        <th></th> <!--Empty on purpose-->
      </tr>

      <template v-for="(check, key) in props.section">
        <PDFTableRow :check-id="<string>key" :check="check" :status="'passed'"/>
      </template>
    </table>
  </div>
</template>
