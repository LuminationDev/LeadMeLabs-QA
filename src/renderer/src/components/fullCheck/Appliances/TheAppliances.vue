<script setup lang="ts">
import GenericLayout from "@renderer/components/checks/GenericLayout.vue";
import Description from "@renderer/components/checks/Description.vue";
import ApplianceDisplay from "@renderer/components/fullCheck/Appliances/ApplianceDisplay.vue";
import TcpSetup from "@renderer/components/tcp/TcpSetup.vue";
import { useRoute } from "vue-router";

const route = useRoute();
</script>

<template>
  <GenericLayout>
    <template v-slot:title>
      <p class="text-lg text-black mb-3">Appliances</p>
    </template>

    <template v-slot:content>
      <Description v-if="route.name === 'full-appliances'"/>

      <!--Start up the TCP server (if not already)-->
      <TcpSetup v-if="route.name === 'full-appliance-tcp'"/>

      <ApplianceDisplay v-if="route.name === 'full-appliance-list'"/>
    </template>
  </GenericLayout>
</template>
