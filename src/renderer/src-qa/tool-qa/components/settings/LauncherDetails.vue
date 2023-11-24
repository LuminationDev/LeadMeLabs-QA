<script setup lang="ts">
import { useStateStore } from "../../store/stateStore";
import * as CONSTANT from "../../../../constants";
const stateStore = useStateStore();

/**
 * Send a message to the backend to recollect the details of the launcher. This may be required when the computer
 * switches internet connection so the user does not need to restart the program for the new IP address.
 */
const refreshDetails = () => {
  stateStore.version = '';
  stateStore.ipAddress = '';

  //@ts-ignore
  api.ipcRenderer.send(CONSTANT.CHANNEL.HELPER_CHANNEL, {
    channelType: CONSTANT.CHANNEL.REFRESH_LAUNCHER_DETAILS
  });
}
</script>

<template>
  <div class="flex flex-col">
    <div class="flex flex-row justify-between">
      <div class="font-bold mb-2">Details</div>
      <div v-on:click="refreshDetails"
        class="w-32 h-8 mb-5 flex items-center justify-center rounded-lg bg-blue-500 text-white cursor-pointer hover:bg-blue-400">
        Refresh
      </div>
    </div>

    <div class="flex flex-row">
      <div class="w-40 ml-2 mb-2">Version Number:</div>
      <div>{{stateStore.version}}</div>
    </div>

    <div class="flex flex-row">
      <div class="w-40 ml-2">Local IP Address:</div>
      <div>{{stateStore.ipAddress ?? 'Unable to determine IP Address'}}</div>
    </div>
    <hr class="my-4">
  </div>
</template>
