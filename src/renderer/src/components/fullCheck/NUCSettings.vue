<script setup lang="ts">
import * as CONSTANT from "@renderer/assets/constants";
import StationView from "@renderer/components/fullCheck/StationView.vue";
import { computed, ref } from "vue";
import { storeToRefs } from "pinia";
import { useFullStore } from "@renderer/store/fullStore";

const fullStore = useFullStore();
const { NucStationList } = storeToRefs(fullStore);
const { StationList } = storeToRefs(fullStore);

const sameLocation = computed(() => {
  if (fullStore.StationList.length > 0) {
    return fullStore.StationList.every((station) => station.room === fullStore.StationList[0].room);
  } else {
    return true;
  }
});

const uniqueID = computed(() => {
  const encounteredIds: Set<number> = new Set();

  for (const station of fullStore.StationList) {
    if (encounteredIds.has(station.id)) {
      // This ID has been encountered before, not unique
      return false;
    }
    encounteredIds.add(station.id);
  }

  // All IDs are unique
  return true;
})

const sameNucAddress = computed(() => {
  if (fullStore.StationList.length > 0) {
    return fullStore.StationList.every((station) => station.nucIpAddress === fullStore.nucAddress);
  } else {
    return true;
  }
});

const address = ref(fullStore.nucAddress);

/**
 * Request the NUC to send over the station_list.json
 */
const requestStationsFromNuc = () => {
  //Save the IP address as the NUC address
  fullStore.nucAddress = address.value;

  //@ts-ignore
  api.ipcRenderer.send(CONSTANT.CHANNEL.HELPER_CHANNEL, {
    channelType: CONSTANT.CHANNEL.TCP_CLIENT_CHANNEL,
    key: stateStore.key,
    address: address.value,
    port: 55556,
    data: CONSTANT.MESSAGE.REQUEST_STATION_LIST + stateStore.getServerDetails
  });
}

/**
 * Cycle through the list of Stations that the NUC has provided and ask each one for their details.
 */
const requestFromStations = () => {
  fullStore.NucStationList.forEach(station => {
    //@ts-ignore
    api.ipcRenderer.send(CONSTANT.CHANNEL.HELPER_CHANNEL, {
      channelType: CONSTANT.CHANNEL.TCP_CLIENT_CHANNEL,
      key: stateStore.key,
      address: station.ipAddress,
      port: 55557,
      data: CONSTANT.MESSAGE.REQUEST_STATION_DETAILS + stateStore.getServerDetails
    });
  })
}
</script>

<template>
  <input v-model="address" class="bg-gray-100 w-56 h-8 mb-4 px-4 rounded" placeholder="NUC IP address"/>
  <div class="flex flex-row justify-between">
    <div v-on:click="requestStationsFromNuc"
         class="w-32 h-8 mb-5 flex items-center justify-center rounded-lg"
         :class="{
                    'bg-blue-500 text-white cursor-pointer hover:bg-blue-400': address.length > 0,
                    'bg-gray-300 text-white': address.length === 0,
                 }">
      Check
    </div>
    <div v-on:click="requestFromStations"
         class="w-32 h-8 mb-5 flex items-center justify-center rounded-lg"
         :class="{
                    'bg-blue-500 text-white cursor-pointer hover:bg-blue-400': NucStationList.length > 0,
                    'bg-gray-300 text-white': NucStationList.length === 0,
                 }">
      Collect
    </div>
  </div>

  <hr class="my-3"/>

  <div class="flex flex-col">
    <span class="font-bold">Basic Checks</span>

    <!--Lab location is all the same-->
    <div class="flex flex-row" :class="{'text-red-500': !sameLocation}">
      Lab location is the same:
      <span v-if="StationList.length > 1" class="ml-2">{{sameLocation ? "Yes" : "No"}}</span>
      <span v-else-if="StationList.length === 1" class="ml-2">Only 1 Station</span>
    </div>

    <!--No Stations have the same ID-->
    <div class="flex flex-row" :class="{'text-red-500': !uniqueID}">
      All Stations have unique a ID:
      <span v-if="StationList.length > 1" class="ml-2">{{uniqueID ? "Yes" : "No"}}</span>
      <span v-else-if="StationList.length === 1" class="ml-2">Only 1 Station</span>
    </div>

    <!--NUC address is correct across all Stations-->
    <div class="flex flex-row" :class="{'text-red-500': !sameNucAddress}">
      NUC address is correct across all Stations:
      <span v-if="StationList.length > 0" class="ml-2">{{sameNucAddress ? "Yes" : "No"}}</span>
    </div>
  </div>

  <hr class="my-3"/>

  <div class="flex flex-row justify-between">
    <div class="flex flex-col">
      <div class="font-bold mb-4">Saved NUC details ({{NucStationList.length}})</div>
      <div v-for="(station, index) in NucStationList" :key="index">
        <StationView :station="station" :nuc-address="fullStore.nucAddress"/>
        <hr/>
      </div>
    </div>

    <div class="flex flex-col">
      <div class="font-bold mb-4">Collected Station details ({{StationList.length}})</div>
      <div v-for="(station, index) in StationList" :key="index">
        <StationView :station="station"/>
        <hr/>
      </div>
    </div>
  </div>
</template>
