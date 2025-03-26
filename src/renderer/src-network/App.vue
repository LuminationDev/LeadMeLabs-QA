<script setup lang="ts">
import { RouterView } from "vue-router";
import { listeners } from "./apiListeners";
import { onBeforeMount } from "vue";
import { initialise } from "./apiListeners";
import welcome from '../assets/images/sidebar-welcome.png';
/**
 * Backend listener, any messages from the node backend are directed to this listener and then
 * triaged for the appropriate follow through.
 */
//@ts-ignore
api.ipcRenderer.on('backend_message', (event, info) => {
  listeners(info);
});

onBeforeMount(() => {
  initialise();
});
</script>

<template>
  <div class="flex flex-row w-full justify-between max-h-[95vh] h-[95vh]">
    <div class="flex-col bg-white w-52 rounded-3xl">
      <div class="flex flex-col h-full w-52 overflow-hidden scrollbar-hide">
        <div class="w-full h-full overflow-y-hidden border-t-gray-100 border-t-2">
          <img class="h-full w-56 object-cover rounded-3xl" :src="welcome" alt="LeadMe Labs Logo" />
        </div>
      </div>
    </div>

    <div class="content flex-col bg-white ml-2 rounded-xl w-full min-w-[30rem] justify-between overflow-auto pt-0">
      <RouterView class="px-4" />
    </div>
  </div>
</template>

<style>
@import '../assets/css/styles.css';
</style>
