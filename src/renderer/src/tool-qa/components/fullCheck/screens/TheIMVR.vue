<script setup lang="ts">
import GenericLayout from "@renderer/tool-qa/components/checks/GenericLayout.vue";
import { useRoute } from "vue-router";
import { useFullStore } from "../../../store/fullStore";
import {computed, onMounted, ref} from "vue";
import * as CONSTANT from "../../../../assets/constants";
import { useStateStore } from "../../../store/stateStore";
import GenericButton from '@renderer/tool-qa/components/_generic/buttons/GenericButton.vue'
import ItemHover from "../ItemHover.vue";
import StatusHover from "../StatusHover.vue";
import {storeToRefs} from "pinia";
import RetrySvg from "@renderer/assets/icons/RetrySvg.vue";

const fullStore = useFullStore();
const stateStore = useStateStore();

const { experienceChecksCompleted, allowRunningExperienceChecks } = storeToRefs(fullStore)

const route = useRoute();

onMounted(() => {
  if (fullStore.experienceChecks.length === 0) {
    fullStore.buildExperienceChecks()
  }
})

function startTesting() {
  fullStore.startExperienceChecks()
  inProgress.value = true
}

function retryExperience(experienceIndex) {
  fullStore.launchExperienceOnAll(experienceIndex)
}

function cancelTesting() {
  allowRunningExperienceChecks.value = false
  inProgress.value = false
}

function hasStartedExperienceChecks() {
  return fullStore.experienceChecks.filter(element => {
    return element.stations.filter(station => station.status !== null).length > 1
  }).length > 1
}

const animateSpin = ref(false)

function getVrStatuses() {
  animateSpin.value = true
  setTimeout(() => {
    animateSpin.value = false
  }, 1000)
  fullStore.sendMessage({
    action: CONSTANT.ACTION.GET_VR_STATUSES,
    actionData: {
      stationIds: ['all']
    }
  })
}

const inProgress = ref(false)

const infoDetails = computed(() => {
  if (inProgress.value && !experienceChecksCompleted.value) {
    return {
      theme: 'testing',
      title: 'Testing...',
      description: 'Running automated tests.'
    }
  }
  if (experienceChecksCompleted.value) {
    return {
      theme: 'success',
      title: 'Done',
      description: 'Automated tests have been completed.'
    }
  }
  if (!allHeadsetsConnected.value) {
    return {
      theme: 'error',
      title: 'Headsets Not Connected',
      description: 'Headsets are required to complete these tests.'
    }
  }
  return {
    theme: 'ready',
    title: 'Ready',
    description: 'This automated test takes approximately 15 minutes.'
  }
})

const allHeadsetsConnected = computed(() => {
  const index = fullStore.stations.findIndex(station => station.vrStatuses?.openVrStatus === 'Off')
  return index === -1
})

onMounted(() => {
  getVrStatuses()
})

</script>

<template>
  <GenericLayout>
    <template v-slot:title>
      <div class="flex flex-row justify-between">
        <div class="flex flex-col">
          <p class="text-2xl text-black font-semibold mb-3">VR Experiences</p>
          <p class="text-base text-black mb-3">All experiences can be launched and played</p>
        </div>
        <div class="flex flex-row border-gray-100 border-2 rounded-2xl p-4 items-center">
          <div @click="getVrStatuses" class="mr-4">
            <RetrySvg fill="#6b7280" class="cursor-pointer" :class="animateSpin ? 'animate-spin' : ''"/>
          </div>
          <div v-for="station in fullStore.stations" :id="station.id" class="border-gray-100 border-2 rounded-xl p-2 mr-2 last:mr-0">
            <img v-if="!station.vrStatuses || (station.vrStatuses.openVrStatus === 'Off' || station.vrStatuses.headsetStatus === 'Off')" src="../../../../assets/icons/headset-not-connected.svg" :alt="`not connected headset icon`" />
            <img v-else src="../../../../assets/icons/headset-connected.svg" :alt="`connected headset icon`" />
          </div>
        </div>
      </div>
    </template>

    <template v-slot:content>
      <div
          class="flex flex-row justify-between w-full h-20 border-collapse rounded-lg border-[1px] items-center"
          :class="{
      'bg-red-50 border-red-400': infoDetails.theme === 'error',
      'bg-green-50 border-green-500': infoDetails.theme === 'success',
      'bg-blue-50 border-blue-500': infoDetails.theme === 'testing',
      'bg-gray-50 border-green-500': infoDetails.theme === 'ready',
    }"
      >
        <div class="flex flex-row">
          <div class="flex flex-col p-2">
            <img v-if="infoDetails.theme === 'error'" src="../../../../assets/icons/checking-error.svg" :alt="`error icon`" />
            <img v-else-if="infoDetails.theme === 'success'" src="../../../../assets/icons/checking-done.svg" :alt="`success icon`" />
            <img v-else-if="infoDetails.theme === 'ready'" src="../../../../assets/icons/checking-done.svg" :alt="`success icon`" />
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

        <GenericButton v-if="inProgress" type="transparent" class="mr-8" :callback="cancelTesting">
          Cancel
        </GenericButton>
        <GenericButton v-else type="blue" :disabled="!allHeadsetsConnected" class="px-4 mr-8" :callback="startTesting">
          <img v-if="allHeadsetsConnected" src="../../../../assets/icons/start-test.svg" :alt="`start icon`" class="mr-2" />
          <img v-else src="../../../../assets/icons/start-test-gray.svg" :alt="`start icon`" class="mr-2" />
          {{ hasStartedExperienceChecks ? 'Resume' : 'Start test' }}
        </GenericButton>
      </div>

      <div v-if="fullStore.experienceChecks && fullStore.experienceChecks.length" class="flex flex-col">
        <table class="w-full border-collapse mt-4">
          <tr class="text-left text-xs bg-gray-100 border border-gray-200">
            <th class="p-3">Name</th>

            <th class="w-16 text-center p-3" v-for="device in fullStore.experienceChecks[0].stations">
              S{{device.id}}
            </th>
            <th/>
          </tr>

          <!--Table will not be built if NUC connection has not been made, fullStore.buildQA is triggered on response-->
          <tr v-for="(check, index) in fullStore.experienceChecks" :key="index" class="text-sm border border-gray-200">
            <ItemHover :title="check.title" :message="'No details provided'"/>
            <template v-for="(station, index) in check.stations" :key="index">
              <StatusHover
                           :message="station.message ?? 'No details provided'"
                           :checking-status="station.checkingStatus ?? 'not checked'"
                           :passed-status="station.status ?? 'unknown'"/>
            </template>
            <th v-if="check.stations.filter(station => station.status === 'failed').length > 0">
              <button
                  @click="() => { retryExperience(index) }"
                  :disabled="inProgress"
                  class="cursor-pointer disabled:cursor-not-allowed">
                Retry
              </button>
            </th>
            <th v-else/>
          </tr>
        </table>
      </div>
    </template>
  </GenericLayout>
</template>
