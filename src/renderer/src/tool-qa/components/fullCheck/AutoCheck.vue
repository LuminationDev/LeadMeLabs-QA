<script setup lang="ts">
import * as CONSTANT from "@renderer/assets/constants";
import { computed, onMounted, ref, watch} from "vue";
import { useFullStore } from "@renderer/tool-qa/store/fullStore";
import { useStateStore } from "@renderer/tool-qa/store/stateStore";
import { useRoute } from "vue-router";
import ItemHover from "@renderer/tool-qa/components/fullCheck/ItemHover.vue";
import StatusHover from "@renderer/tool-qa/components/fullCheck/StatusHover.vue";
import GenericLayout from "@renderer/tool-qa/components/checks/GenericLayout.vue";
import CheckStatus from "@renderer/tool-qa/components/fullCheck/CheckStatus.vue";

const route = useRoute();
const checkType = route.meta['checkType'];
const fullStore = useFullStore();
const stateStore = useStateStore();
const checking = ref("");

/**
 * Populate the device map from the known devices in the fullStore. Iterating over the deviceMap will allow for constant
 * ordering and quick comparison on the table to align the values to correct header.
 */
const deviceMap = ref([
  ...fullStore.stations.map(station => ({
    id: station.id,
    prefix: 'S',
    checks: {}
  })),
  ...fullStore.tablets.map(tablet => ({
    id: tablet.ipAddress,
    prefix: 'T',
    checks: {}
  })),
  {
    id: 'NUC',
    prefix: '',
    checks: {}
  },
  {
    id: 'C-Bus',
    prefix: '',
    checks: {}
  }
]);

/**
 * Update the device map with the latest check for a specific entry, based on the Id which may be Station number,
 * tablet ip address, 'NUC' or 'C-Bus'.
 */
const updateDeviceMap = (idKey, item, check) => {
  const index = deviceMap.value.findIndex(entry => entry.id == idKey);
  if (index !== -1) {
    deviceMap.value[index].checks[check.id] = {
      passedStatus: item.passedStatus,
      checkingStatus: item.checkingStatus,
      message: item.message,
      date: stateStore.formattedDate()
    };
  }
};

/**
 * Transforms and updates data in the deviceMap based on the provided QA groups and checks.
 * This function iterates through specified QA groups and their checks, updating the deviceMap
 * with relevant information from stations, tablets, NUC, and C-Bus devices associated with each check.
 */
const transformData = () => {
  fullStore.qaGroups
      .filter(group => group.id === checkType)
      .forEach(group => {
        group.checks.forEach(check => {
          check.stations.forEach(station => {
            updateDeviceMap(station.id, station, check);
          });

          check.tablets.forEach(tablet => {
            updateDeviceMap(tablet.ipAddress, tablet, check);
          });

          // ASSUMPTION: There is only ever 1 NUC
          if (check.nuc[0] !== undefined) {
            updateDeviceMap('NUC', check.nuc[0], check);
          }

          // ASSUMPTION: There is only ever 1 CBus
          if (check.cbus[0] !== undefined) {
            updateDeviceMap('C-Bus', check.cbus[0], check);
          }
        });
      });
};
watch(() => fullStore.qaGroups, transformData, { deep: true });

/**
 * Consolidate the information to the single page with no memory at te moment/
 */
const filteredChecks = computed(() => {
  const filteredGroups = fullStore.qaGroups.filter(group => group.id === checkType);
  return filteredGroups.flatMap(group => group.checks);
});

/**
 * Watch the qaCheck, iterate over the values when they update looking at the stations/tablets/nuc/cbus values to see
 * if the checkingStatus is still 'checking', when none of them are then it means the qa check is complete or timed out.
 */
const monitorCheck = () => {
  let stillRunning = false;
  let errorFound = false;

  fullStore.qaGroups
    .filter(group => group.id === checkType)
    .forEach(group => {
      group.checks.forEach(check => {
        [ ...check.stations, ...check.tablets, ...check.nuc, ...check.cbus ].forEach(item => {
          if (item.checkingStatus === 'checking') {
            stillRunning = true;
          } else if (item.checkingStatus === 'timeout') {
            errorFound = true;
          }
        });
      });
    });

  //TODO only show the error at the end or as soon as it appears? Ask Matt
  if(!stillRunning && errorFound) {
    checking.value = 'error'
  } else if (!stillRunning) {
    checking.value = 'done'
  } else {
    checking.value = 'testing'
  }
}
watch(() => fullStore.qaGroups, monitorCheck, { deep: true });

/**
 * Start the auto test once the component has been mounted, check that the server and connection is up first.
 */
onMounted(() => {
  if (typeof checkType === "string") {
    fullStore.mostRecentAutoCheck = checkType;
  }
  checking.value = "testing";

  fullStore.startQa(checkType);
  fullStore.sendMessage({
    action: CONSTANT.ACTION.RUN_STATION_GROUP,
    actionData: {
      group: checkType,
      stationIds: ['all']
    }
  });
});
</script>

<template>
  <GenericLayout>
    <template v-slot:title>
      <p class="text-2xl text-black font-semibold">Title</p>
      <p class="text-base text-black mb-6">{{checkType}}</p>
    </template>

    <template v-slot:content>
      <div class="flex flex-col">
        <!--Loading-->
        <CheckStatus :checking="checking"/>

        <table class="w-full border-collapse mt-4">
          <tr class="text-left text-xs bg-gray-100 border border-gray-200">
            <th class="p-3">Name</th>

            <th class="w-16 text-center p-3" v-for="device in deviceMap">
              {{device.prefix}}{{device.id}}
            </th>
          </tr>

          <!--Table will not be built if NUC connection has not been made, fullStore.buildQA is triggered on response-->
          <tr v-for="(check, index) in filteredChecks" :key="index" class="text-sm border border-gray-200">
            <ItemHover :title="check.displayName" :message="check.extendedDescription ?? 'No details provided'"/>

            <template v-for="(device, index) in deviceMap" :key="index">
              <StatusHover v-if="device.checks[check.id] !== undefined"
                  :message="device.checks[check.id]?.message ?? 'No details provided'"
                  :checking-status="device.checks[check.id]?.checkingStatus ?? 'not checked'"
                  :passed-status="device.checks[check.id]?.passedStatus ?? 'unknown'"/>

              <td v-else>
                <!--Required for the empty space-->
              </td>
            </template>
          </tr>
        </table>
      </div>
    </template>
  </GenericLayout>
</template>
