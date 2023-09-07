<script setup lang="ts">
import TcpSetup from "@renderer/components/tcp/TcpSetup.vue";
import { useRoute } from "vue-router";
import LabParameters from "@renderer/components/fullCheck/LabParameters.vue";
import NUCSettings from "@renderer/components/fullCheck/NUCSettings.vue";

const route = useRoute();
</script>

<template>
  <div class="w-full h-auto my-4 flex flex-col">
    <!--TODO replace with the proper section below when design is ready-->
    <!--<p class="text-lg text-black mb-3">Quick Station Check</p>-->
    <img alt="title" src="../../assets/deleteLater/flcTitle.png" class="w-96"/>

    <hr class="my-4">

    <div class="w-full h-auto mb-4 flex flex-col">
      <!--TODO replace with the proper section when design is ready-->
      <!--Text describing the process?-->
      <img alt="title" src="../../assets/deleteLater/placeholder.png" class="w-full mb-4"/>

      <!--Set the station parameters-->
      <LabParameters v-if="route.name === 'full-setup'" />

      <!--Start up the TCP server-->
      <TcpSetup v-if="route.name === 'full-tcp'"/>

      <!--Enter the Station IP address-->
      <NUCSettings v-if="route.name === 'full-request'"/>
    </div>
  </div>
</template>
