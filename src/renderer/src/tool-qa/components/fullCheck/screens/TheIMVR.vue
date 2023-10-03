<script setup lang="ts">
import GenericLayout from "@renderer/tool-qa/components/checks/GenericLayout.vue";
import { useRoute } from "vue-router";
import { useFullStore } from "../../../store/fullStore";
import { onMounted } from "vue";
import * as CONSTANT from "../../../../assets/constants";
import { useStateStore } from "../../../store/stateStore";

const fullStore = useFullStore();
const stateStore = useStateStore();

const route = useRoute();

function startTesting() {
  fullStore.startExperienceChecks()
}

function getVrStatuses() {
  fullStore.sendMessage({
    action: CONSTANT.ACTION.GET_VR_STATUSES,
    actionData: {
      stationIds: ['all']
    }
  })
}

onMounted(() => {
  getVrStatuses()
})

</script>

<template>
  <GenericLayout>
    <template v-slot:title>
      <p class="text-2xl text-black font-semibold mb-3">Experiences</p>
      <p class="text-base text-black mb-3">Launch each experiences to ensure they are all ready and working</p>
    </template>

    <template v-slot:content>
      Stations
      <div v-for="station in fullStore.Stations">
        {{ station.vrStatuses }}
      </div>
      <button @click="getVrStatuses">Refresh statuses</button>

      <button @click="startTesting">Start Testing</button>

      <div v-if="fullStore.experienceChecks && fullStore.experienceChecks.length" class="flex flex-col">
        <div v-for="check in fullStore.experienceChecks" class="flex flex-row">
          <div class="w-1/4">{{ check.title }}</div>
          <div class="w-3/4">
            <div v-for="station in check.stations">
              <img v-if="station.status === 'passed'" src="../../../../assets/icons/nav-icon-complete.svg" class="w-10 h-10"/>
              <img v-if="station.status === 'failed'" src="../../../../assets/icons/nav-icon-cross.svg" class="w-10 h-10"/>
              <img v-if="station.status === 'unchecked'" src="../../../../assets/icons/nav-icon-base.svg" class="w-10 h-10"/>
              <img v-if="station.status === 'launching'" src="../../../../assets/icons/loader-temp.svg" class="w-10 h-10"/>
            </div>
          </div>
        </div>
      </div>
    </template>
  </GenericLayout>
</template>
