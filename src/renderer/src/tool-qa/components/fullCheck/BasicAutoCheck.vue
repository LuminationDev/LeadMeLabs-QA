<script setup lang="ts">
import * as CONSTANT from "@renderer/assets/constants";
import { computed, onMounted, ref } from "vue";
import { useFullStore } from "@renderer/tool-qa/store/fullStore";
import { useStateStore } from "@renderer/tool-qa/store/stateStore";
import ItemHover from "@renderer/tool-qa/components/fullCheck/ItemHover.vue";
import StatusHover from "@renderer/tool-qa/components/fullCheck/StatusHover.vue";
import CommentModal from "@renderer/tool-qa/modals/CommentModal.vue";
import {useRoute} from "vue-router";

const fullStore = useFullStore();
const stateStore = useStateStore();
const currentStation = ref("");
const currentCheck = ref("");

interface ReportTracker {
  [checkType: string]: {
    [stationId: string]: ReportData[];
  };
}

interface ReportData {
  id: string;
  displayName: string;
  description: string;
  passedStatus: string;
  checkingStatus: string;
  message: string;
  date: string;
}

const route = useRoute();
const checkType = route.meta['checkType'];

/**
 * Consolidate the information to the single page with no memory at te moment/
 */
const reportTracker: ReportTracker = {};

/**
 * Change the data format and save the data within the fullStore.reportTracker
 */
const transformData = computed(() => {
  fullStore.qaGroups
      .filter(group => group.id === checkType)
      .forEach(group => {
        group.checks.forEach(check => {
          check.stations.forEach(station => {
            const stationId = station.id;
            const dataToUpdate: ReportData = {
              id: check.id,
              displayName: check.displayName,
              description: check.extendedDescription,
              passedStatus: station.passedStatus,
              checkingStatus: station.checkingStatus,
              message: station.message,
              date: stateStore.formattedDate()
            };

            //Add to the reportTracker (create fields if required)
            reportTracker[checkType] = reportTracker[checkType] || {};
            reportTracker[checkType][stationId] = reportTracker[checkType][stationId] || [];

            //Avoid double ups (mostly while dev working with hot-reload)
            const indexToUpdate = reportTracker[checkType][stationId].findIndex(entry => entry.id === dataToUpdate.id);
            if (indexToUpdate !== -1) {
              reportTracker[checkType][stationId][indexToUpdate] = dataToUpdate;
            } else {
              reportTracker[checkType][stationId].push(dataToUpdate);
            }
      });
    });
  });

  return reportTracker[checkType];
});

/**
 * Start the auto test once the component has been mounted, check that the server and connection is up first.
 */
onMounted(() => {
  fullStore.startQa(checkType);
  fullStore.sendMessage({
    action: CONSTANT.ACTION.RUN_STATION_GROUP,
    actionData: {
      group: checkType,
      stationIds: ['all']
    }
  });
});

const addComment = (comment: string) => {
  //Update the original tracker
  reportTracker[checkType][currentStation.value].find(item => item.id === currentCheck.value)['comment'] = comment;
}

/**
 * Update the currently selected check and station so that a comment can be added besides it.
 * @param check
 * @param stationId
 */
const updateCurrentlySelected = (check: string, stationId: string) => {
  currentCheck.value = check;
  currentStation.value = stationId;
}
</script>

<template>
  <div class="flex flex-col">
    <div class="mb-4">
      Checking {{checkType}}, automatically do stuff somehow.....
    </div>

    <div v-for="(stationChecks, key) in transformData" :key="key" class="w-full mb-4 flex flex-col rounded-lg border-2 border-gray-200">
      <div class="flex flex-row items-center">
        <!--Category Title-->
        <h2 class="font-semibold text-lg p-3">Station {{ key }}</h2>
      </div>

      <table class="w-full border-collapse">
        <tr class="text-left text-xs bg-gray-100 border border-gray-200">
          <th class="p-3">Name</th>
          <th class="p-3">Date</th>
          <th class="p-3">Status</th>
          <th></th> <!--Empty on purpose-->
        </tr>

        <tr v-for="(check, index) in stationChecks" :key="index" class="text-sm border border-gray-200">
          <ItemHover :title="check.displayName" :message="check.description ?? 'No details provided'"/>

          <td class="p-3 w-36">
            <div>{{stateStore.formattedDate()}}</div>
          </td>

          <StatusHover :message="check.message ?? 'No details provided'" :checking-status="check.checkingStatus" :passed-status="check.passedStatus"/>

          <td class="p-3 w-28" v-on:click="updateCurrentlySelected(check.id, <string>key)">
            <CommentModal :mode="check['comment'] !== undefined && check['comment'].length > 0 ? 'icon' : 'icon-empty'"
                          :current-comment="check['comment']"
                          :callback="addComment"/>
          </td>
        </tr>
      </table>
    </div>
  </div>
</template>
