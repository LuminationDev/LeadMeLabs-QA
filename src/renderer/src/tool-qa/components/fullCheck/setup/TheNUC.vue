<script setup lang="ts">
import * as CONSTANT from "@renderer/assets/constants";
import StatusIcon from "@renderer/tool-qa/components/_generic/StatusIcon.vue";
import CbusSvg from "@renderer/assets/icons/CbusSvg.vue";
import GenericButton from "@renderer/tool-config/components/GenericButton.vue";
import ConnectingSpinner from "@renderer/tool-qa/components/_generic/loading/ConnectingSpinner.vue";
import ComputerSvg from "@renderer/assets/icons/ComputerSvg.vue";
import { useRoute } from "vue-router";
import { useStateStore } from "@renderer/tool-qa/store/stateStore";
import { useFullStore } from "@renderer/tool-qa/store/fullStore";
import { storeToRefs } from "pinia";
import { onMounted, ref, watch } from "vue";

const route = useRoute();
const stateStore = useStateStore();
const fullStore = useFullStore();
const { connected } = storeToRefs(fullStore);
const nucAddress = ref("");
const encryptionKey = ref("");

const connectionState = ref("unstarted");
watch(connected, (newValue) => {
  if (newValue === true) {
    connectionState.value = 'success'
  } else {
    connectionState.value = 'failed'
  }
})
onMounted(() => {
  if (connected.value) {
    connectionState.value = 'success'
  }
});

watch(connectionState, (newValue) => {
  if (newValue === 'failed') {
    api.ipcRenderer.send(CONSTANT.CHANNEL.HELPER_CHANNEL, {
      channelType: CONSTANT.CHANNEL.TCP_COMMAND_CHANNEL,
      command: "stop"
    });
  }
});

async function connectToNuc() {
  connectionState.value = 'loading'
  stateStore.key = encryptionKey.value;
  fullStore.nucAddress = nucAddress.value;
  fullStore.connected = false

  //@ts-ignore
  api.ipcRenderer.send(CONSTANT.CHANNEL.HELPER_CHANNEL, {
    channelType: CONSTANT.CHANNEL.TCP_COMMAND_CHANNEL,
    key: stateStore.key,
    address: stateStore.ipAddress,
    port: stateStore.serverPort,
    command: "start"
  });

  fullStore.sendMessage({
    action: CONSTANT.ACTION.CONNECT,
    actionData: {}
  })

  setTimeout(() => {
    if (connectionState.value === 'loading') {
      connectionState.value = 'failed'
    }
  }, 10000)
}
</script>

<template>
  <div class="w-full border-2 border-gray-200 rounded-xl p-4 flex flex-col mb-4">
    <div class="flex flex-row justify-between items-center h-full">
      <div class="flex flex-row items-center">
        <StatusIcon :status="connectionState" class="w-16 h-16 mr-8">
          <template v-slot:icon="{ fill }">
            <ComputerSvg :fill="fill" />
          </template>
        </StatusIcon>
        <span class="text-lg font-semibold col-span-4">{{ connectionState !== 'success' ? 'Connect to your NUC' : 'NUC is connected' }}</span>
      </div>
      <span v-if="connectionState === 'success'">{{fullStore.nucAddress}}</span>
    </div>
    <div class="flex flex-col justify-center col-span-4 ml-24" v-if="connectionState !== 'success'">
      <div class="flex flex-col">
        <label for="nucAddress" class="text-sm font-semibold">NUC address</label>
        <input type="text" name="nucAddress" v-model="nucAddress" placeholder="192.168.1.100" class="w-80 h-10 my-2 px-2 py-1 border-[1px] border-gray-400 rounded-lg shadow-sm"/>
        <label for="encryptionKey" class="text-sm font-semibold">Encryption key</label>
        <input type="text" name="encryptionKey" v-model="encryptionKey" placeholder="Key" class="w-80 h-10 mb-2 px-2 py-1 border-[1px] border-gray-400 rounded-lg shadow-sm"/>
        <div class="flex flex-row items-center">
          <GenericButton type="light-blue" :callback="connectToNuc" class="mr-4" :disabled="connectionState === 'loading'">Connect</GenericButton>
          <ConnectingSpinner :state="connectionState" device-name="NUC" />
        </div>
      </div>
    </div>
  </div>

  <div v-if="connectionState === 'success'" class="flex flex-col">
    <!--    Cbus    -->
    <div class="w-full border-2 border-gray-200 rounded-xl p-4 flex flex-col mb-4">
      <div class="flex flex-row items-center h-full">
        <StatusIcon :status="fullStore.getCbusConnection ? 'green' : 'yellow'" class="w-16 h-16 mr-8">
          <template v-slot:icon="{ fill }">
            <CbusSvg :fill="fill" />
          </template>
        </StatusIcon>
        <span class="text-lg font-semibold col-span-4">{{ fullStore.getCbusConnection ? 'C-Bus is connected' : 'C-Bus is not connected' }}</span>
      </div>
    </div>

    <!--    Stations    -->
    <div class="w-full border-2 border-gray-200 rounded-xl p-4 flex flex-col mb-4">
      <div class="flex flex-row items-center h-full">
        <StatusIcon :status="fullStore.stations.length === fullStore.stations.filter(station => station.details).length ? 'green' : 'red'" class="w-16 h-16 mr-8">
          <template v-slot:icon="{ fill }">
            <ComputerSvg :fill="fill" />
          </template>
        </StatusIcon>
        <span class="text-lg font-semibold col-span-4">Connected to {{ fullStore.stations.filter(station => station.details).length }}/{{ fullStore.stations.length }} stations</span>
      </div>
    </div>
  </div>
</template>
