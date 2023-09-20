<script setup lang="ts">
import Description from "@renderer/tool-qa/components/checks/Description.vue";
import BasicFullCheck from "@renderer/tool-qa/components/fullCheck/BasicFullCheck.vue";
import GenericLayout from "@renderer/tool-qa/components/checks/GenericLayout.vue";
import { useRoute } from "vue-router";

const route = useRoute();
</script>

<template>
  <GenericLayout>
    <template v-slot:title>
      <p class="text-lg text-black mb-3">Network</p>
    </template>

    <template v-slot:content>
      <Description v-if="route.name === 'full-networking'"/>
      <BasicFullCheck v-if="route.name === 'full-cabling'" title="Cabling" object-name="CABLING"/>
      <BasicFullCheck v-if="route.name === 'full-network'" title="Network" object-name="NETWORK"/>
      <BasicFullCheck v-if="route.name === 'full-cbus'" title="CBus" object-name="CBUS"/>
      <BasicFullCheck v-if="route.name === 'full-security'" title="Security" object-name="SECURITY"/>
    </template>
  </GenericLayout>
</template>
