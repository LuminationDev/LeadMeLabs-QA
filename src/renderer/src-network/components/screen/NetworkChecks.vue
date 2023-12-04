<script setup lang="ts">
import { useNetworkStore } from "../../store/networkStore";
import { computed } from "vue";
import { WEBSITES } from "../../../assets/checks/_networkValues";
import { Report } from "../../interfaces/_report";
import * as CONSTANT from "../../../assets/constants";

const networkStore = useNetworkStore();

const networkSpeed = computed(() => {
  return networkStore.speed;
});

const progress = computed(() => {
  return networkStore.progress;
});

const requestWebsitePing = (name: string, url: string) => {
  //@ts-ignore
  api.ipcRenderer.send(CONSTANT.CHANNEL.NETWORK_CHANNEL, {
    channelType: "website_ping",
    name,
    url
  });
}

/**
 * Run through the list of websites and update the report with the results.
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

const requestSpeedTest = () => {
  //@ts-ignore
  api.ipcRenderer.send(CONSTANT.CHANNEL.NETWORK_CHANNEL, {
    channelType: "speed_test"
  });
}
</script>

<template>
  <div class="sidebar flex flex-col w-full bg-white rounded-3xl px-6 py-2">
    <div class="mb-4">Network test page</div>

    <div @click="checkAllWebsites" class="w-44 h-8 bg-blue-500 cursor-pointer rounded text-white my-4 hover:bg-blue-300">Start Website Check</div>

    <div v-for="check in results" :key="check.id" class="flex flex-col mb-4">
      <div>
        <span class="font-bold mr-2">Site:</span> {{ check.id }}
      </div>

      <div v-if="check.checkingStatus !== 'unchecked'" class="flex flex-col mb-2">
        <div>
          <span class="font-bold mr-2">Result:</span> {{ check.passedStatus }}
        </div>
        <div>
          <span class="font-bold mr-2">Message:</span> {{ check.message }}
        </div>
      </div>

      <div v-else>
        Loading...
      </div>
    </div>

    <div @click="requestSpeedTest" class="w-44 h-8 bg-blue-500 cursor-pointer rounded text-white my-4 hover:bg-blue-300">Start Speed Test</div>
    <div>Progress: {{progress}}</div>
    <div>Speed: {{networkSpeed}}</div>
  </div>
</template>
