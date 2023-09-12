<script setup lang="ts">
import ApplianceRequest from "@renderer/components/fullCheck/Appliances/ApplianceRequest.vue";
import InformationTitle from "@renderer/components/checks/InformationTitle.vue";
import ApplianceTitle from "@renderer/components/fullCheck/Appliances/ApplianceTitle.vue";
import { computed, onBeforeMount, watchEffect } from "vue";
import { Appliance } from "@renderer/interfaces";
import { useFullStore } from "@renderer/store/fullStore";
import { useStateStore } from "@renderer/store/stateStore";

const stateStore = useStateStore();
const fullStore = useFullStore();

const groupedData = computed(() => {
  const data = fullStore.ApplianceList;

  if (data.length === 0) {
    return {};
  }

  const groupedData = data.reduce((acc, item: Appliance) => {
    const itemType: string = item.type;
    acc[itemType] = acc[itemType] || [];
    acc[itemType].push(item);
    return acc;
  }, {});

  for (const itemType in groupedData) {
    if (groupedData.hasOwnProperty(itemType)) {
      groupedData[itemType].sort((a, b) => a.name.localeCompare(b.name));
    }
  }

  return groupedData;
});

const currentlyAnswered = computed(() => {
  return fullStore.ApplianceList.filter(item => item.correct === true || item.correct === false).length;
});

/**
 * The precedent for if a user can continue to the next segment.
 */
const calcProceed = () => {
  stateStore.canProceed = (currentlyAnswered.value === fullStore.ApplianceList.length && fullStore.ApplianceList.length !== 0);
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
  <ApplianceRequest />

  <InformationTitle
      class="mb-4"
      title="Appliances"
      :current-keys="currentlyAnswered"
      :total-keys="fullStore.ApplianceList.length"/>

  <!--Display the NUC response below-->
  <div class="flex flex-col" v-for="(appliances, type) in groupedData" :key="type">
    <span class="w-56 font-semibold mb-2 text-lg">{{ stateStore.capitalizeFirstLetter(typeof type === "string" ? type : "Unknown") }}</span>

    <ul>
      <li v-for="(appliance) in appliances" :key="appliance['id']">
        <div class="flex flex-col mb-4">
          <ApplianceTitle :title="appliance['name']" :id="appliance['id']"/>

          <span v-for="(value, key) in appliance" :key="key" class="ml-2">
            <span v-if="value !== null && value !== '' && key !== 'correct'" class="flex flex-row">
              <span class="w-40">{{ stateStore.capitalizeFirstLetter(key) }}:</span>
              <span>{{ value ?? "Not found" }}</span>
            </span>
          </span>
        </div>
      </li>
    </ul>

    <hr class="my-2" />
  </div>
</template>
