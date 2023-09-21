<script setup lang="ts">
import { ref } from 'vue';
import * as CONSTANT from '../../../assets/constants';
import { useStateStore } from '../../store/stateStore';
import TcpKey from "@renderer/tool-qa/components/tcp/TcpKey.vue";

const stateStore = useStateStore();

//Server details
const serverAddress = ref(stateStore.ipAddress);
const serverPort = ref(stateStore.serverPort);
const key = ref("");

const startServer = () => {
  //Save the server details for future use
  stateStore.serverPort = serverPort.value;

  //@ts-ignore
  api.ipcRenderer.send(CONSTANT.CHANNEL.HELPER_CHANNEL, {
    channelType: CONSTANT.CHANNEL.TCP_COMMAND_CHANNEL,
    key: stateStore.key,
    address: serverAddress.value,
    port: serverPort.value,
    command: "start"
  });
}

const stopServer = () => {
  //@ts-ignore
  api.ipcRenderer.send(CONSTANT.CHANNEL.HELPER_CHANNEL, {
    channelType: CONSTANT.CHANNEL.TCP_COMMAND_CHANNEL,
    command: "stop"
  });
}
</script>

<template>
  <div class="flex flex-col">
    <div class="mb-4">
      The server is currently: {{stateStore.isServerRunning ? "Running" : "Offline"}}
    </div>

    <TcpKey />

    <!--IP Address cannot be changed for a local server-->
    <input :disabled="true" v-model="serverAddress" class="bg-gray-100 w-56 h-8 mb-4 px-4 rounded" placeholder="Server IP address"/>
    <input v-model="serverPort" class="bg-gray-100 w-56 h-8 mb-4 px-4 rounded" placeholder="Server port"/>

    <div class="flex flex-row">
      <div v-if="!stateStore.isServerRunning" v-on:click="startServer" class="w-32 h-8 flex items-center justify-center bg-blue-500 text-white rounded-lg cursor-pointer hover:bg-blue-400">
        Start Server
      </div>
      <div v-else v-on:click="stopServer" class="w-32 h-8 flex items-center justify-center bg-red-500 text-white rounded-lg cursor-pointer hover:bg-red-400">
        Stop Server
      </div>
    </div>
  </div>
</template>
