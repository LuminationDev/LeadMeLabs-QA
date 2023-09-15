<script setup lang="ts">
import Description from "@renderer/components/checks/Description.vue";
import GenericLayout from "@renderer/components/checks/GenericLayout.vue";
import { useRoute } from "vue-router";
import {onMounted, ref} from "vue";
import * as CONSTANT from "@renderer/assets/constants";
import {useStateStore} from "../../store/stateStore";
import {useFullStore} from "../../store/fullStore";
import {START_AUTO_TEST} from "../../assets/constants/_message";

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
      Getting started, put in your details pls
      <!--TODO replace with the proper section below when design is ready-->
      <!--<p class="text-lg text-black mb-3">Quick Station Check</p>-->
      <img alt="title" src="../../assets/deleteLater/flcTitle.png" class="w-96"/>
    </template>

    <template v-slot:content>
      <!--TODO replace with the proper section when design is ready-->
      <!--Text describing the process?-->
      <img alt="title" src="../../assets/deleteLater/placeholder.png" class="w-full mb-4"/>

      <!--Set the station parameters-->
      <Description v-if="route.name === 'full-description'"/>

      Please enter the NUC address and encryption key and then connect
      <input type="text" name="nucAddress" v-model="nucAddress" class="bg-red-500" />
      <input type="text" name="encryptionKey" v-model="encryptionKey" class="bg-red-500" />

      <button @click="connectToNuc">Connect</button>

      {{ fullStore.connected }}
      <div v-if="fullStore.connected">
        SUccessfully connected<br/>
        There are {{ fullStore.ApplianceList.length }} appliances<br/>
        There are {{ fullStore.StationList.length }} stations<br/>
        {{ fullStore.StationList.filter(station => station.status === "On").length }} stations are on and ready<br/>
        <button @click="startTest">Start Test</button>
        <div class="flex flex-col">
          <div v-for="check in fullStore.qaChecks" :key="check.id" class="flex flex-row">
            <span :class="check.passedStatus === 'passed' ? 'bg-green-500' : 'bg-red-500'">{{ check.passedStatus }}</span>
            <span>{{ check.id }}</span>
            <span>{{ check.message }}</span>
          </div>
        </div>
      </div>

    </template>
  </GenericLayout>
</template>
