<script setup lang="ts">
import ItemHover from "../../components/statuses/ItemHover.vue";
import StatusHover from "../../components/statuses/StatusHover.vue";
import { ref, watch} from "vue";
import { QaCheck } from "../../interfaces";
import * as CONSTANT from "../../assets/constants";
import CheckStatus from "../../components/statuses/CheckStatus.vue";
import { useStateStore } from "../../store/stateStore";

const tempStore = useStateStore().getStore;
const checking = ref("done");
const checks = ref({});

watch(() => tempStore.stations, (newStations) => {
    newStations.forEach(station => {
      station.getComputedChecks().forEach((check) => {
        if (!checks.value[check.id]) {
          //Add the check to the report
          tempStore.addCheckToReportTracker("connection", "station_details",
              { key: check.id, description: check.displayName },
              { station: true, tablet: false, nuc: false, cbus: false });

          checks.value[check.id] = {
            displayName: check.displayName,
            stations: []
          }
        }

        //Update the report
        tempStore.updateReport("connection", "station_details",
            { passedStatus: check.passedStatus, message: check.message }, check.id, station.id);

        checks.value[check.id].stations.push(check)
      })
    });
  },
  { immediate: true } // Run the watcher at least once immediately
);

const retryStationConnection = () => {
  checking.value = "testing";
  tempStore.stations.forEach(station => {
    tempStore.sendStationMessage(station.id, {
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

        <th class="w-16 text-center p-3" v-for="station in tempStore.stations">
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
