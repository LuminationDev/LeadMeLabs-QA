<script setup lang="ts">
import GenericLayout from "../../../components/layouts/GenericLayout.vue";
import ApplianceList from "./ApplianceList.vue";
</script>

<template>
  <GenericLayout>
    <template v-slot:title>
      <p class="text-2xl text-black font-semibold mb-2">Appliances</p>
      <p class="text-base text-black mb-4">Connect to your Lab appliances</p>
    </template>

    <template v-slot:content>
      <ApplianceList/>
    </template>
  </GenericLayout>
</template>
