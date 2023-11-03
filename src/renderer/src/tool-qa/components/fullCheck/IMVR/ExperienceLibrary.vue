<script setup lang="ts">
import { useFullStore } from "@renderer/tool-qa/store/fullStore";
import { computed, ref } from "vue";
import { useStateStore } from "@renderer/tool-qa/store/stateStore";
import StatusHover from "@renderer/tool-qa/components/_generic/statuses/StatusHover.vue";
import ItemHover from "@renderer/tool-qa/components/_generic/statuses/ItemHover.vue";
import RetrySvg from "@renderer/assets/icons/RetrySvg.vue";
import * as CONSTANT from "../../../../assets/constants";

const stateStore = useStateStore();
const fullStore = useFullStore();
const inProgress = ref(false);

const infoDetails = computed(() => {
  if (uncollectedExperiences.value) {
    return {
      theme: 'error',
      title: 'Error',
      description: 'A station does not have any experiences.'
    }
  }
  if (inProgress.value) {
    return {
      theme: 'testing',
      title: 'Testing...',
      description: 'Checking for installed experiences.'
    }
  }
  if (!inProgress.value) {
    return {
      theme: 'success',
      title: 'Done',
      description: 'Experiences have been checked.'
    }
  }
  return {
    theme: 'error',
    title: 'Error',
    description: 'An unexpected error has occurred.'
  }
});

const uncollectedExperiences = computed(() => {
  return fullStore.stations.some(entry => {
    return entry.details && entry.details.installedApplications && entry.details.installedApplications.length === 0;
  });
});

const getCountByKeyword = (deviceId, keyword) => {
  return fullStore.experienceErrors.reduce((count, entry) => {
    const foundStation = entry.stations.find(station => station.id == deviceId && station.message.includes(keyword));
    if (foundStation) {
      return count + 1;
    }
    return count;
  }, 0);
};

const unexpectedTotal = (deviceId) => {
  const count = getCountByKeyword(deviceId, 'expected');

  //Add the message as a comment, hardcoded to position 0
  const section = fullStore.reportTracker["imvr"] ||= {};
  const category = section["pre_experience_checks"] ||= {};
  category['comments'] ||= [];
  category['comments'][0] = ({ date: stateStore.formattedDate(true), content: `Not expected experiences: ${count}`});

  return count;
};

const notInstalledTotal = (deviceId) => {
  const count = getCountByKeyword(deviceId, 'installed');

  //Add the message as a comment, hardcoded to position 1
  const section = fullStore.reportTracker["imvr"] ||= {};
  const category = section["pre_experience_checks"] ||= {};
  category['comments'] ||= [];
  category['comments'][1] = ({ date: stateStore.formattedDate(true), content: `Not installed experiences: ${count}`});

  return count
};

const recollectExperiences = () => {
  inProgress.value = true;

  //Collect all the installed experiences
  fullStore.sendMessage({
    action: CONSTANT.ACTION.GET_EXPERIENCES,
    actionData: {
      stationIds: ['all']
    }
  });

  setTimeout(() => inProgress.value = false, 1000);
}

const isStationPresent = (deviceId, stations: any[]) => {
  return stations.find(station => deviceId == station.id);
}
</script>

<template>
  <div
      class="flex flex-row justify-between w-full h-20 border-collapse rounded-lg border-[1px] items-center"
      :class="{
        'bg-red-50 border-red-400': infoDetails.theme === 'error',
        'bg-green-50 border-green-500': infoDetails.theme === 'success',
        'bg-blue-50 border-blue-500': infoDetails.theme === 'testing',
      }"
  >
    <div class="flex flex-row"
       :class="{
        'text-red-600': infoDetails.theme === 'error',
        'text-green-700': infoDetails.theme === 'success',
        'text-blue-600': infoDetails.theme === 'testing',
      }">
      <div class="flex flex-col p-2">
        <img v-if="infoDetails.theme === 'error'" src="../../../../assets/icons/checking-error.svg" :alt="`error icon`" />
        <img v-else-if="infoDetails.theme === 'success'" src="../../../../assets/icons/checking-done.svg" :alt="`success icon`" />
        <img v-else-if="infoDetails.theme === 'testing'" src="../../../../assets/icons/checking-testing.svg" :alt="`testing icon`" />
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

    <div v-if="!inProgress" @click="recollectExperiences"
         class="flex flex-row mr-4 cursor-pointer items-center hover:opacity-60">
      <RetrySvg :fill="infoDetails.theme === 'error' ? '#B42318' : '#067647'" class="w-5 mr-1.5"/>
      <div class="font-semibold" :class="{
        'text-[#B42318]': infoDetails.theme === 'error',
        'text-[#067647]': infoDetails.theme === 'success'
      }">
        Recollect Experiences
      </div>
    </div>
  </div>

  <!--Tables will not be built if NUC connection has not been made-->
  <table class="w-full border-collapse mt-4">
    <tr class="text-left text-xs bg-gray-100 border border-gray-200">
      <th class="p-3">Device</th>
      <th class="w-28 pl-3">Not expected</th>
      <th class="w-28 pl-3">Not installed</th>
    </tr>

    <tr v-for="(device, _index) in fullStore.deviceMap" :key="_index" class="text-sm border border-gray-200">
      <template v-if="device.type === 'station'">
        <th class="text-left grow p-3">
          S{{device.id}}
        </th>

        <th class="p-3 font-medium text-center">
          {{unexpectedTotal(device.id)}}
        </th>

        <th class="p-3 font-medium text-center">
          {{notInstalledTotal(device.id)}}
        </th>
      </template>
    </tr>
  </table>

  <table class="w-full border-collapse mt-4">
    <tr class="text-left text-xs bg-gray-100 border border-gray-200">
      <th class="p-3">Name</th>

      <template v-for="device in fullStore.deviceMap">
        <th class="w-16 text-center p-3" v-if="device.type === 'station'">
          S{{device.id}}
        </th>
      </template>
      <th class="pl-3">Status</th>
    </tr>

    <!--Table will not be built if NUC connection has not been made-->
    <tr v-for="(experience, index) in fullStore.experienceErrors" :key="index" class="text-sm border border-gray-200">
      <ItemHover :title="experience.title" :message="'No details provided'"/>

      <template v-for="(device, _index) in fullStore.deviceMap" :key="_index">
        <StatusHover v-if="isStationPresent(device.id, experience.stations) !== undefined && device.type === 'station'"
                     :message="isStationPresent(device.id, experience.stations).message ?? 'No details provided'"
                     :checking-status="isStationPresent(device.id, experience.stations).checkingStatus ?? 'not checked'"
                     :passed-status="isStationPresent(device.id, experience.stations).status ?? 'unknown'"/>

        <StatusHover v-else-if="device.type === 'station'"
                     :message="'N/A'"
                     :checking-status="'checked'"
                     :passed-status="'pending'"/>
      </template>




      <th class="pl-3 font-medium text-left">
        {{experience.stations[0].message}}
      </th>
    </tr>
  </table>
</template>
