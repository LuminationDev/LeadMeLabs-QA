<script setup lang="ts">
import TcpSetup from "@renderer/components/tcp/TcpSetup.vue";
import GenericButton from "@renderer/components/_generic/buttons/GenericButton.vue";
import AutoStationCheck from "@renderer/components/quickCheck/AutoStationCheck.vue";
import { useRoute, useRouter } from "vue-router";
import { computed } from "vue";
import { useStateStore } from "@renderer/store/stateStore";
import { useQuickStore } from "@renderer/store/quickStore";

const stateStore = useStateStore();
const quickStore = useQuickStore();
const router = useRouter();
const route = useRoute();

const canStart = computed(() => {
  return stateStore.isServerRunning && quickStore.stationAddress.length > 0;
});
</script>

<template>
  <div class="w-full h-auto my-4 flex flex-col">
    <p class="text-xl font-semibold text-black mb-3">Quick Station Check</p>

    <hr class="my-4">

    <div v-if="route.name === 'quick-setup'" class="w-full h-auto mb-4 flex flex-col">
      <!--Text describing the process-->
      <p class="text-base text-black mb-10">Describe what the following section does and what tools/items are required to complete it?</p>

      <!--Start up the TCP server-->
      <TcpSetup />

      <hr class="my-4">

      <!--Enter the Station IP address-->
      <input v-model="quickStore.stationAddress" class="bg-gray-100 w-56 h-8 mb-6 px-4 rounded" placeholder="Station IP address"/>

      <GenericButton type="primary" :callback="() => router.push('/check/quick/auto')" :disabled="!canStart">
        Start Checks
      </GenericButton>
    </div>

    <!--Run through each check type-->
    <AutoStationCheck v-if="route.name === 'quick-auto'"/>
  </div>
</template>
