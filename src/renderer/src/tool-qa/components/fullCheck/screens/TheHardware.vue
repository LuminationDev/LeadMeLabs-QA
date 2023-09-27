<script setup lang="ts">
import Description from "@renderer/tool-qa/components/checks/Description.vue";
import BasicFullCheck from "@renderer/tool-qa/components/fullCheck/BasicFullCheck.vue";
import GenericLayout from "@renderer/tool-qa/components/checks/GenericLayout.vue";
import BasicReport from "@renderer/tool-qa/components/fullCheck/Report/BasicReport.vue";
import { useRoute } from "vue-router";
import { useFullStore } from "@renderer/tool-qa/store/fullStore";

const fullStore = useFullStore();
const route = useRoute();
</script>

<template>
  <GenericLayout>
    <template v-slot:title>
      <p class="text-2xl text-black font-semibold mb-3">Hardware</p>
    </template>

    <template v-slot:content>
      <Description v-if="route.name === 'full-hardware'"/>

      <div v-if="route.name === 'full-hardware-battery'">BATTERY STUFF</div>

      <BasicFullCheck v-if="route.name === 'full-hardware-cabling'" title="Cabling" object-name="CABLING"/>
      <BasicFullCheck v-if="route.name === 'full-hardware-projector'" title="Projector" object-name="PROJECTOR"/>
      <BasicFullCheck v-if="route.name === 'full-hardware-keyboard'" title="Keyboard" object-name="KEYBOARD"/>
      <BasicFullCheck v-if="route.name === 'full-hardware-bios'" title="BIOS" object-name="BIOS"/>
      <BasicReport v-if="route.name === 'full-hardware-report'" :auto="fullStore.getAutoChecks(route.path)" :section="fullStore.getManualChecks(route.path)"/>
    </template>
  </GenericLayout>
</template>
