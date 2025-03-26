<script setup lang="ts">
import * as CONSTANT from "../../assets/constants";
import StatusIcon from "../../components/statuses/StatusIcon.vue";
import GenericButton from "../../components/buttons/GenericButton.vue";
import ConnectingSpinner from "../../components/loading/ConnectingSpinner.vue";
import ComputerSvg from "../../assets/icons/vue/ComputerSvg.vue";
import TheCbus from "./TheCbus.vue";
import WakeDevice from "../../components/wol/WakeDevice.vue";
import WakeStations from "../../components/wol/WakeStations.vue";
import { useStateStore } from "../../store/stateStore";
import { storeToRefs } from "pinia";
import { computed, onBeforeMount, onMounted, ref, watch, watchEffect } from "vue";

const stateStore = useStateStore();

//Determine which pinia store to use for the component
let tempStore = stateStore.getStore;

const { connected } = storeToRefs(tempStore);
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
    //@ts-ignore
    api.ipcRenderer.send(CONSTANT.CHANNEL.HELPER_CHANNEL, {
      channelType: CONSTANT.CHANNEL.TCP_COMMAND_CHANNEL,
      command: "stop"
    });
  }
});

async function connectToNuc() {
  connectionState.value = 'loading'
  stateStore.key = encryptionKey.value;
  stateStore.nucAddress = nucAddress.value;
  tempStore.connected = false

  //@ts-ignore
  api.ipcRenderer.send(CONSTANT.CHANNEL.HELPER_CHANNEL, {
    channelType: CONSTANT.CHANNEL.TCP_COMMAND_CHANNEL,
    key: stateStore.key,
    address: stateStore.ipAddress,
    port: stateStore.serverPort,
    command: "start"
  });

  useStateStore().sendMessage({
    action: CONSTANT.ACTION.CONNECT,
    actionData: {}
  });

  setTimeout(() => {
    if (connectionState.value === 'loading') {
      connectionState.value = 'failed'
    }
  }, 10000)
}

async function retryStationConnection() {
  tempStore.stations.forEach(station => {
    tempStore.sendStationMessage(station.id, {
      action: CONSTANT.ACTION.CONNECT_STATION,
      actionData: {
        expectedStationId: station.id
      }
    })
  })
}

//The expected mac address of the Stations
const macAddresses = computed(() => {
  return tempStore.stations.map(station => ({ mac: station.expectedDetails.macAddress }));
});

/**
 * The precedent for if a user can continue to the next segment.
 */
const calcProceed = () => {
  stateStore.canProceed = tempStore.connected;
};

/**
 * Watch for any changes in the calcProceed to re-evaluate if the user can continue.
 */
watchEffect(() => {
  calcProceed();
});

/**
 * Determine if the necessary values are currently inputted to allow a user to progress with the tool.
 * If not, block the 'Next' button on the BottomBar until they are.
 */
onBeforeMount(() => {
  calcProceed();
});
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
      <span v-if="connectionState === 'success'">{{ stateStore.nucAddress }}</span>
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

  <div v-if="connectionState !== 'success'">
    <WakeDevice title="Attempt to wake the NUC" button-title="Wake NUC" device-name="NUC" />
  </div>

  <div v-if="connectionState === 'success'" class="flex flex-col">
    <!--    C-bus    -->
    <TheCbus v-if="stateStore.toolType !== CONSTANT.TOOL.EXPERIENCE_LAUNCHER"/>

    <!--    Stations    -->
    <div class="w-full border-2 border-gray-200 rounded-xl p-4 flex flex-col mb-4">
      <div class="flex flex-row items-center h-full justify-between">
        <div class="flex flex-row items-center h-full">
          <StatusIcon :status="tempStore.stations.length === tempStore.stations.filter(station => station.details).length ? 'green' : 'red'" class="w-16 h-16 mr-8">
            <template v-slot:icon="{ fill }">
              <ComputerSvg :fill="fill" />
            </template>
          </StatusIcon>
          <span class="text-lg font-semibold col-span-4">Connected to {{
              tempStore.stations.filter(station => station.details).length
            }}/{{ tempStore.stations.length }} stations</span>
        </div>
        <div class="cursor-pointer hover:text-gray-500" v-if="tempStore.stations.length !== tempStore.stations.filter(station => station.details).length"
          @click="retryStationConnection">
          Retry
        </div>
      </div>
    </div>

    <!--    Wake Stations    -->
    <WakeStations v-if="tempStore.stations.length !== tempStore.stations.filter(station => station.details).length" :mac-addresses="macAddresses" />
  </div>
</template>
