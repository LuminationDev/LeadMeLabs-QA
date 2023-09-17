<script setup lang="ts">
import * as CONSTANT from "@renderer/assets/constants";
import InformationTitle from "@renderer/components/checks/InformationTitle.vue";
import BasicQuickCheck from "@renderer/components/quickCheck/BasicQuickCheck.vue";
import { computed, onMounted, ref } from "vue";
import { useStateStore } from "@renderer/store/stateStore";
import { useQuickStore } from "@renderer/store/quickStore";
import Spinner from "@renderer/components/_generic/buttons/Spinner.vue";

const stateStore = useStateStore();
const quickStore = useQuickStore();
const checkType = ref('');
const checkCount = ref(0);

const numberOfChecks = computed(() => {
  return quickStore.stationDetails.length;
});

const currentlyCorrect = computed(() => {
  return quickStore.stationDetails.filter(item => item['passedCheck'] === true).length;
});

/**
 * Request information from
 * @constructor
 */
const requestFromStation = () => {
  stateStore.isAwaitingResponse = true;

  //@ts-ignore
  api.ipcRenderer.send(CONSTANT.CHANNEL.HELPER_CHANNEL, {
    channelType: CONSTANT.CHANNEL.TCP_CLIENT_CHANNEL,
    key: stateStore.key,
    address: quickStore.stationAddress,
    port: 55557,
    data: determineRequest() + stateStore.getServerDetails
  });
}

const retest = async (type: string) => {
  checkType.value = checks[checks.indexOf(type)];
  checkCount.value = checks.indexOf(type);

  requestFromStation();

  while (stateStore.isAwaitingResponse) {
    await new Promise(resolve => setTimeout(resolve, 3000));
  }

  checkCount.value = -1;
}

const determineRequest = (): string => {
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

//Filter out the checkId's into different categories for display purposes (This is in order of the checks array)
const networkIds = ['macAddress', 'defaultGateway', 'dnsServer', 'altDnsServer'];
const windowIds = ['magic_packet_enabled', 'amd_installed', 'openssl_environment', 'wallpaper_is_set', 'timezone_correct', 'correct_datetime'];
const softwareIds = ['setvol_installed', 'steamcmd_installed', 'steamcmd_initialised', 'steamcmd_configured'];
const configIds = ['id', 'room', 'labLocation', 'ipAddress', 'nucIpAddress', 'selectedHeadset'];

/**
 * List of checks that can be made against a Station
 */
const checks = ['Network', 'Windows', 'Software', 'Config'];

const beginChecks = async () => {
  for (let i = 0; i < checks.length; i++) {
    await new Promise(resolve => setTimeout(resolve, 1000));

    checkType.value = checks[i];
    checkCount.value = i;
    requestFromStation();

    while (stateStore.isAwaitingResponse) {
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }

  checkCount.value = -1;
}

/**
 * Start the first check when the component is mounted
 */
onMounted(() =>{
  beginChecks();
});
</script>

<template>
  <!--Display the Station response below/check against correct values-->
  <div class="flex flex-col">
    <InformationTitle
        class="mb-4"
        :title="`Number of checks performed: ${numberOfChecks}`"
        :current-keys="currentlyCorrect"
        :total-keys="numberOfChecks"/>

    <div v-if="checkCount !== -1" class="flex flex-row items-center mb-4">
      Now checking.... {{checks[checkCount]}} <Spinner />
    </div>

    <BasicQuickCheck v-if="Object.keys(quickStore.filterStationDetails(networkIds)).length > 0"
                     title="Network"
                     :details="quickStore.filterStationDetails(networkIds)"
                     @retest="retest"/>

    <!--Filter out by checkId to the correct areas-->
    <BasicQuickCheck v-if="Object.keys(quickStore.filterStationDetails(windowIds)).length > 0"
                     title="Windows"
                     :details="quickStore.filterStationDetails(windowIds)"/>

    <BasicQuickCheck v-if="Object.keys(quickStore.filterStationDetails(softwareIds)).length > 0"
                     title="Software"
                     :details="quickStore.filterStationDetails(softwareIds)"/>

    <BasicQuickCheck v-if="Object.keys(quickStore.filterStationDetails(configIds)).length > 0"
                     title="Config"
                     :details="quickStore.filterStationDetails(configIds)"
                     @retest="retest"/>
  </div>
</template>
