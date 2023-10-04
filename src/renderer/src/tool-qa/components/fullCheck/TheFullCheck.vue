<script setup lang="ts">
import GenericLayout from "@renderer/tool-qa/components/checks/GenericLayout.vue";
import { useRoute } from "vue-router";
import {computed, ref, watch} from "vue";
import * as CONSTANT from "@renderer/assets/constants";
import { useStateStore } from "../../store/stateStore";
import { useFullStore } from "../../store/fullStore";
import ConnectingSpinner from "../_generic/loading/ConnectingSpinner.vue";
import {storeToRefs} from "pinia";
import GenericButton from "../../../tool-config/components/GenericButton.vue";
import StatusIcon from "../_generic/StatusIcon.vue";
import ComputerSvg from "../../../assets/icons/ComputerSvg.vue";

const route = useRoute();

const stateStore = useStateStore();
const fullStore = useFullStore();

const { connected } = storeToRefs(fullStore)

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

watch(connectionState, (newValue) => {
  if (newValue === 'failed') {
    api.ipcRenderer.send(CONSTANT.CHANNEL.HELPER_CHANNEL, {
      channelType: CONSTANT.CHANNEL.TCP_COMMAND_CHANNEL,
      command: "stop"
    });
  }
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
const show = ref(false)
</script>

<template>
  <GenericLayout>
    <template v-slot:title>
      <p class="text-xl font-semibold text-black mb-3">Full Lab Check</p>
    </template>

    <template v-slot:content>
      Please enter the NUC address and encryption key and then connect.

      <div class="w-full border-2 border-gray-200 rounded-xl p-4 flex flex-col">
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
            <label for="encryptionKey" class="text-sm font-semibold">NUC address</label>
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
        <div class="w-full border-2 border-gray-200 rounded-xl p-4 flex flex-col">
          <div class="flex flex-row items-center h-full">
            <StatusIcon :status="fullStore.getCbusConnection === 'Connection available' ? 'green' : 'yellow'" class="w-16 h-16 mr-8">
              <template v-slot:icon="{ fill }">
                <ComputerSvg :fill="fill" />
              </template>
            </StatusIcon>
            <span class="text-lg font-semibold col-span-4">{{ fullStore.getCbusConnection === 'Connection available' ? 'C-Bus is connected' : 'C-Bus is not connected' }}</span>
          </div>
        </div>

        <!--    Stations    -->
        <div class="w-full border-2 border-gray-200 rounded-xl p-4 flex flex-col">
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
          <div class="flex flex-row items-center h-full" v-for="tablet in fullStore.tablets" :key="tablet.ipAddress">
            <StatusIcon :status="tablet.connecting ? 'blue' : connected ? 'green' : 'red'" class="w-16 h-16 mr-8">
              <template v-slot:icon="{ fill }">
                <ComputerSvg :fill="fill" />
              </template>
            </StatusIcon>
            <span>{{ tablet.ipAddress }}</span>
            <span class="text-lg font-semibold col-span-4">{{ tablet.connecting ? 'Connecting to tablet' : connected ? 'Connected' : 'Not connected' }}</span>
          </div>
          <input type="text" name="tabletIp" v-model="tabletIp" placeholder="192.168.1.99" class="w-80 h-10 my-2 px-2 py-1 border-[1px] border-gray-400 rounded-lg shadow-sm"/>
          <GenericButton type="primary" :callback="connectToTablet">Connect</GenericButton>
        </div>
      </div>
    </template>
  </GenericLayout>
</template>