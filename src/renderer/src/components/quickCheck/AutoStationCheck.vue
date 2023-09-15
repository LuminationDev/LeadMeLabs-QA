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

//Filter out the checkId's into different categories
const networkIds = ['macAddress', 'defaultGateway', 'dnsServer', 'altDnsServer'];
const networkDetails = computed(() => {
  const filteredItems = quickStore.stationDetails
      .filter((value) => networkIds.includes(value['id']));

  return filteredItems.reduce((accumulator, value, index) => {
    accumulator[value['id']] = value;
    return accumulator;
  }, {});
});

const windowIds = ['magic_packet_enabled', 'amd_installed', 'openssl_environment', 'wallpaper_is_set', 'timezone_correct', 'correct_datetime'];
const windowDetails = computed(() => {
  const filteredItems = quickStore.stationDetails
      .filter((value) => windowIds.includes(value['id']));

  return filteredItems.reduce((accumulator, value, index) => {
    accumulator[value['id']] = value;
    return accumulator;
  }, {});
});

const softwareIds = ['setvol_installed', 'steamcmd_installed', 'steamcmd_initialised', 'steamcmd_configured'];
const softwareDetails = computed(() => {
  const filteredItems = quickStore.stationDetails
      .filter((value) => softwareIds.includes(value['id']));

  return filteredItems.reduce((accumulator, value, index) => {
    accumulator[value['id']] = value;
    return accumulator;
  }, {});
});

const configIds = ['id', 'room', 'labLocation', 'ipAddress', 'nucIpAddress', 'selectedHeadset'];
const configDetails = computed(() => {
  const filteredItems = quickStore.stationDetails
      .filter((value) => configIds.includes(value['id']));

  return filteredItems.reduce((accumulator, value, index) => {
    accumulator[value['id']] = value;
    return accumulator;
  }, {});
});

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

    <BasicQuickCheck v-if="Object.keys(networkDetails).length > 0"
                     title="Network"
                     :details="networkDetails"
                     @retest="retest"/>

    <!--Filter out by checkId to the correct areas-->
    <BasicQuickCheck v-if="Object.keys(windowDetails).length > 0"
                     title="Windows"
                     :details="windowDetails"/>

    <BasicQuickCheck v-if="Object.keys(softwareDetails).length > 0"
                     title="Software"
                     :details="softwareDetails"/>

    <BasicQuickCheck v-if="Object.keys(configDetails).length > 0"
                     title="Config"
                     :details="configDetails"
                     @retest="retest"/>
  </div>
</template>
