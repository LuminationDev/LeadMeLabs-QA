<script setup lang="ts">
import GenericButton from "@renderer/tool-qa/components/_generic/buttons/GenericButton.vue";
import AutoStationCheck from "@renderer/tool-qa/components/quickCheck/AutoStationCheck.vue";
import { useRoute, useRouter } from "vue-router";
import { computed } from "vue";
import { useStateStore } from "@renderer/tool-qa/store/stateStore";
import { useQuickStore } from "@renderer/tool-qa/store/quickStore";
import * as CONSTANT from "@renderer/assets/constants";
import TcpKey from "@renderer/tool-qa/components/tcp/TcpKey.vue";

const stateStore = useStateStore();
const quickStore = useQuickStore();
const router = useRouter();
const route = useRoute();

const canStart = computed(() => {
  return quickStore.stationAddress.length > 0;
});

const startChecks = async () => {
  //@ts-ignore
  api.ipcRenderer.send(CONSTANT.CHANNEL.HELPER_CHANNEL, {
    channelType: CONSTANT.CHANNEL.TCP_COMMAND_CHANNEL,
    key: stateStore.key,
    address: stateStore.ipAddress,
    port: stateStore.serverPort,
    command: "start"
  });

  await new Promise(resolve => setTimeout(resolve, 2000));

  await router.push('/check/quick/auto');
}
</script>

<template>
  <div class="w-full h-auto my-4 flex flex-col">
    <p class="text-xl font-semibold text-black mb-3">Quick Station Check</p>

    <hr class="my-4">

    <div v-if="route.name === 'quick-setup'" class="w-full h-auto mb-4 flex flex-col">
      <!--Text describing the process-->
      <p class="text-base text-black mb-10">
        Please enter the encryption key and IP address for the Station that is going to be checked.
      </p>

      <!--Start up the TCP server-->
      <TcpKey />

      <hr class="mb-4">

      <!--Enter the Station IP address-->
      <input v-model="quickStore.stationAddress" class="bg-gray-100 w-56 h-8 mb-6 px-4 rounded" placeholder="Station IP address"/>

      <GenericButton type="primary" :callback="startChecks" :disabled="!canStart">
        Start Checks
      </GenericButton>
    </div>

    <!--Run through each check type-->
    <AutoStationCheck v-if="route.name === 'quick-auto'"/>
  </div>
</template>
