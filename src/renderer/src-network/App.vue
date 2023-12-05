<script setup lang="ts">
import { RouterView } from "vue-router";
import { listeners } from "./apiListeners";
import { onBeforeMount } from "vue";
import { initialise } from "./apiListeners";

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
  <RouterView />
</template>
