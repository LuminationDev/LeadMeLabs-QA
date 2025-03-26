<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { useRoute } from "vue-router";
import GenericLayout from "../../components/layouts/GenericLayout.vue";
import * as CONSTANT from "../../assets/constants";
import RetrySvg from "../../assets/icons/vue/RetrySvg.vue";
import CategoryTab from "../../components/statuses/CategoryTab.vue";
import ExperienceChecks from "./ExperienceChecks.vue";
import ExperienceLibrary from "./ExperienceLibrary.vue";
import { useStateStore } from "../../store/stateStore";
import { useExperienceCheckStore } from "../../store/experienceCheckStore";

const stateStore = useStateStore();
const tempStore = stateStore.getStore;
const experienceCheckStore = useExperienceCheckStore();
const animateSpin = ref(false);
const route = useRoute();

let routeNameToIndex;
let routePrefix: string;
if (stateStore.toolType === CONSTANT.TOOL.EXPERIENCE_LAUNCHER) {
  routePrefix = 'experiences';
  routeNameToIndex = {
    'experiences-imvr-pre_experience_checks': 0,
    'experiences-imvr-experience_checks': 1
  };
} else {
  routePrefix = 'full';
  routeNameToIndex = {
    'full-imvr-pre_experience_checks': 0,
    'full-imvr-experience_checks': 1
  };
}

const currentIndex = computed(() => {
  const routeName = route.name?.toString();
  if (routeName === undefined) return -1;
  return routeNameToIndex[routeName] !== undefined ? routeNameToIndex[routeName] : -1;
});

const categories = () => {
  return [
    { key: "Library", description: "Installed experiences" },
    { key: "Launch", description: "Playable experiences" }
  ]
}

function getVrStatuses() {
  animateSpin.value = true
  setTimeout(() => {
    animateSpin.value = false
  }, 1000)
  stateStore.sendMessage({
    action: CONSTANT.ACTION.GET_VR_STATUSES,
    actionData: {
      stationIds: ['all']
    }
  });
}

onMounted(() => {
  getVrStatuses();

  if (experienceCheckStore.experienceChecks.length === 0) {
    experienceCheckStore.buildExperienceChecks()
  }

  experienceCheckStore.updateExperienceChecksWithErrors();
});
</script>

<template>
  <GenericLayout>
    <template v-slot:title>
      <div class="flex flex-col">
        <div class="flex flex-row justify-between">
          <div class="flex flex-col">
            <p class="text-2xl text-black font-semibold mb-3">VR Experiences</p>
            <p class="text-base text-black">All experiences can be launched and played</p>
          </div>
          <div class="flex flex-row border-gray-100 border-2 rounded-2xl p-4 items-center">
            <div @click="getVrStatuses" class="mr-4">
              <RetrySvg fill="#6b7280" class="cursor-pointer" :class="animateSpin ? 'animate-spin' : ''"/>
            </div>
            <template v-for="station in tempStore.stations" :id="station.id">
              <div v-if="station.details !== null" class="border-gray-100 border-2 rounded-xl p-2 w-10 h-10 ml-1 last-child:ml-0">
                <img v-if="station.details?.stationMode !== 'vr'" src="../../assets/icons/headset-na.svg" :alt="`non-vr station icon`" />
                <img v-else-if="!station.vrStatuses || (station.vrStatuses['openVrStatus'] !== 'Connected' || station.vrStatuses['headsetStatus'] !== 'Connected')" src="../../assets/icons/headset-not-connected.svg" :alt="`not connected headset icon`" />
                <img v-else src="../../assets/icons/headset-connected.svg" :alt="`connected headset icon`" />
              </div>
            </template>
          </div>
        </div>

        <!--A tab for each category-->
        <div class="flex flex-row mt-3 w-full overflow-auto">
          <CategoryTab
              v-for="(category, index) in categories()"
              :key="index"
              :category="category"
              :index="index as number"
              :currentCategoryIndex="currentIndex"
          />
        </div>
      </div>
    </template>

    <template v-slot:content>
      <ExperienceLibrary v-if="route.name === `${routePrefix}-imvr-pre_experience_checks`" />
      <ExperienceChecks v-else-if="route.name === `${routePrefix}-imvr-experience_checks`" />
    </template>
  </GenericLayout>
</template>
