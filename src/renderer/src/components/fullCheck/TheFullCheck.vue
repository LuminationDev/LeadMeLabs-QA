<script setup lang="ts">
import Description from "@renderer/components/checks/Description.vue";
import GenericLayout from "@renderer/components/checks/GenericLayout.vue";
import { useRoute } from "vue-router";
import {onMounted, ref} from "vue";
import * as CONSTANT from "@renderer/assets/constants";
import {useStateStore} from "../../store/stateStore";
import {useFullStore} from "../../store/fullStore";
import {START_AUTO_TEST} from "../../assets/constants/_message";
import GenericButton from "@renderer/components/_generic/buttons/GenericButton.vue";

const route = useRoute();

const stateStore = useStateStore();
const fullStore = useFullStore();

const nucAddress = ref("")
const encryptionKey = ref("")

async function connectToNuc() {
  stateStore.key = encryptionKey.value

  //@ts-ignore
  api.ipcRenderer.send(CONSTANT.CHANNEL.HELPER_CHANNEL, {
    channelType: CONSTANT.CHANNEL.TCP_COMMAND_CHANNEL,
    key: stateStore.key,
    address: stateStore.ipAddress,
    port: stateStore.serverPort,
    command: "start"
  });

  console.log(CONSTANT.MESSAGE.CONNECT + stateStore.getServerDetails)
  api.ipcRenderer.send(CONSTANT.CHANNEL.HELPER_CHANNEL, {
    channelType: CONSTANT.CHANNEL.TCP_CLIENT_CHANNEL,
    key: encryptionKey.value,
    address: nucAddress.value,
    port: 55556,
    data: CONSTANT.MESSAGE.CONNECT + stateStore.getServerDetails
  });
}

function startTest() {
  api.ipcRenderer.send(CONSTANT.CHANNEL.HELPER_CHANNEL, {
    channelType: CONSTANT.CHANNEL.TCP_CLIENT_CHANNEL,
    key: encryptionKey.value,
    address: nucAddress.value,
    port: 55556,
    data: CONSTANT.MESSAGE.START_AUTO_TEST + stateStore.getServerDetails
  });
}

onMounted(() => {

})

</script>

<template>
  <GenericLayout>
    <template v-slot:title>
      <p class="text-xl font-semibold text-black mb-3">Full Lab Check</p>
    </template>

    <template v-slot:content>
      <!--Set the station parameters-->
      <Description v-if="route.name === 'full-description'"/>

      Please enter the NUC address and encryption key and then connect.

      <div class="flex flex-col">
        <input type="text" name="nucAddress" v-model="nucAddress" placeholder="192.168.1.100" class="w-80 h-10 my-2 px-2 py-1 border-[1px] border-gray-400 rounded-lg shadow-sm"/>
        <input type="text" name="encryptionKey" v-model="encryptionKey" placeholder="Key" class="w-80 h-10 mb-2 px-2 py-1 border-[1px] border-gray-400 rounded-lg shadow-sm"/>

        <GenericButton type="primary" :callback="connectToNuc">Connect</GenericButton>

        <div class="flex flex-row">
          <span class="font-semibold mr-2">Server is connected:</span>
          {{ fullStore.connected }}
        </div>
      </div>

      <div v-if="fullStore.connected" class="flex flex-col">
        <hr class="my-5">

        Successfully connected<br/>
        There are {{ fullStore.ApplianceList.length }} appliances<br/>
        There are {{ fullStore.StationList.length }} stations<br/>
        {{ fullStore.StationList.filter(station => station.status === "On").length }} stations are on and ready<br/>

        <GenericButton type="primary" :callback="startTest">Start Test</GenericButton>

        <div class="flex flex-col">
          <div v-for="(station, index) in fullStore.Stations" :key="index" class="flex flex-col">
            <div v-for="check in station.qaChecks" :key="check.id">
              <span :class="check.passedStatus === 'passed' ? 'bg-green-500' : 'bg-red-500'">{{ check.passedStatus }}</span>
              <span>{{ check.id }}</span>
              <span>{{ check.message }}</span>
            </div>
            <div>
              {{ station.details }}
            </div>
            <div>
              {{ station.expectedDetails }}
            </div>
            <div v-for="check in station.getComputedChecks()" :key="check.id">
              <span :class="check.passedStatus === 'passed' ? 'bg-green-500' : 'bg-red-500'">{{ check.passedStatus }}</span>
              <span>{{ check.id }}</span>
              <span>{{ check.message }}</span>
            </div>

          </div>
        </div>
      </div>

    </template>
  </GenericLayout>
</template>
