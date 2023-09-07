<script setup lang="ts">
import * as CONSTANT from "@renderer/assets/constants";
import { useStateStore } from "@renderer/store/stateStore";
import { ref } from "vue";

const stateStore = useStateStore();

const address = ref(stateStore.nucAddress);

/**
 * Request the NUC to send over the station_list.json
 */
const requestAppliancesFromNuc = () => {
  //Save the IP address as the NUC address
  stateStore.nucAddress = address.value;

  //@ts-ignore
  api.ipcRenderer.send(CONSTANT.CHANNEL.HELPER_CHANNEL, {
    channelType: CONSTANT.CHANNEL.TCP_CLIENT_CHANNEL,
    key: stateStore.key,
    address: address.value,
    port: 55556,
    data: CONSTANT.MESSAGE.REQUEST_APPLIANCE_LIST + stateStore.getServerDetails
  });
}
</script>

<template>
  <div class="flex flex-col">
    <input v-model="address" class="bg-gray-100 w-56 h-8 mb-4 px-4 rounded" placeholder="NUC IP address"/>
    <div class="flex flex-row">
      <div v-on:click="requestAppliancesFromNuc"
           class="w-32 h-8 mb-5 flex items-center justify-center rounded-lg"
           :class="{
                      'bg-blue-500 text-white cursor-pointer hover:bg-blue-400': address.length > 0,
                      'bg-gray-300 text-white': address.length === 0,
                   }">
        Collect
      </div>
    </div>
  </div>
</template>
