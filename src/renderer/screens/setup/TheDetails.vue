<script setup lang="ts">
import GenericLayout from "../../components/layouts/GenericLayout.vue";
import CategoryTab from "../../components/statuses/CategoryTab.vue";
import GenericButton from "../../components/buttons/GenericButton.vue";
import StatusIcon from "../../components/statuses/StatusIcon.vue";
import ChecklistSvg from "../../assets/icons/vue/ChecklistSvg.vue";
import GenericDropdown from "../../components/dropdowns/GenericDropdown.vue";
import * as CONSTANT from "../../assets/constants";
import { useRoute } from "vue-router";
import {computed, onBeforeMount, ref, watchEffect} from "vue";
import { useStateStore } from "../../store/stateStore";

const stateStore = useStateStore();
const tempStore = stateStore.getStore;
const route = useRoute();
const labLocation = ref(tempStore.reportTracker['labLocation']);
const technicianName = ref(tempStore.reportTracker['technicianName']);
const labType = ref(tempStore.reportTracker['labType'] ?? "Online");
const headsetType = ref(tempStore.reportTracker['headsetType'] ?? "Vive Pro 2");

let networkType;
if (stateStore.toolType !== CONSTANT.TOOL.EXPERIENCE_LAUNCHER) {
  networkType = ref(tempStore.reportTracker['networkType'] ?? "Milesight");
}

let routeNameToIndex;
if (stateStore.toolType === CONSTANT.TOOL.EXPERIENCE_LAUNCHER) {
  routeNameToIndex = {
    'experiences-setup-devices-details': 0
  };
} else {
  routeNameToIndex = {
    'full-setup-devices-details': 0
  };
}

const currentIndex = computed(() => {
  const routeName = route.name?.toString();
  if(routeName === undefined) return -1;
  return routeNameToIndex[routeName] !== undefined ? routeNameToIndex[routeName] : -1;
});

const categories = () => {
  return [
    { key: "Config", description: "Setup your tool" },
  ]
}

const status = computed(() => {
  if (tempStore.reportTracker['labLocation'] === undefined || tempStore.reportTracker['technicianName'] === undefined) {
    return 'gray';
  }
  else if (tempStore.reportTracker['labLocation'].length === 0 || tempStore.reportTracker['technicianName'].length === 0) {
    return 'gray';
  } else {
    return 'success';
  }
});

const changeLabType = (value: string) => {
  labType.value = value;
}

const changeNetworkType = (value: string) => {
  networkType.value = value;
}

const changeHeadsetType = (value: string) => {
  headsetType.value = value;
}

/**
 * Save the lab location and technician name for later use in the report.
 */
const saveDetails = async () => {
  await new Promise<void>((resolve) => {
    setTimeout(() => {
      resolve();
    }, 500);
  });

  tempStore.reportTracker['labLocation'] = labLocation.value;
  tempStore.reportTracker['technicianName'] = technicianName.value;
  tempStore.reportTracker['labType'] = labType.value;
  tempStore.reportTracker['headsetType'] = headsetType.value;

  if (stateStore.toolType !== CONSTANT.TOOL.EXPERIENCE_LAUNCHER) {
    tempStore.reportTracker['networkType'] = networkType.value;
  }
}

/**
 * The precedent for if a user can continue to the next segment.
 */
const calcProceed = () => {
  stateStore.canProceed = tempStore.reportTracker['labLocation'] !== undefined
      && tempStore.reportTracker['labLocation'].length > 0
      && tempStore.reportTracker['technicianName'] !== undefined
      && tempStore.reportTracker['technicianName'].length > 0;
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
  <GenericLayout>
    <template v-slot:title>
      <p class="text-xl font-semibold text-black mb-3">Details</p>
      <p class="text-base text-black mb-4">Enter your information and site details</p>

      <!--A tab for each category-->
      <div class="flex flex-row w-full overflow-auto">
        <CategoryTab
            v-for="(category, index) in categories()"
            :key="index"
            :category="category"
            :index="index as number"
            :currentCategoryIndex="currentIndex"
        />
      </div>
    </template>

    <template v-slot:content>
      <div class="w-full border-2 border-gray-200 rounded-xl p-4 flex flex-col mb-4">
        <div class="flex flex-row justify-between items-center h-full">
          <div class="flex flex-row items-center">
            <StatusIcon :status="status" class="w-16 h-16 mr-8">
              <template v-slot:icon="{ fill }">
                <ChecklistSvg class="w-full h-full" :fill="fill"/>
              </template>
            </StatusIcon>
            <span class="text-lg font-semibold col-span-4">Enter the report details</span>
          </div>
        </div>
        <div class="flex flex-col justify-center col-span-4 ml-24">
          <div class="flex flex-row">
            <div class="flex flex-col mr-8">
              <label for="labLocation" class="text-sm font-semibold mb-2">Lab Location</label>
              <input type="text" name="labLocation" v-model="labLocation" placeholder="Thebarton" class="w-80 h-10 mb-4 px-2 py-1 border-[1px] border-gray-400 rounded-lg shadow-sm"/>

              <label for="labType" class="text-sm font-semibold mb-2">Lab Type</label>
              <GenericDropdown name="labType" @update="changeLabType" :title="<string>labType" :items="['Online', 'Offline']" class="mb-4"/>

              <template v-if="stateStore.toolType !== CONSTANT.TOOL.EXPERIENCE_LAUNCHER">
                <label for="networkType" class="text-sm font-semibold mb-2">Network Type</label>
                <GenericDropdown name="networkType" @update="changeNetworkType" :title="<string>networkType" :items="['Milesight', 'School']"/>
              </template>
            </div>

            <div class="flex flex-col">
              <label for="technicianName" class="text-sm font-semibold mb-2">Technician Name</label>
              <input type="text" name="technicianName" v-model="technicianName" placeholder="John Doe" class="w-80 h-10 mb-4 px-2 py-1 border-[1px] border-gray-400 rounded-lg shadow-sm"/>

              <label for="labType" class="text-sm font-semibold mb-2">Headset Type</label>
              <GenericDropdown name="labType" @update="changeHeadsetType" :title="<string>headsetType" :items="['Vive Pro 1', 'Vive Pro 2', 'Vive Focus 3', 'Vive Business Streaming']"/>
            </div>
          </div>

          <div class="flex flex-row items-center mt-4">
            <GenericButton type="light-blue" :callback="saveDetails" class="mr-4">Set</GenericButton>
          </div>
        </div>
      </div>
    </template>
  </GenericLayout>
</template>
