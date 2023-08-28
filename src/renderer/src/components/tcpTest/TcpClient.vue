<script setup lang="ts">
import { ref } from 'vue';
import * as CONSTANT from '../../assets/constants';
import { useStateStore } from '../../store/stateStore';

const stateStore = useStateStore();

//Socket client details
const message = ref("");
const clientAddress = ref("");
const clientPort = ref("");

const sendHello = () => {
  if(message.value.length === 0) {
    return;
  }

  //@ts-ignore
  api.ipcRenderer.send(CONSTANT.CHANNEL.HELPER_CHANNEL, {
    channelType: CONSTANT.CHANNEL.TCP_CLIENT_CHANNEL,
    key: stateStore.key,
    address: clientAddress.value,
    port: clientPort.value,
    data: message.value
  });
}
</script>

<template>
  <div class="flex flex-col">
    <input v-model="message" class="bg-gray-100 w-56 h-8 mb-4 px-4 rounded" placeholder="Message to send"/>
    <input v-model="clientAddress" class="bg-gray-100 w-56 h-8 mb-4 px-4 rounded" placeholder="Destination IP address"/>
    <input v-model="clientPort" class="bg-gray-100 w-56 h-8 mb-4 px-4 rounded" placeholder="Destination port"/>
    <div v-on:click="sendHello"
         class="w-32 h-8 flex items-center justify-center rounded-lg"
         :class="{
                  'bg-blue-500 text-white cursor-pointer hover:bg-blue-400': message.length > 0,
                  'bg-gray-300 text-white': message.length === 0,
               }">
      Send
    </div>
  </div>
</template>
