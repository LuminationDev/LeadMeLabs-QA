<script setup lang="ts">
import StationRequest from "@renderer/components/quickCheck/TheStation/StationRequest.vue";
import TcpSetup from "@renderer/components/tcp/TcpSetup.vue";
import GenericLayout from "@renderer/components/checks/GenericLayout.vue";
import { useRoute } from "vue-router";

const route = useRoute();
</script>

<template>
  <GenericLayout>
    <template v-slot:title>
      <p class="text-lg text-black mb-3">Station Check</p>
    </template>

    <template v-slot:content>
      <!--Start up the TCP server-->
      <TcpSetup v-if="route.name === 'quick-tcp'"/>

      <!--Enter the Station IP address-->
      <StationRequest v-if="route.name === 'quick-request'"/>
    </template>
  </GenericLayout>
</template>

