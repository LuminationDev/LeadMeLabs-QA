<script setup lang="ts">
import * as CONSTANT from "../../assets/constants";
import GenericButton from "../buttons/GenericButton.vue";
import ConnectingSpinner from "../loading/ConnectingSpinner.vue";
import { ref } from "vue";

interface MacAddress {
  mac: string;
}

const props = defineProps({
  title: {
    type: String,
    default: "Wake Devices"
  },
  deviceName: {
    type: String,
    default: "device"
  },
  macAddresses: {
    type: Array<string>,
  },
  disabled: {
    type: Boolean,
    required: true
  }
});

const loading = ref("unstarted");
const error = ref("");

const parseMacAddresses = (macList: MacAddress[]): boolean => {
  let correct = true;
  macList.forEach(entry => {
    const trimmedMac = entry.mac.trim();
    if (!isValidMacAddress(trimmedMac)) {
      error.value += `Invalid MAC address: ${trimmedMac} `;
      correct = false;
    }
  });

  return correct;
}

const isValidMacAddress = (mac: string): boolean => {
  // Regular expression to match MAC address format
  const macRegex = /^([0-9A-Fa-f]{2}[:-]?){5}([0-9A-Fa-f]{2})$/;
  return macRegex.test(mac);
}

const sendWakeOnLan = () => {
  error.value = "";
  if(!parseMacAddresses(props.macAddresses)) {
    return;
  }

  loading.value = "wol";

  //@ts-ignore
  api.ipcRenderer.send(CONSTANT.CHANNEL.DEVICE_CHANNEL, {
    channelType: CONSTANT.CHANNEL.WAKE_ON_LAN,
    macAddresses: props.macAddresses
  });

  setTimeout(() => {
    loading.value = "unstarted";
  }, 2000)
};
</script>

<template>
  <div class="flex flex-col">
    <div class="flex flex-row items-center">
      <GenericButton class="w-36 mr-2" type="light-blue" :callback="sendWakeOnLan" :disabled="disabled">{{title}}</GenericButton>
      <ConnectingSpinner v-if="loading !== 'unstarted'" :state="loading" :device-name="deviceName" />
    </div>

    <p v-if="error" class="text-red-500 text-sm mt-2">{{error}}</p>
  </div>
</template>
