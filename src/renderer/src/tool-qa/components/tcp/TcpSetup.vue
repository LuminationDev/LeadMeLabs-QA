<script setup lang="ts">
import TcpServer from "@renderer/tool-qa/components/tcp/TcpServer.vue";
import TcpKey from "@renderer/tool-qa/components/tcp/TcpKey.vue";
import { useStateStore } from "@renderer/tool-qa/store/stateStore";
import { onBeforeMount, watchEffect } from "vue";

const stateStore = useStateStore();

/**
 * The precedent for if a user can continue to the next segment.
 */
const calcProceed = () => {
  stateStore.canProceed = stateStore.isServerRunning;
}

/**
 * Watch for any changes in the calcProceed to re-evaluate if the user can continue.
 */
watchEffect(() => {
  calcProceed();
});

/**
 * Determine if the necessary values are currently inputted to allow a user to progress with the tool.
 * If not, block the 'Next' button on the BottomBar until they are.
 */
onBeforeMount(() => {
  calcProceed();
});
</script>

<template>
  <div class="w-full h-auto mb-4 flex flex-col">
    <TcpServer />
  </div>
</template>
