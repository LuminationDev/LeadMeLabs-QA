<script setup lang="ts">
import { RouterView } from "vue-router";
import * as CONSTANT from "../assets/constants";

/**
 * Backend listener, any messages from the node backend are directed to this listener and then
 * triaged for the appropriate follow through.
 */
//@ts-ignore
api.ipcRenderer.on('backend_message', (event, info) => {
  switch(info.channelType) {
    case CONSTANT.CHANNEL.APPLICATION_CHANNEL:
      console.log(info); //Software version number
      break;

    default:
      console.log(info);
      break;
  }
})
</script>

<template>
  <RouterView />
</template>

<style scoped>

</style>
