<script setup lang="ts">
import { useStateStore } from "@renderer/store/stateStore";
import GenericDropdown from "@renderer/components/_generic/dropdowns/GenericDropdown.vue";
import { useFullStore } from "@renderer/store/fullStore";
import { useQuickStore } from "@renderer/store/quickStore";
import { onBeforeMount, watchEffect } from "vue";

const stateStore = useStateStore();
const fullStore = useFullStore();
const quickStore = useQuickStore();

const deviceType = ['NUC', 'Station PC', 'External device'];
const SelectDeviceType = (type: string) => {
  stateStore.deviceType = type;
}

const checks = ['Online', 'Offline'];
const SelectType = (type: string) => {
  stateStore.labType = type;
}

const experienceTiers = ['Tier 0', 'Tier 1', 'Tier 2'];
const SelectExperienceTier = (type: string) => {
  stateStore.experienceTier = type;
}

/**
 * The precedent for if a user can continue to the next segment.
 */
const calcProceed = () => {
  const labTypeIsValid = stateStore.labType !== 'Select';
  const experienceTierIsValid = stateStore.experienceTier !== 'Select';
  const schoolNameIsValid = stateStore.labLocation.length !== 0;
  const numberOfStationsIsValid = fullStore.numberOfStations > 0;
  const stationNumberIsValid = quickStore.correctStationValues['StationId'] > 0 || stateStore.deviceType !== 'Station PC';

  stateStore.canProceed = labTypeIsValid && experienceTierIsValid && schoolNameIsValid && numberOfStationsIsValid && stationNumberIsValid;
}

/**
 * Watch for any changes in the calcProceed to re-evaluate if the user can continue.
 */
watchEffect(() => {
  calcProceed();
});

/**
 * Determine if the necessary values are currently inputted to allow a user to progress with the tool.
 * If not, block the 'Next' button on the BottomBar until they are.
 */
onBeforeMount(() => {
  calcProceed();
});
</script>

<template>
    <div class="w-full h-auto my-4 flex flex-col">
      <p class="text-xl text-black font-semibold mb-3">Welcome to the Learning Lab Setup Tool</p>

      <div class="w-full h-auto mb-4 flex flex-col">
        <hr class="my-4">

        <!--Text describing the process?-->
        <p class="text-base text-black mb-10">Text describing the tool</p>

        <!--Different device setup pages-->
        <div class="flex flex-col mr-32 mb-4">
          <div class="text-lg mb-2">Device type</div>
          <GenericDropdown @update="SelectDeviceType" :title="stateStore.deviceType" :items="deviceType"/>
        </div>

        <!--Setup for config-->
        <div v-if="stateStore.deviceType === 'NUC' || stateStore.deviceType === 'Station PC'">
          <div class="flex flex-col">

            <div class="flex flex-row my-4 justify-between">
              <div v-if="stateStore.deviceType === 'Station PC'" class="flex flex-col">
                <div class="text-lg mb-2">Station Number</div>
                <input v-model="quickStore.correctStationValues['StationId']" type="number" class="w-40 h-8 px-2 py-1 border-gray-700 border-2 rounded"/>
              </div>

              <div class="flex flex-col">
                <div class="text-lg mb-2">No. of Stations</div>
                <input v-model="fullStore.numberOfStations" type="number" class="w-40 h-8 px-2 py-1 border-gray-700 border-2 rounded"/>
              </div>
            </div>


            <div class="flex flex-row mt-4 justify-between">
              <div class="flex flex-col">
                <div class="text-lg mb-2">Lab type</div>
                <GenericDropdown @update="SelectType" :title="stateStore.labType" :items="checks"/>
              </div>

              <div class="flex flex-col">
                <div class="text-lg mb-2">Experience Tier</div>
                <GenericDropdown @update="SelectExperienceTier" :title="stateStore.experienceTier" :items="experienceTiers"/>
              </div>
            </div>

            <div class="mt-8 mb-2 text-lg">School</div>
            <input v-model="stateStore.labLocation" class="w-96 h-8 px-2 py-1 border-gray-700 border-2 rounded"/>
          </div>
        </div>
      </div>
    </div>
</template>
