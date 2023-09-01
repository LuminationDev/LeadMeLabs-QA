<script setup lang="ts">
import { ref } from "vue";
import * as CONSTANT from "../../../assets/constants";
import { useStateStore } from "../../../store/stateStore";
import { storeToRefs } from "pinia";

const stateStore = useStateStore();
const { PortDetails } = storeToRefs(stateStore);

const address = ref("");
const port = ref();
const CheckPort = () => {
  //@ts-ignore
  api.ipcRenderer.send(CONSTANT.CHANNEL.HELPER_CHANNEL, {
    channelType: CONSTANT.CHANNEL.NETWORK_PORT_CHANNEL,
    address: address.value,
    port: port.value
  });
}
</script>

<template>
  <div class="flex flex-col">
    <div class="mb-4">
      Response: {{PortDetails}}
    </div>

    <input v-model="address" class="bg-gray-100 w-56 h-8 mb-4 px-4 rounded" placeholder="Destination IP address"/>
    <input v-model="port" type="number" class="bg-gray-100 w-56 h-8 mb-4 px-4 rounded" placeholder="Destination port"/>
    <div v-on:click="CheckPort"
         class="w-32 h-8 flex items-center justify-center rounded-lg"
         :class="{
                  'bg-blue-500 text-white cursor-pointer hover:bg-blue-400': address.length > 0 && port != null,
                  'bg-gray-300 text-white': address.length === 0 || port === null,
               }">
      Check
    </div>
  </div>
</template>
