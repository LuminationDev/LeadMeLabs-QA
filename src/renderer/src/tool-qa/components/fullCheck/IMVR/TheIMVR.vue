<script setup lang="ts">
import Description from "@renderer/tool-qa/components/checks/Description.vue";
import TcpSetup from "@renderer/tool-qa/components/tcp/TcpSetup.vue";
import NUCSettings from "@renderer/tool-qa/components/fullCheck/IMVR/NUCSettings.vue";
import GenericLayout from "@renderer/tool-qa/components/checks/GenericLayout.vue";
import { useRoute } from "vue-router";

const route = useRoute();
</script>

<template>
  <GenericLayout>
    <template v-slot:title>
      <p class="text-lg text-black mb-3">IMVR</p>
    </template>

    <template v-slot:content>
      <Description v-if="route.name === 'full-stations'"/>

      <!--Start up the TCP server (if not already)-->
      <TcpSetup v-if="route.name === 'full-imvr-tcp'"/>

      <!--Enter the Station IP address-->
      <NUCSettings v-if="route.name === 'full-station-comparison'"/>
    </template>
  </GenericLayout>
</template>
