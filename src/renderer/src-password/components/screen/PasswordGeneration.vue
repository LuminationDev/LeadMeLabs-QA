<script setup lang="ts">
import { computed, ref } from "vue";
import GenericButton from "../../../components/buttons/GenericButton.vue";
import * as CONSTANT from "../../../assets/constants";
import { Station } from "../../types/_station";
import { usePasswordStore } from "../../store/passwordStore";
import StationDisplay from "../StationDisplay.vue";

const passwordStore = usePasswordStore();
const searchPhrase = ref("");
const labLocation = ref("");
const numberOfStations = ref("");

const load = async () => {
  passwordStore.resetStatuses();

  if (searchPhrase.value.length === 0) {
    passwordStore.savingErrorMessage = "Search phrase cannot be empty."
    return;
  }

  //@ts-ignore
  api.ipcRenderer.send(CONSTANT.CHANNEL.PASSWORD_CHANNEL, {
    channelType: 'search',
    location: searchPhrase.value
  });

  await new Promise(resolve => setTimeout(resolve, 3000));
}

const generate = () => {
  // Populate the Station list in the passwordStore
  const numberOfStationsValue = parseInt(numberOfStations.value, 10);
  passwordStore.stations = [];

  for (let i = 1; i <= numberOfStationsValue; i++) {
    const station: Station = { index: i, username: `${labLocation.value}_${i}`, password: "" };
    passwordStore.stations.push(station);
  }

  // Start the process with the first station
  processStations(0);
}

const processStations = (index: number) => {
  if (index < passwordStore.stations.length) {
    const station = passwordStore.stations[index];

    //@ts-ignore
    api.ipcRenderer.send(CONSTANT.CHANNEL.PASSWORD_CHANNEL, {
      channelType: 'generate',
      stationIndex: station.index
    });

    setTimeout(() => {
      processStations(index + 1);
    }, 1000);
  }
}

/**
 * Check if all the Stations have passwords generated.
 */
const doAllStationsHavePasswords = computed(() => {
  return passwordStore.stations.every((station) => station.password && station.password.length > 0);
});

const save = async () => {
  passwordStore.resetStatuses();
  passwordStore.savingDetails = true;

  for (const station: Station of passwordStore.stations) {
    //@ts-ignore
    api.ipcRenderer.send(CONSTANT.CHANNEL.PASSWORD_CHANNEL, {
      channelType: 'add',
      entryName: `${labLocation.value} Station ${station.index} Steam`,
      username: station.username,
      password: station.password
    });

    await new Promise(resolve => setTimeout(resolve, 3000));
  }
}

const clear = () => {
  passwordStore.stations = [];
}
</script>

<template>
  <div class="flex flex-col justify-center col-span-4 w-full items-center">
    <div v-if="passwordStore.stations.length === 0" class="flex flex-col w-full">
      <div class="flex flex-row">
        <div class="flex flex-col mr-8">
          <label for="labLocation" class="text-sm font-semibold mb-2">Lab Location</label>
          <input type="text" name="labLocation" v-model="labLocation" placeholder="Thebarton" class="w-80 h-10 mb-4 px-2 py-1 border-[1px] border-gray-400 rounded-lg shadow-sm"/>

          <label for="numberOfStations" class="text-sm font-semibold mb-2">Number of Stations</label>
          <input type="number" name="numberOfStations" v-model="numberOfStations" placeholder="3" class="w-80 h-10 mb-4 px-2 py-1 border-[1px] border-gray-400 rounded-lg shadow-sm"/>
        </div>
      </div>

      <div class="flex flex-row items-center mt-4">
        <GenericButton type="light-blue" :callback="generate" class="mr-4">Generate</GenericButton>
      </div>

      <div class="flex items-center w-full my-6 relative">
        <hr class="flex-grow mr-4">
        <p class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">Or</p>
        <hr class="flex-grow ml-4">
      </div>


      <div class="flex flex-row">
        <div class="flex flex-col mr-8">
          <label for="searchPhrase" class="text-sm font-semibold mb-2">Search Phrase</label>
          <input type="text" name="searchPhrase" v-model="searchPhrase" placeholder="Thebarton" class="w-80 h-10 mb-4 px-2 py-1 border-[1px] border-gray-400 rounded-lg shadow-sm"/>
        </div>
      </div>

      <div class="flex flex-row items-center">
        <GenericButton type="light-blue" :callback="load" class="mr-4">Load</GenericButton>
      </div>
    </div>

    <div v-else class="flex flex-col w-full">
      <div class="flex flex-col h-96 overflow-auto">
        <StationDisplay v-for="station in passwordStore.stations" :station="station" :key="station.index"/>
      </div>

      <div v-if="passwordStore.loaded || passwordStore.saved" class="flex flex-row items-center justify-between mt-4">
        <div class="text-sm text-green-700">{{passwordStore.loaded ? 'Stations loaded!' : 'Stations Saved!'}}</div>
        <GenericButton type="light-blue" :callback="clear" class="mr-4" :disabled="!doAllStationsHavePasswords">Reset</GenericButton>
      </div>

      <div v-else class="flex flex-row items-center justify-between mt-4">
        <GenericButton type="light" :callback="clear" class="mr-4" :disabled="!doAllStationsHavePasswords || passwordStore.getSavingDetails">Clear</GenericButton>
        <GenericButton type="light-blue" :callback="save" class="mr-4" :disabled="!doAllStationsHavePasswords">Save</GenericButton>
      </div>
    </div>

    <div class="flex flex-row justify-center text-sm text-red-400 mt-2" v-if="passwordStore.savingErrorMessage">{{ passwordStore.savingErrorMessage }}</div>
  </div>
</template>
