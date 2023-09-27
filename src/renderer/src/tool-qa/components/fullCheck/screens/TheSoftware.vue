<script setup lang="ts">
import Description from "@renderer/tool-qa/components/checks/Description.vue";
import BasicFullCheck from "@renderer/tool-qa/components/fullCheck/BasicFullCheck.vue";
import GenericLayout from "@renderer/tool-qa/components/checks/GenericLayout.vue";
import BasicReport from "@renderer/tool-qa/components/fullCheck/Report/BasicReport.vue";
import BasicAutoCheck from "@renderer/tool-qa/components/fullCheck/BasicAutoCheck.vue";
import { useRoute } from "vue-router";
import { useFullStore } from "@renderer/tool-qa/store/fullStore";

const fullStore = useFullStore();
const route = useRoute();
</script>

<template>
  <GenericLayout>
    <template v-slot:title>
      <p class="text-2xl text-black font-semibold mb-3">Software</p>
    </template>

    <template v-slot:content>
      <Description v-if="route.name === 'full-software'"/>
      <BasicAutoCheck v-if="route.name === 'full-software-auto-software_checks'" check-type="software_checks"/>
      <BasicAutoCheck v-if="route.name === 'full-software-auto-steam_config_checks'" check-type="steam_config_checks"/>
      <BasicFullCheck v-if="route.name === 'full-software-steam'" title="Steam" object-name="STEAM"/>
      <BasicReport v-if="route.name === 'full-software-report'" :auto="fullStore.getAutoChecks(route.path)" :section="fullStore.getManualChecks(route.path)"/>
    </template>
  </GenericLayout>
</template>
