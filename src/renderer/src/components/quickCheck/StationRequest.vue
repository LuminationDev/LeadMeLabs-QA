<script setup lang="ts">
import * as CHECK from "../../assets/checks/index"
import * as CONSTANT from "@renderer/assets/constants";
import GenericDropdown from "@renderer/components/_generic/dropdowns/GenericDropdown.vue";
import { computed, ref } from "vue";
import { useStateStore } from "@renderer/store/stateStore";
import { useQuickStore } from "@renderer/store/quickStore";
import InformationRow from "@renderer/components/checks/InformationRow.vue";

const stateStore = useStateStore();
const quickStore = useQuickStore();
const address = ref("");
const checkType = ref("All");

const SelectCheckType = (type: string) => {
  checkType.value = type;
}

const numberOfChecks = computed(() => {
  return Object.keys(quickStore.stationDetails).length;
});

/**
 * Request information from
 * @constructor
 */
const RequestFromStation = () => {
  //@ts-ignore
  api.ipcRenderer.send(CONSTANT.CHANNEL.HELPER_CHANNEL, {
    channelType: CONSTANT.CHANNEL.TCP_CLIENT_CHANNEL,
    key: stateStore.key,
    address: address.value,
    port: 55557,
    data: DetermineRequest() + stateStore.getServerDetails
  });
}

const DetermineRequest = (): string => {
  switch (checkType.value) {
    case "Windows":
      return CONSTANT.MESSAGE.REQUEST_STATION_DETAILS_WINDOWS;
    case "Software":
      return CONSTANT.MESSAGE.REQUEST_STATION_DETAILS_SOFTWARE;
    case "Network":
      return CONSTANT.MESSAGE.REQUEST_STATION_DETAILS_NETWORK;
    case "Config":
      return CONSTANT.MESSAGE.REQUEST_STATION_DETAILS_CONFIG;
    default:
      return CONSTANT.MESSAGE.REQUEST_STATION_DETAILS_ALL;
  }
}

/**
 * List of checks that can be made against a Station
 */
const checks = ['All', 'Network', 'Windows', 'Software', 'Config'];
</script>

<template>
  <input v-model="address" class="bg-gray-100 w-56 h-8 mb-4 px-4 rounded" placeholder="Station IP address"/>
  <div class="flex flex-row items-center justify-between mb-5">
    <div v-on:click="RequestFromStation"
         class="w-32 h-8 flex items-center justify-center rounded-lg"
         :class="{
                    'bg-blue-500 text-white cursor-pointer hover:bg-blue-400': address.length > 0,
                    'bg-gray-300 text-white': address.length === 0,
                 }">
      Check
    </div>

    <div class="flex items-center justify-center">
      <div class="mr-10">
        Checking: {{checkType}}
      </div>

      <GenericDropdown @update="SelectCheckType" title="QA Type" :items="checks"/>
    </div>
  </div>

  <hr class="my-3"/>

  <!--Display the Station response below/check against correct values-->
  <div class="flex flex-col">
    <div v-if="numberOfChecks > 0">Number of checks performed: {{numberOfChecks}}</div>

    <InformationRow
        v-for="(value, key) in quickStore.stationDetails" :key="key"
        :title="stateStore.capitalizeFirstLetter(stateStore.insertSpaceBetweenCapitalLetters(key))"
        :text="value"
        :correct="CHECK.QUICK.VALUES[key] === value"/>
  </div>
</template>
