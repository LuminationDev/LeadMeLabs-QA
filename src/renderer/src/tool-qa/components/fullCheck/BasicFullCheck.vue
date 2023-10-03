<script setup lang="ts">
import InformationTitle from "@renderer/tool-qa/components/checks/InformationTitle.vue";
import InformationRow from '@renderer/tool-qa/components/checks/InformationRow.vue';
import { computed, onBeforeMount, watchEffect } from "vue";
import { useStateStore } from "@renderer/tool-qa/store/stateStore";
import { useFullStore } from "@renderer/tool-qa/store/fullStore";
import { QaCheck, ReportTrackerItem } from "@renderer/tool-qa/interfaces";
import ItemHover from "@renderer/tool-qa/components/fullCheck/ItemHover.vue";

const fullStore = useFullStore();
const props = defineProps({
  title: {
    type: String,
    required: true
  },
  objectName: {
    type: String,
    required: true
  }
});

const stateStore = useStateStore();

const keyAnswered = (key: string, value: boolean) => {
  const reportTracker: QaCheck[] = fullStore.reportTracker[props.objectName];
  reportTracker.find(item => item.id === key)['passedStatus'] = value ? 'passed' : 'failed';
  reportTracker.find(item => item.id === key)['date'] = stateStore.formattedDate();
}

const numberOfChecks = computed(() => {
  return fullStore.reportTracker[props.objectName].length;
});

const currentlyCorrect = computed(() => {
  return fullStore.reportTracker[props.objectName]
      .filter(item => item.passedStatus === 'passed')
      .length;
});

const currentlyUnanswered = computed(() => {
  return fullStore.reportTracker[props.objectName]
      .filter(item => item['passedStatus'] === undefined || item['passedStatus'] === null)
      .length;
});

/**
 * The precedent for if a user can continue to the next segment.
 */
const calcProceed = () => {
  stateStore.canProceed = currentlyUnanswered.value === 0;
}

/**
 * Watch for any changes in the calcProceed to re-evaluate if the user can continue.
 */
watchEffect(() => {
  calcProceed();
});

/**
 * Determine if the necessary values are currently inputted to allow a user to progress with the tool.
 * If not, block the 'Next' button on the BottomBar until they are.
 */
onBeforeMount(() => {
  calcProceed();
});
</script>

<template>
  <InformationRow
      v-for="(check, index) in fullStore.reportTracker[props.objectName] as ReportTrackerItem" :key="index"
      @answered="keyAnswered"
      :title="check.id"
      :text="check.message"
      :correct="check.passedStatus"/>
</template>


<!--<div class="w-full mb-4 flex flex-col rounded-lg border-2 border-gray-200">-->

<!--<div class="flex flex-row items-center">-->
<!--  &lt;!&ndash;Category Title&ndash;&gt;-->
<!--  <h2 class="font-semibold text-lg p-3">{{ item.id }}</h2>-->
<!--</div>-->

<!--<table class="w-full border-collapse">-->
<!--  <tr class="text-left text-xs bg-gray-100 border border-gray-200">-->
<!--    <th class="p-3">Name</th>-->
<!--    <th v-for="(station, index) in fullStore.NucStationList" class="p-3">{{`S${index}`}}</th>-->
<!--    <th v-for="(tablets, index) in fullStore.tablets" class="p-3">{{`T${index}`}}</th>-->
<!--    <th class="p-3">NUC</th>-->
<!--    <th class="p-3">C-Bus</th>-->
<!--  </tr>-->

<!--  <tr class="text-sm border border-gray-200">-->
<!--    <ItemHover :title="item.id" :message="item.message "/>-->

<!--    &lt;!&ndash;Station checkboxes&ndash;&gt;-->
<!--    <td v-for="(station, index) in fullStore.NucStationList" class="p-3">-->
<!--      <input type="checkbox"/>-->
<!--    </td>-->

<!--    &lt;!&ndash;Tablet checkboxes&ndash;&gt;-->
<!--    <td v-for="(tablets, index) in fullStore.tablets" class="p-3">-->
<!--      <input type="checkbox"/>-->
<!--    </td>-->

<!--    &lt;!&ndash;Nuc checkbox&ndash;&gt;-->
<!--    <th class="p-3">-->
<!--      <input type="checkbox"/>-->
<!--    </th>-->

<!--    &lt;!&ndash;C-bus checkbox&ndash;&gt;-->
<!--    <th class="p-3">-->
<!--      <input type="checkbox"/>-->
<!--    </th>-->
<!--  </tr>-->
<!--</table>-->
<!--</div>-->