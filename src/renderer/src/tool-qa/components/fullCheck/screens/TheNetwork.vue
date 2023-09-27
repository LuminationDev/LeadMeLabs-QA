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
      <p class="text-2xl text-black font-semibold mb-3">Network</p>
      <p class="text-base text-black mb-3">Configure network settings to ensure seamless lab connectivity.</p>
    </template>

    <template v-slot:content>
      <Description v-if="route.name === 'full-network'"/>
      <BasicFullCheck v-if="route.name === 'full-network-network'" title="Network" object-name="NETWORK"/>
      <BasicFullCheck v-if="route.name === 'full-network-cbus'" title="CBus" object-name="CBUS"/>
      <BasicReport v-if="route.name === 'full-network-report'" :auto="fullStore.getAutoChecks(route.path)" :section="fullStore.getManualChecks(route.path)"/>
    </template>
  </GenericLayout>
</template>
