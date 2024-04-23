<script setup lang="ts">
import LoginModal from "../../modals/LoginModal.vue";
import { initialiseStores, populateFullReportTrackerWithManualChecks } from "../setup";

//TODO check if this works with the FULL SOFTWARE
//Initial population
initialiseStores();
populateFullReportTrackerWithManualChecks();
</script>

<template>
    <div class="sidebar flex flex-col w-full bg-white rounded-3xl px-6 py-2">
      <!--QA tool-->
      <div class="w-full h-full">
        <LoginModal title="QA Tool" description="Run a Quality Assurance Test" :route="'/check/full/setup/details'"/>
      </div>
    </div>
</template>
