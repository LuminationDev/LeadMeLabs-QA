<script setup lang="ts">
import { useNetworkStore } from "../../store/networkStore";
import { computed, watch } from "vue";
import { DESCRIPTIONS, WEBSITES } from "../../../assets/checks/_networkValues";
import * as CONSTANT from "../../../assets/constants";
import ItemHover from "../../../components/statuses/ItemHover.vue";
import CategoryStatus from "../CategoryStatus.vue";
import NetworkCheckInfoModal from "../../../modals/NetworkCheckInfoModal.vue";
import GenericCheckStatus from "../NetworkCheckStatus.vue";

const networkStore = useNetworkStore();
const networkProgress = computed(() => {
  return networkStore.progress;
});

const sendNetworkRequest = (channelType: string, id: string, timeout: number, value: string = '') => {
  //@ts-ignore
  api.ipcRenderer.send(CONSTANT.CHANNEL.NETWORK_CHANNEL, { channelType, id, value });

  setTimeout(() => {
    const category = getCategoryFromChannelType(channelType);
    if (networkStore.reportTracker[category][id].passedStatus === '') {
      networkStore.updateReportTracker(category, id, 'failed', 'Timed out');
    }
  }, timeout);
};

const getCategoryFromChannelType = (channelType) => {
  switch (channelType) {
    case 'speed_test':
      return 'Speed Test';
    case 'internet_online':
      return 'Network';
    case 'website_ping':
      return 'Firewall';
    case 'check_port':
      return 'Ports';
    case 'steam_api':
      return 'Steam';
    default:
      return '';
  }
};

const requestSpeedTest = () => {
  networkStore.progress = 'Connecting';
  sendNetworkRequest('speed_test', 'Download', 10 * 6000);
};

const requestNetworkCheck = () => {
  sendNetworkRequest('internet_online', 'Internet', 5000);
};

const requestSteamCheck = () => {
  sendNetworkRequest('steam_api', 'Steam Api', 11000);
}

const buildPortCheck = async () => {
  //@ts-ignore
  api.ipcRenderer.send(CONSTANT.CHANNEL.NETWORK_CHANNEL, { channelType: 'build_port_check' });
};

const teardownPortCheck = async () => {
  //@ts-ignore
  api.ipcRenderer.send(CONSTANT.CHANNEL.NETWORK_CHANNEL, { channelType: 'teardown_port_check' });
};

function portTest() {
  //@ts-ignore
  api.ipcRenderer.send(CONSTANT.CHANNEL.NETWORK_CHANNEL, {
    channelType: "port_test",
    port: 55556
  });
}

const requestWebsitePing = async () => {
  for (const website of WEBSITES) {
    await sendNetworkRequest('website_ping', website.name, 5000, website.url);
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
};

const startNetworkChecks = () => {
  networkStore.resetReportState();

  buildPortCheck();

  requestNetworkCheck();
  requestSpeedTest();
  requestSteamCheck();
  Promise.all([requestWebsitePing()]); //Run the loops concurrently
}

// const results = computed((): Report => {
//   return networkStore.reportTracker;
// });

watch(() => networkStore.checkReportState, (newValue) => {
  if (newValue === "done") {
    teardownPortCheck()
  }
})
</script>

<template>
  <div class="flex flex-col w-full h-auto">
    <!--Loading-->
    <GenericCheckStatus :callback="startNetworkChecks" :checking="networkStore.checkReportState"/>

    <div class="w-full mt-4 flex flex-col rounded-lg border-2 border-gray-200">
      <table class="w-full border-collapse">
        <tr class="text-left text-xs bg-gray-100">
          <th class="p-3">Name</th>

          <th class="w-20 text-center p-3" @click="portTest">
            Status
          </th>

          <!--Required for the empty space-->
          <th class="w-20 p-3"></th>
        </tr>

        <!--Table will not be built if NUC connection has not been made, fullStore.buildQA is triggered on response-->
        <tr v-for="(check, index) in networkStore.getReportTitles" :key="index" class="text-sm border-b border-gray-200 last:border-0">
          <ItemHover :title="check" :message="DESCRIPTIONS[check].passed ?? 'No details provided'"/>

          <CategoryStatus v-if="(networkProgress === '100.00' || networkProgress === '0') || check !== 'Speed Test'" :category="check"/>
          <td v-else class="p-3 text-sm h-12 w-28 font-semibold">
            <div class="rounded-xl w-fit min-w-[70px] px-2 bg-blue-100 border-[1px] border-blue-300 text-blue-700">
              {{networkProgress === 'Connecting' ? networkProgress : `${networkProgress ?? 0 }%`}}
            </div>
          </td>

          <NetworkCheckInfoModal :category="check"/>
        </tr>
      </table>
    </div>
  </div>
</template>
