<script setup lang="ts">
import GenericLayout from "@renderer/tool-qa/components/checks/GenericLayout.vue";
import { useRoute } from "vue-router";
import {computed, onMounted, ref, watch} from "vue";
import * as CONSTANT from "@renderer/assets/constants";
import { useStateStore } from "../../store/stateStore";
import { useFullStore } from "../../store/fullStore";
import ConnectingSpinner from "../_generic/loading/ConnectingSpinner.vue";
import {storeToRefs} from "pinia";
import GenericButton from "../../../tool-config/components/GenericButton.vue";
import StatusIcon from "../_generic/StatusIcon.vue";
import ComputerSvg from "../../../assets/icons/ComputerSvg.vue";
import CbusSvg from "../../../assets/icons/CbusSvg.vue";
import TabletSvg from "../../../assets/icons/TabletSvg.vue";

const route = useRoute();

const stateStore = useStateStore();
const fullStore = useFullStore();

const { connected, connectedTabletCount } = storeToRefs(fullStore)

const nucAddress = ref("")
const tabletIp = ref("")
const encryptionKey = ref("")


const connectionState = ref("unstarted")
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
})


watch(connectionState, (newValue) => {
  if (newValue === 'failed') {
    api.ipcRenderer.send(CONSTANT.CHANNEL.HELPER_CHANNEL, {
      channelType: CONSTANT.CHANNEL.TCP_COMMAND_CHANNEL,
      command: "stop"
    });
  }
})

watch(connectedTabletCount, (newValue) => {
  toggleShowTabletForm.value = false
})

const tabletConnectionState = computed(() => {
  if (fullStore.tablets.length < 1) {
    return 'unstarted'
  }
  const tablet = fullStore.tablets[fullStore.tablets.length - 1]
  if (tablet.connecting) {
    return 'loading'
  }
  return tablet.connected ? 'unstarted' : 'failed' // unstarted because it's already in the list in this case
})

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

async function connectToTablet() {
  fullStore.addUnconnectedTablet(tabletIp.value)
  fullStore.sendMessage({
    action: CONSTANT.ACTION.CONNECT_TABLET,
    actionData: {
      tabletIp: tabletIp.value
    }
  })
  tabletIp.value = ''
}

function startTest() {
  const groupsToRun = fullStore.processQaList()
  console.log(groupsToRun)
  groupsToRun.forEach(group => {
    fullStore.startQa(group)
    fullStore.sendMessage({
      action: CONSTANT.ACTION.RUN_STATION_GROUP,
      actionData: {
        group,
        stationIds: ['all']
      }
    })
  })
  fullStore.sendMessage({
    action: CONSTANT.ACTION.RUN_TABLET_ALL,
    actionData: {
      tabletIpAddresses: [tabletIp.value]
    }
  })
}

const toggleShowTabletForm = ref(false)
const showTabletForm = computed(() => {
  if (fullStore.connectedTabletCount < 1) {
    return true
  }
  return toggleShowTabletForm.value
})
</script>

<template>
  <GenericLayout>
    <template v-slot:title>
      <p class="text-xl font-semibold text-black mb-3">Full Lab Check</p>
    </template>

    <template v-slot:content>
      Please enter the NUC address and encryption key and then connect.

      <div class="w-full border-2 border-gray-200 rounded-xl p-4 flex flex-col mb-4">
        <div class="flex flex-row items-center h-full">
          <StatusIcon :status="connectionState" class="w-16 h-16 mr-8">
            <template v-slot:icon="{ fill }">
              <ComputerSvg :fill="fill" />
            </template>
          </StatusIcon>
          <span class="text-lg font-semibold col-span-4">{{ connectionState !== 'success' ? 'Connect to your NUC' : 'NUC is connected' }}</span>
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
            <StatusIcon :status="fullStore.getCbusConnection === 'Connection available' ? 'green' : 'yellow'" class="w-16 h-16 mr-8">
              <template v-slot:icon="{ fill }">
                <CbusSvg :fill="fill" />
              </template>
            </StatusIcon>
            <span class="text-lg font-semibold col-span-4">{{ fullStore.getCbusConnection === 'Connection available' ? 'C-Bus is connected' : 'C-Bus is not connected' }}</span>
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

        <div class="w-full border-2 border-gray-200 rounded-xl p-4 flex flex-col">
          <div class="flex flex-row items-center h-full" v-if="fullStore.connectedTabletCount === 0">
            <StatusIcon status="grey" class="w-16 h-16 mr-8">
              <template v-slot:icon="{ fill }">
                <TabletSvg :fill="fill" />
              </template>
            </StatusIcon>
            <span class="text-lg font-semibold col-span-4">Connect to tablets</span>
          </div>
          <div class="flex flex-row items-center h-full" v-else>
            <StatusIcon status="green" class="w-16 h-16 mr-8">
              <template v-slot:icon="{ fill }">
                <TabletSvg :fill="fill" />
              </template>
            </StatusIcon>
            <div class="flex flex-row justify-between items-center w-full">
              <div class="text-lg font-semibold">
                {{ fullStore.connectedTabletCount }} tablet is connected
              </div>
              <GenericButton :callback="() => {toggleShowTabletForm = !toggleShowTabletForm}"><span class="text-blue-700 font-semibold">{{ toggleShowTabletForm ? 'Close' : 'Connect another tablet' }}</span></GenericButton>
            </div>
          </div>
          <div class="ml-24 flex flex-col" v-if="showTabletForm">
            <label for="tabletIp" class="text-sm font-semibold">Tablet IP address</label>
            <input type="text" name="tabletIp" v-model="tabletIp" placeholder="192.168.1.99" class="w-80 h-10 my-2 px-2 py-1 border-[1px] border-gray-400 rounded-lg shadow-sm"/>
            <div class="flex flex-row items-center">
              <GenericButton class="mr-2" type="light-blue" :callback="connectToTablet">Connect</GenericButton>
              <ConnectingSpinner :state="tabletConnectionState" device-name="tablet" />
            </div>
          </div>
        </div>
      </div>
    </template>
  </GenericLayout>
</template>