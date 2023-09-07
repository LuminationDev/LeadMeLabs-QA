<script setup lang="ts">
import GenericDropdown from "@renderer/components/_generic/dropdowns/GenericDropdown.vue";
import { onBeforeMount, watchEffect } from "vue";
import { useStateStore } from "@renderer/store/stateStore";
import { useFullStore } from "@renderer/store/fullStore";

const stateStore = useStateStore();
const fullStore = useFullStore();

const checks = ['Select', 'Online', 'Offline'];
const SelectType = (type: string) => {
  fullStore.labType = type;
}

const experienceTiers = ['Select', 'Tier 0', 'Tier 1', 'Tier 2'];
const SelectExperienceTier = (type: string) => {
  fullStore.experienceTier = type;
}

/**
 * The precedent for if a user can continue to the next segment.
 */
const calcProceed = () => {
  const labTypeIsValid = fullStore.labType !== 'Select';
  const experienceTierIsValid = fullStore.experienceTier !== 'Select';
  const schoolNameIsValid = fullStore.schoolName.length !== 0;
  const numberOfStationsIsValid = fullStore.numberOfStations > 0;

  stateStore.canProceed = labTypeIsValid && experienceTierIsValid && schoolNameIsValid && numberOfStationsIsValid;
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
  <div class="flex flex-col">
    <div class="flex flex-row mb-4">
      <div class="flex flex-col mr-32">
        <div class="text-lg">Lab type</div>
        <GenericDropdown @update="SelectType" :title="fullStore.labType" :items="checks"/>
      </div>

      <div class="flex flex-col">
        <div class="text-lg">No. of Stations</div>
        <input v-model="fullStore.numberOfStations" type="number" class="w-32 h-8 px-2 py-1 border-gray-700 border-2 rounded"/>
      </div>
    </div>

    <div class="mt-8 mb-4 text-lg">Experience Tier</div>
    <GenericDropdown @update="SelectExperienceTier" :title="fullStore.experienceTier" :items="experienceTiers"/>

    <div class="mt-8 mb-4 text-lg">School</div>
    <input v-model="fullStore.schoolName" class="w-96 h-8 px-2 py-1 border-gray-700 border-2 rounded"/>
  </div>
</template>