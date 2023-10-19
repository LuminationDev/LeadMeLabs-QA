<script setup lang="ts">
import GenericLayout from "@renderer/tool-qa/components/_generic/layouts/GenericLayout.vue";
import GenerateReport from "@renderer/tool-qa/components/handover/GenerateReport.vue";
import { useRoute } from "vue-router";

const route = useRoute();
</script>

<template>
  <GenericLayout>
    <template v-slot:title>
      <p class="text-lg text-black mb-3">Reports</p>
    </template>

    <template v-slot:content>
      <GenerateReport v-if="route.name === 'report-handover'" dynamic-content="HANDOVER DOCUMENT"/>
    </template>
  </GenericLayout>
</template>
