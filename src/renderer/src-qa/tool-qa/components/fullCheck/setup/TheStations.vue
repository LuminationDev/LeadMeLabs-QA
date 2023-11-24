<script setup lang="ts">
import ItemHover from "../../_generic/statuses/ItemHover.vue";
import StatusHover from "../../_generic/statuses/StatusHover.vue";
import { useFullStore } from "../../../store/fullStore";
import { computed, ref } from "vue";
import { QaCheck } from "@renderer/tool-qa/interfaces";
import * as CONSTANT from "../../../../../constants";
import CheckStatus from "@renderer/tool-qa/components/_generic/statuses/CheckStatus.vue";

const fullStore = useFullStore();
const checking = ref("done");

const checks = computed(() => {
  let checks = {}
  fullStore.stations.forEach(station => {
    station.getComputedChecks().forEach((check) => {
      if (!checks[check.id]) {
        //Add the check to the report
        fullStore.addCheckToReportTracker("connection", "station_details",
            { key: check.id, description: check.displayName },
            { station: true, tablet: false, nuc: false, cbus: false });

        checks[check.id] = {
          displayName: check.displayName,
          stations: []
        }
      }

      //Update the report
      fullStore.updateReport("connection", "station_details",
          { passedStatus: check.passedStatus, message: check.message }, check.id, station.id);

      checks[check.id].stations.push(check)
    })
  });

  return checks
});

const retryStationConnection = () => {
  checking.value = "testing";
  fullStore.stations.forEach(station => {
    fullStore.sendStationMessage(station.id, {
      action: CONSTANT.ACTION.CONNECT_STATION,
      actionData: {
        expectedStationId: station.id
      }
    })
  });
  setTimeout(() => { checking.value = "done" }, 1000);
}
</script>

<template>
  <div class="flex flex-col">
    <!--Loading-->
    <CheckStatus :callback="retryStationConnection" :checking="checking"/>

    <table class="w-full border-collapse mt-4">
      <tr class="text-left text-xs bg-gray-100 border border-gray-200">
        <th class="p-3">Name</th>

        <th class="w-16 text-center p-3" v-for="station in fullStore.stations">
          S{{station.id}}
        </th>
      </tr>

      <tr v-for="(check, id) in checks" :key="id" class="text-sm border border-gray-200">
        <ItemHover :title="check['displayName']" :message="check['extendedDescription'] ?? 'No details provided'"/>

        <template v-for="(station, _index) in check['stations'] as QaCheck[]" :key="_index">
          <StatusHover :message="station.message ?? 'No details provided'"
                       :checking-status="'not checked'"
                       :passed-status="station.passedStatus ?? 'unknown'"/>
        </template>
      </tr>
    </table>
  </div>
</template>