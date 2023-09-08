<script setup lang="ts">
import Description from "@renderer/components/checks/Description.vue";
import TcpSetup from "@renderer/components/tcp/TcpSetup.vue";
import NUCSettings from "@renderer/components/fullCheck/IMVR/NUCSettings.vue";
import GenericLayout from "@renderer/components/fullCheck/GenericLayout.vue";
import { useRoute } from "vue-router";

const route = useRoute();
</script>

<template>
  <GenericLayout>
    <template v-slot:title>
      <p class="text-lg text-black mb-3">IMVR</p>
    </template>

    <template v-slot:content>
      <Description v-if="route.name === 'full-windows'"/>

      <!--Start up the TCP server-->
      <TcpSetup v-if="route.name === 'full-tcp'"/>

      <!--Enter the Station IP address-->
      <NUCSettings v-if="route.name === 'full-stations'"/>
    </template>
  </GenericLayout>
</template>
