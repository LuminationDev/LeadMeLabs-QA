<script setup lang="ts">
import Description from "@renderer/tool-qa/components/checks/Description.vue";
import BasicFullCheck from "@renderer/tool-qa/components/fullCheck/BasicFullCheck.vue";
import GenericLayout from "@renderer/tool-qa/components/checks/GenericLayout.vue";
import { useRoute } from "vue-router";
import BasicReport from "@renderer/tool-qa/components/fullCheck/Report/BasicReport.vue";

const route = useRoute();
</script>

<template>
  <GenericLayout>
    <template v-slot:title>
      <p class="text-2xl text-black font-semibold mb-3">Windows</p>
    </template>

    <template v-slot:content>
      <Description v-if="route.name === 'full-windows'"/>
      <BasicFullCheck v-if="route.name === 'full-bios'" title="BIOS" object-name="BIOS"/>
      <BasicFullCheck v-if="route.name === 'full-windows-settings'" title="Windows' Settings" object-name="WINDOWS"/>
      <BasicReport v-if="route.name === 'full-windows-report'" :section="['BIOS', 'WINDOWS']"/>
    </template>
  </GenericLayout>
</template>
