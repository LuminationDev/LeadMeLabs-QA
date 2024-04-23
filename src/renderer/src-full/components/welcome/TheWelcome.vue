<script setup lang="ts">
import ToolSelection from "@renderer/src-full/components/welcome/ToolSelection.vue";
import { initialiseStores, populateFullReportTrackerWithManualChecks } from "../../../src-qa/setup";

//Initial population
initialiseStores();
populateFullReportTrackerWithManualChecks();
</script>

<template>
  <ToolSelection />
</template>
