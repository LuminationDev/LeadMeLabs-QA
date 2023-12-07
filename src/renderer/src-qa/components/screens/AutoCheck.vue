<script setup lang="ts">
import { computed, onMounted, ref, watch } from "vue";
import { useFullStore } from "../../store/fullStore";
import { useStateStore } from "../../../store/stateStore";
import { useRoute} from "vue-router";
import { QaCheckResult } from "../../types/_qaCheckResult";
import ItemHover from "@renderer/components/statuses/ItemHover.vue";
import StatusHover from "@renderer/components/statuses/StatusHover.vue";
import GenericLayout from "@renderer/components/layouts/GenericLayout.vue";
import CheckStatus from "@renderer/components/statuses/CheckStatus.vue";

const route = useRoute();
const checkType = computed(() => { return route.meta['checkType'] });
const fullStore = useFullStore();
const stateStore = useStateStore();
const checking = ref("");

/**
 * Update the device map with the latest check for a specific entry, based on the Id which may be Station number,
 * tablet ip address, 'NUC' or 'C-Bus'.
 */
const updateDeviceMap = (idKey, item, check) => {
  const info = {
    passedStatus: item.passedStatus,
    checkingStatus: item.checkingStatus,
    message: item.message,
    date: stateStore.formattedDate(false)
  };

  fullStore.updateReport(<string>route.meta['parent'], <string>checkType.value, info, check.id, idKey);
};

/**
 * Transforms and updates data in the deviceMap based on the provided QA groups and checks.
 * This function iterates through specified QA groups and their checks, updating the deviceMap
 * with relevant information from stations, tablets, NUC, and C-Bus devices associated with each check.
 */
const transformData = () => {
  fullStore.qaGroups
      .filter(group => group.id === checkType.value)
      .forEach(group => {
        group.checks.forEach(check => {
          updateDeviceMaps(check);
        });
      });
};

const updateDeviceMaps = (check: QaCheckResult) => {
  check.stations.forEach(station => {
    updateDeviceMap(station.id, station, check);
  });

  check.tablets.forEach(tablet => {
    const foundTablet = fullStore.deviceMap.find(device => device.ipAddress == tablet.ipAddress);
    updateDeviceMap(foundTablet.id, tablet, check);
  });

  if (check.nuc.length > 0) {
    updateDeviceMap('NUC', check.nuc[0], check);
  }

  if (check.cbus.length > 0) {
    updateDeviceMap('C-Bus', check.cbus[0], check);
  }
};
watch(() => fullStore.qaGroups, transformData, { deep: true });

/**
 * Consolidate the information to the single page with no memory at te moment/
 */
const filteredChecks = computed(() => {
  const filteredGroups = fullStore.qaGroups.filter(group => group.id === checkType.value);
  return filteredGroups.flatMap(group => group.checks);
});

/**
 * Collect the 'parent' page which is the section the auto check belongs in. Use this as a title.
 */
const getTitle = computed(() => {
  return stateStore.generateTitle(<string>route.meta['parent']);
});

/**
 * Watch the qaCheck, iterate over the values when they update looking at the stations/tablets/nuc/cbus values to see
 * if the checkingStatus is still 'checking', when none of them are then it means the qa check is complete or timed out.
 */
const monitorCheck = () => {
  let stillRunning = false;
  let errorFound = false;

  fullStore.qaGroups
    .filter(group => group.id === checkType.value)
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
 * Retry the most recently attempted auto check.
 */
const retryAutoCheck = () => {
  if(fullStore.mostRecentAutoCheck.length === 0) return;

  fullStore.startQa(fullStore.mostRecentAutoCheck);
}

/**
 * On mount or route name change run the auto checks related to the current page. The route name change is necessary
 * as when two AutoCheck pages are back to page the onMounted is not triggered.
 */
const autoRun = () => {
  fullStore.readReportData(<string>route.meta['parent'], <string>checkType.value);
  if (typeof checkType.value === "string") {
    fullStore.mostRecentAutoCheck = checkType.value;
  }
  if (fullStore.groupsThatHaveRun.includes(checkType.value)) {
    checking.value = "done";
    return
  }

  //TODO check if the tests have already been run before auto starting it again?
  checking.value = "testing";
  fullStore.startQa(checkType.value);
}

/**
 * Start the auto test once the component has been mounted, check that the server and connection is up first.
 */
onMounted(() => {
  autoRun();
});

/**
 * If the route name has changed but the component has not there is another auto check to run. All auto checks
 * end with _checks. Otherwise, the watch is disregarded.
 */
watch(() => route.name, () => {
  if (route.name?.toString().endsWith("_checks")) {
    autoRun();
  }
});
</script>

<template>
  <GenericLayout>
    <template v-slot:title>
      <p class="text-2xl text-black font-semibold mb-2">{{getTitle}}</p>
      <!--TODO work out how to get a description-->
      <p class="text-base text-black mb-4">{{checkType}}</p>
    </template>

    <template v-slot:content>
      <div class="flex flex-col">
        <!--Loading-->
        <CheckStatus :callback="retryAutoCheck" :checking="checking"/>

        <table class="w-full border-collapse mt-4">
          <tr class="text-left text-xs bg-gray-100 border border-gray-200">
            <th class="p-3">Name</th>

            <th class="w-16 text-center p-3" v-for="device in fullStore.deviceMap">
              <ItemHover v-if="device.type === 'tablet'" :title="`${device.prefix}${device.id}`" :message="device.ipAddress" :padding="false"/>
              <span v-else>{{device.prefix}}{{device.id}}</span>
            </th>
          </tr>

          <!--Table will not be built if NUC connection has not been made, fullStore.buildQA is triggered on response-->
          <tr v-for="(check, index) in filteredChecks" :key="index" class="text-sm border border-gray-200">
            <ItemHover :title="check.displayName" :message="check.extendedDescription ?? 'No details provided'"/>

            <template v-for="(device, _index) in fullStore.deviceMap" :key="_index">
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
