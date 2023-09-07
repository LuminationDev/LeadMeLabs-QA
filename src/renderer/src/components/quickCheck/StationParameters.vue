<script setup lang="ts">
import GenericDropdown from "@renderer/components/_generic/dropdowns/GenericDropdown.vue";
import { onBeforeMount, watchEffect } from "vue";
import { useQuickStore } from "@renderer/store/quickStore";
import { useStateStore } from "@renderer/store/stateStore";

const stateStore = useStateStore();
const quickStore = useQuickStore();

const checks = ['Select', 'Online', 'Offline'];
const SelectType = (type: string) => {
  quickStore.labType = type;
}

const experienceTiers = ['Select', 'Tier 0', 'Tier 1', 'Tier 2'];
const SelectExperienceTier = (type: string) => {
  quickStore.experienceTier = type;
}

/**
 * The precedent for if a user can continue to the next segment.
 */
const calcProceed = () => {
  stateStore.canProceed = !(quickStore.labType === 'Select' || quickStore.experienceTier === 'Select');
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
    <div class="mb-4 text-lg">Lab type</div>
    <GenericDropdown @update="SelectType" :title="quickStore.labType" :items="checks"/>

    <div class="my-4 text-lg">Experience Tier</div>
    <GenericDropdown @update="SelectExperienceTier" :title="quickStore.experienceTier" :items="experienceTiers"/>
  </div>
</template>
