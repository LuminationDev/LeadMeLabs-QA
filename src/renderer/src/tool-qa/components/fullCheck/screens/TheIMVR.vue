<script setup lang="ts">
import Description from "@renderer/tool-qa/components/checks/Description.vue";
import GenericLayout from "@renderer/tool-qa/components/checks/GenericLayout.vue";
import { useRoute } from "vue-router";
import {useFullStore} from "../../../store/fullStore";
import BasicFullCheck from "@renderer/tool-qa/components/fullCheck/BasicFullCheck.vue";
import {onMounted} from "vue";
import * as CONSTANT from "../../../../assets/constants";
import {GET_VR_STATUSES} from "../../../../assets/constants/_message";
import {useStateStore} from "../../../store/stateStore";

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
      <Description v-if="route.name === 'full-imvr stations'"/>
      <BasicFullCheck v-if="route.name === 'full-imvr stations-vive'" title="Vive Console" object-name="VIVE"/>

      Stations
      <div v-for="station in fullStore.stations">
        {{ station.vrStatuses }}
      </div>
      <button @click="getVrStatuses">Refresh statuses</button>

      <div v-if="route.name === 'full-imvr stations-launching'">
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
      </div>

<!--      <BasicReport v-if="route.name === 'full-network-report'" :section="['CABLING', 'NETWORK', 'CBUS']"/>-->
    </template>
  </GenericLayout>
</template>
