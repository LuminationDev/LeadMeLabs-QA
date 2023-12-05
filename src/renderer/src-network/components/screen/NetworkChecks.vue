<script setup lang="ts">
import { useNetworkStore } from "../../store/networkStore";
import { computed, ref } from "vue";
import {DESCRIPTIONS, WEBSITES} from "../../../assets/checks/_networkValues";
import { Report } from "../../interfaces/_report";
import * as CONSTANT from "../../../assets/constants";
import ItemHover from "../../../components/statuses/ItemHover.vue";
import StatusHover from "../../../components/statuses/StatusHover.vue";
import CheckStatus from "../../../components/statuses/CheckStatus.vue";
import CategoryStatus from "../CategoryStatus.vue";
import NetworkCheckInfoModal from "../../../modals/NetworkCheckInfoModal.vue";

const networkStore = useNetworkStore();
const checking = ref("testing");

const networkOnline = computed(() => {
  return networkStore.networkOnline;
});

const requestNetworkCheck = () => {
  //@ts-ignore
  api.ipcRenderer.send(CONSTANT.CHANNEL.NETWORK_CHANNEL, {
    channelType: "network_check"
  });
}

const requestWebsitePing = (name: string, url: string) => {
  //@ts-ignore
  api.ipcRenderer.send(CONSTANT.CHANNEL.NETWORK_CHANNEL, {
    channelType: "website_ping",
    name,
    url
  });
}

function portTest() {
  api.ipcRenderer.send(CONSTANT.CHANNEL.NETWORK_CHANNEL, {
    channelType: "port_test",
    port: 55556
  });
}

/**
 * Run through the list of websites and request a ping for each.
 */
const checkAllWebsites = async () => {
  networkStore.resetWebsiteResults();

  for (const website of WEBSITES) {
    requestWebsitePing(website.name, website.url);
  }
};

const results = computed((): Report => {
  return networkStore.reportTracker;
});


const networkSpeed = computed(() => {
  return networkStore.speed;
});

const progress = computed(() => {
  return networkStore.progress;
});

const requestSpeedTest = () => {
  networkStore.progress = "Connecting...";
  networkStore.speed = "Calculating...";

  //@ts-ignore
  api.ipcRenderer.send(CONSTANT.CHANNEL.NETWORK_CHANNEL, {
    channelType: "speed_test"
  });
}

const retryNetworkChecks = () => {
  console.log("Do all the checks again");
}
</script>

<template>
  <div class="flex flex-col w-full h-auto">
    <!--Loading-->
    <CheckStatus :callback="retryNetworkChecks" :checking="checking"/>

    <table class="w-full border-collapse mt-4">
      <tr class="text-left text-xs bg-gray-100 border border-gray-200">
        <th class="p-3">Name</th>

        <th class="w-20 text-center p-3" @click="portTest">
          Status
        </th>

        <!--Required for the empty space-->
        <th class="w-20 p-3"></th>
      </tr>

      <!--Table will not be built if NUC connection has not been made, fullStore.buildQA is triggered on response-->
      <tr v-for="(check, index) in networkStore.getReportTitles" :key="index" class="text-sm border border-gray-200">
        <ItemHover :title="check" :message="DESCRIPTIONS[check] ?? 'No details provided'"/>

        <CategoryStatus :category="check"/>

        <NetworkCheckInfoModal :category="check"/>
      </tr>
    </table>
  </div>



<!--  <div class="flex flex-row w-full rounded-3xl px-6">-->
<!--    <div class="flex flex-col mr-10">-->
<!--      <div @click="requestNetworkCheck" class="w-44 h-8 bg-blue-500 cursor-pointer rounded text-white my-4 hover:bg-blue-300">Start Network Check</div>-->
<!--      <div>Connected: {{networkOnline ?? "Checking"}}</div>-->
<!--    </div>-->

<!--    <div class="flex flex-col mr-10">-->
<!--      <div @click="checkAllWebsites" class="w-44 h-8 bg-blue-500 cursor-pointer rounded text-white my-4 hover:bg-blue-300">Start Website Check</div>-->

<!--      <div v-for="check in results" :key="check.id" class="flex flex-col mb-4">-->
<!--        <div>-->
<!--          <span class="font-bold mr-2">Site:</span> {{ check.id }}-->
<!--        </div>-->

<!--        <div v-if="check.checkingStatus !== 'unchecked'" class="flex flex-col mb-2">-->
<!--          <div>-->
<!--            <span class="font-bold mr-2">Result:</span> {{ check.passedStatus }}-->
<!--          </div>-->
<!--          <div>-->
<!--            <span class="font-bold mr-2">Message:</span> {{ check.message }}-->
<!--          </div>-->
<!--        </div>-->

<!--        <div v-else>-->
<!--          Loading...-->
<!--        </div>-->
<!--      </div>-->
<!--    </div>-->

<!--    <div class="flex flex-col">-->
<!--      <div @click="requestSpeedTest" class="w-44 h-8 bg-blue-500 cursor-pointer rounded text-white my-4 hover:bg-blue-300">Start Speed Test</div>-->
<!--      <div>Progress: {{progress}}</div>-->
<!--      <div>Speed: {{networkSpeed}}</div>-->
<!--    </div>-->
<!--  </div>-->
</template>
