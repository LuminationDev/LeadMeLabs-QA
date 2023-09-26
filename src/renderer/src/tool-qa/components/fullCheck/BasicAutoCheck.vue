<script setup lang="ts">
import * as CONSTANT from "@renderer/assets/constants";
import {computed, onMounted} from "vue";
import { useFullStore } from "@renderer/tool-qa/store/fullStore";
import { useStateStore } from "@renderer/tool-qa/store/stateStore";
import ItemHover from "@renderer/tool-qa/components/fullCheck/Report/ItemHover.vue";
import StatusHover from "@renderer/tool-qa/components/fullCheck/StatusHover.vue";
import CommentModal from "@renderer/tool-qa/modals/CommentModal.vue";

const fullStore = useFullStore();
const stateStore = useStateStore();

const props = defineProps({
  checkType: {
    type: String,
    required: true
  }
});

/**
 * Change the data format and save the data within the fullStore.reportTracker
 */
const transformData = computed(() => {
  fullStore.qaGroups
      .filter(group => group.id === props.checkType)
      .forEach(group => {
        group.checks.forEach(check => {
          check.stations.forEach(station => {
            const stationId = station.id;
            const dataToUpdate = {
              id: check.id,
              displayName: check.displayName,
              description: check.extendedDescription,
              passedStatus: station.passedStatus,
              checkingStatus: station.checkingStatus,
              message: station.message,
              date: stateStore.formattedDate()
            };

            //Add to the reportTracker (create fields if required)
            fullStore.reportTracker[props.checkType] = fullStore.reportTracker[props.checkType] || {};
            fullStore.reportTracker[props.checkType][stationId] = fullStore.reportTracker[props.checkType][stationId] || [];

            //Avoid double ups (mostly while dev working with hot-reload)
            const indexToUpdate = fullStore.reportTracker[props.checkType][stationId].findIndex(entry => entry.id === dataToUpdate.id);
            if (indexToUpdate !== -1) {
              fullStore.reportTracker[props.checkType][stationId][indexToUpdate] = dataToUpdate;
            } else {
              fullStore.reportTracker[props.checkType][stationId].push(dataToUpdate);
            }
      });
    });
  });

  return fullStore.reportTracker[props.checkType];
});

/**
 * Start the auto test once the component has been mounted, check that the server and connection is up first.
 */
onMounted(() => {
  fullStore.startQa(props.checkType);
  api.ipcRenderer.send(CONSTANT.CHANNEL.HELPER_CHANNEL, {
    channelType: CONSTANT.CHANNEL.TCP_CLIENT_CHANNEL,
    key: stateStore.key,
    address: fullStore.nucAddress,
    port: 55556,
    data: CONSTANT.MESSAGE.RUN_GROUP + stateStore.getServerDetails + ":" + props.checkType
  });
});
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

          <td>
            <img class="cursor-pointer" src="../../../assets/icons/comment-empty.svg" alt="comment"/>
          </td>
        </tr>
      </table>
    </div>
  </div>
</template>
