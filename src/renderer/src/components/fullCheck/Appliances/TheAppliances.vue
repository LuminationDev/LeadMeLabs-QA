<script setup lang="ts">
import GenericLayout from "@renderer/components/checks/GenericLayout.vue";
import ApplianceDisplay from "@renderer/components/fullCheck/Appliances/ApplianceList.vue";
import { useRoute } from "vue-router";

const route = useRoute();
</script>

<template>
  <GenericLayout>
    <template v-slot:title>
      <p class="text-lg text-black mb-3">Appliances</p>
    </template>

    <template v-slot:content>
      <ApplianceDisplay v-if="route.name === 'full-appliance'"/>
    </template>
  </GenericLayout>
</template>
