<script setup lang="ts">
import Description from "@renderer/tool-qa/components/checks/Description.vue";
import BasicFullCheck from "@renderer/tool-qa/components/fullCheck/BasicFullCheck.vue";
import GenericLayout from "@renderer/tool-qa/components/checks/GenericLayout.vue";
import BasicReport from "@renderer/tool-qa/components/fullCheck/Report/BasicReport.vue";
import BasicAutoCheck from "@renderer/tool-qa/components/fullCheck/BasicAutoCheck.vue";
import { useRoute } from "vue-router";

const route = useRoute();
</script>

<template>
  <GenericLayout>
    <template v-slot:title>
      <p class="text-2xl text-black font-semibold mb-3">Network</p>
      <p class="text-base text-black mb-3">Configure network settings to ensure seamless lab connectivity.</p>
    </template>

    <template v-slot:content>
      <Description v-if="route.name === 'full-networking'"/>
      <BasicFullCheck v-if="route.name === 'full-cabling'" title="Cabling" object-name="CABLING"/>
      <BasicFullCheck v-if="route.name === 'full-network'" title="Network" object-name="NETWORK"/>
      <BasicFullCheck v-if="route.name === 'full-cbus-options'" title="CBus" object-name="CBUS"/>
      <BasicReport v-if="route.name === 'full-network-report'" :section="['CABLING', 'NETWORK', 'CBUS']"/>
    </template>
  </GenericLayout>
</template>
