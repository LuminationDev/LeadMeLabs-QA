<script setup lang="ts">
import GenericButton from "../../components/buttons/GenericButton.vue";
import ItemHover from "../../components/statuses/ItemHover.vue";
import StatusHover from "../../components/statuses/StatusHover.vue";
import { computed, ref, watch } from "vue";
import { storeToRefs } from "pinia";
import { useStateStore } from "../../store/stateStore";

const stateStore = useStateStore();
const tempStore = stateStore.getStore;
const inProgress = ref(false);
const { experienceChecksCompleted, allowRunningExperienceChecks } = storeToRefs(tempStore);

const infoDetails = computed(() => {
  if (inProgress.value && !experienceChecksCompleted.value) {
    return {
      theme: 'testing',
      title: 'Testing...',
      description: 'Running automated tests.'
    }
  }
  if (experienceChecksCompleted.value) {
    return {
      theme: 'success',
      title: 'Done',
      description: 'Automated tests have been completed.'
    }
  }
  if (!allHeadsetsConnected.value) {
    return {
      theme: 'error',
      title: 'Headsets Not Connected',
      description: 'Headsets are required to complete these tests.'
    }
  }
  return {
    theme: 'ready',
    title: 'Ready',
    description: 'This automated test takes approximately 15 minutes.'
  }
})

const startTesting = () => {
  tempStore.startExperienceChecks()
  inProgress.value = true
}

const retryExperience = (experienceIndex) => {
  tempStore.launchExperienceOnAll(experienceIndex)
}

const cancelTesting = () => {
  allowRunningExperienceChecks.value = false
  inProgress.value = false
}

const hasStartedExperienceChecks = computed(() => {
  return tempStore.experienceChecks.filter(element => {
    return element.stations.filter(station => station.status !== null).length > 1
  }).length > 1
});

const allHeadsetsConnected = computed(() => {
  let allConnected = true;

  //Run through each station and check that the VR stations are connected
  tempStore.stations.forEach(station => {
    if (station.vrStatuses === null || station.details === null) return;

    if (station.details.stationMode === 'vr' && station.vrStatuses?.openVrStatus !== 'Connected') {
      allConnected = false;
    }
  })

  return allConnected
});

const getTotalInstalled = (deviceId: string) => {
  const count = tempStore.experienceChecks.reduce((count, entry) => {
    const foundStation = entry.stations.find(station => station.id == deviceId && (station.message === null || !station.message.includes("Not")));
    if (foundStation) {
      return count + 1;
    }
    return count;
  }, 0);

  //Add the message as a comment, hardcoded to position 0
  const section = tempStore.reportTracker["imvr"] ||= {};
  const category = section["experience_checks"] ||= {};
  category['comments'] ||= [];
  category['comments'][0] = ({ date: stateStore.formattedDate(true), content: `Total installed experiences: ${count}`});

  return count;
};

watch(experienceChecksCompleted, () => {
  if (experienceChecksCompleted.value) {
    inProgress.value = false
  }
});
</script>

<template>
  <div
      class="flex flex-row justify-between w-full h-20 border-collapse rounded-lg border-[1px] items-center"
      :class="{
          'bg-red-50 border-red-400': infoDetails.theme === 'error',
          'bg-green-50 border-green-500': infoDetails.theme === 'success',
          'bg-blue-50 border-blue-500': infoDetails.theme === 'testing',
          'bg-gray-50 border-green-500': infoDetails.theme === 'ready',
        }"
  >
    <div class="flex flex-row">
      <div class="flex flex-col p-2">
        <img v-if="infoDetails.theme === 'error'" src="../../assets/icons/checking-error.svg" :alt="`error icon`" />
        <img v-else-if="infoDetails.theme === 'success'" src="../../assets/icons/checking-done.svg" :alt="`success icon`" />
        <img v-else-if="infoDetails.theme === 'ready'" src="../../assets/icons/checking-done.svg" :alt="`success icon`" />
        <img v-else-if="infoDetails.theme === 'testing'" src="../../assets/icons/checking-testing.svg" :alt="`testing icon`" />
      </div>

      <div class="flex flex-col p-2 justify-center">
        <div class="font-semibold">
          {{ infoDetails.title }}
        </div>

        <div>
          {{ infoDetails.description }}
        </div>
      </div>
    </div>

    <GenericButton v-if="inProgress" type="transparent" class="mr-8" :callback="cancelTesting">
      Cancel
    </GenericButton>
    <GenericButton v-else type="blue" class="px-4 mr-8" :disabled="!allHeadsetsConnected" :callback="startTesting">
      <img v-if="allHeadsetsConnected" src="../../assets/icons/start-test.svg" :alt="`start icon`" class="mr-2" />
      <img v-else src="../../assets/icons/start-test-gray.svg" :alt="`start icon`" class="mr-2" />
      {{ hasStartedExperienceChecks ? 'Resume' : 'Start test' }}
    </GenericButton>
  </div>

  <div v-if="tempStore.experienceChecks && tempStore.experienceChecks.length" class="flex flex-col">
    <table class="w-full border-collapse mt-4">
      <tr class="text-left text-xs bg-gray-100 border border-gray-200">
        <th class="p-3">Device</th>
        <ItemHover class="w-36 pl-3" title="Total installed" message="This does not include not expected items." />
      </tr>

      <tr v-for="(device, _index) in tempStore.deviceMap" :key="_index" class="text-sm border border-gray-200">
        <template v-if="device.type === 'station' && tempStore.isStationVrCompatible(device.id)">
          <th class="text-left grow p-3">
            S{{device.id}}
          </th>

          <th class="p-3 font-medium text-center">
            {{getTotalInstalled(device.id)}}
          </th>
        </template>
      </tr>
    </table>


    <table class="w-full border-collapse mt-4">
      <tr class="text-left text-xs bg-gray-100 border border-gray-200">
        <th class="p-3">Name</th>

        <th class="w-16 text-center p-3" v-for="device in tempStore.experienceChecks[0].stations">
          S{{device.id}}
        </th>
        <th/>
      </tr>

      <!--Table will not be built if NUC connection has not been made, fullStore.buildQA is triggered on response-->
      <tr v-for="(check, index) in tempStore.experienceChecks" :key="index" class="text-sm border border-gray-200">
        <ItemHover :title="check.title" :message="'No details provided'"/>
        <template v-for="(station, _index) in check.stations" :key="_index">
          <StatusHover
              :message="station.message ?? 'No details provided'"
              :checking-status="station.checkingStatus ?? 'not checked'"
              :passed-status="station.status ?? 'unknown'"/>
        </template>
        <th v-if="check.stations.filter(station => station.status === 'failed').length > 0">
          <button
              @click="() => { retryExperience(index) }"
              :disabled="inProgress"
              class="cursor-pointer disabled:cursor-not-allowed">
            Retry
          </button>
        </th>
        <th v-else/>
      </tr>
    </table>
  </div>
</template>
