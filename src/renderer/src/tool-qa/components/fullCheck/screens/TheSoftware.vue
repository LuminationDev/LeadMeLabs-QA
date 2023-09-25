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
      <p class="text-2xl text-black font-semibold mb-3">Software</p>
    </template>

    <template v-slot:content>
      <Description v-if="route.name === 'full-software'"/>
      <BasicFullCheck v-if="route.name === 'full-steam'" title="Steam" object-name="STEAM"/>
      <BasicReport v-if="route.name === 'full-software-report'" :section="['STEAM']"/>
    </template>
  </GenericLayout>
</template>
