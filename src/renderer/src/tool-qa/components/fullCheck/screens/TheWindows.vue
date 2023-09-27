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
      <p class="text-2xl text-black font-semibold mb-3">Windows</p>
    </template>

    <template v-slot:content>
      <Description v-if="route.name === 'full-windows'"/>
      <BasicAutoCheck v-if="route.name === 'full-windows-auto-windows_checks'" check-type="windows_checks"/>
      <BasicFullCheck v-if="route.name === 'full-windows-windows'" title="Windows' Settings" object-name="WINDOWS"/>
      <BasicReport v-if="route.name === 'full-windows-report'" :auto="fullStore.getAutoChecks(route.path)" :section="fullStore.getManualChecks(route.path)"/>
    </template>
  </GenericLayout>
</template>
