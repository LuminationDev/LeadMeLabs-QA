<script setup lang="ts">
import ToolSelection from "./ToolSelection.vue";
import { initialiseStores, populateFullReportTrackerWithManualChecks } from "../../../src-qa/setup";

//Initial population
initialiseStores();
populateFullReportTrackerWithManualChecks();
</script>

<template>
  <ToolSelection />
</template>
