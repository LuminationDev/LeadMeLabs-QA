<script setup lang="ts">
import LoginModal from "../../modals/LoginModal.vue";
import { initialiseStores, populateExperienceReportTrackerWithManualChecks } from "../setup";
import { useStateStore } from "../../store/stateStore";
import * as CONSTANT from "../../assets/constants";

//Initial population
initialiseStores();
populateExperienceReportTrackerWithManualChecks();

useStateStore().toolType = CONSTANT.TOOL.EXPERIENCE_LAUNCHER;
</script>

<template>
  <div class="sidebar flex flex-col w-full bg-white rounded-3xl px-6 py-2">
    <!--Experience tool-->
    <div class="w-full h-full">
      <LoginModal title="Experience Launcher" description="Run through all installed experiences" :route="'/experiences/setup/details'"/>
    </div>
  </div>
</template>
