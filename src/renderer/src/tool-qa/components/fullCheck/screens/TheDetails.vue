<script setup lang="ts">
import GenericLayout from "@renderer/tool-qa/components/checks/GenericLayout.vue";
import CategoryTab from "@renderer/tool-qa/components/fullCheck/screens/CategoryTab.vue";
import GenericButton from "@renderer/tool-config/components/GenericButton.vue";
import StatusIcon from "@renderer/tool-qa/components/_generic/StatusIcon.vue";
import ChecklistSvg from "@renderer/assets/icons/ChecklistSvg.vue";
import { useRoute } from "vue-router";
import { computed, ref } from "vue";
import { useFullStore } from "@renderer/tool-qa/store/fullStore";

const fullStore = useFullStore();
const route = useRoute();
const labLocation = ref(fullStore.reportTracker['labLocation']);
const technicianName = ref(fullStore.reportTracker['technicianName']);

const routeNameToIndex = {
  'full-setup-devices-details': 0
};

const currentIndex = computed(() => {
  const routeName = route.name.toString();
  return routeNameToIndex[routeName] !== undefined ? routeNameToIndex[routeName] : -1;
});

const categories = () => {
  return [
    { key: "Config", description: "Setup your tool" },
  ]
}

const status = computed(() => {
  if (fullStore.reportTracker['labLocation'] === undefined || fullStore.reportTracker['technicianName'] === undefined) {
    return 'gray';
  }
  else if (fullStore.reportTracker['labLocation'].length === 0 || fullStore.reportTracker['technicianName'].length === 0) {
    return 'gray';
  } else {
    return 'success';
  }
});

/**
 * Save the lab location and technician name for later use in the report.
 */
const saveDetails = async () => {
  await new Promise<void>((resolve) => {
    setTimeout(() => {
      resolve();
    }, 500);
  });

  fullStore.reportTracker['labLocation'] = labLocation.value;
  fullStore.reportTracker['technicianName'] = technicianName.value;
}
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
          <div class="flex flex-col">
            <label for="labLocation" class="text-sm font-semibold">Lab Location</label>
            <input type="text" name="labLocation" v-model="labLocation" placeholder="Thebarton" class="w-80 h-10 my-2 px-2 py-1 border-[1px] border-gray-400 rounded-lg shadow-sm"/>

            <label for="technicianName" class="text-sm font-semibold">Technician Name</label>
            <input type="text" name="technicianName" v-model="technicianName" placeholder="Key" class="w-80 h-10 mb-2 px-2 py-1 border-[1px] border-gray-400 rounded-lg shadow-sm"/>

            <div class="flex flex-row items-center">
              <GenericButton type="light-blue" :callback="saveDetails" class="mr-4">Save</GenericButton>
            </div>
          </div>
        </div>
      </div>
    </template>
  </GenericLayout>
</template>
