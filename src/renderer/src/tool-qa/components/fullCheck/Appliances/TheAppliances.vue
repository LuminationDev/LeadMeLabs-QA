<script setup lang="ts">
import GenericLayout from "@renderer/tool-qa/components/_generic/layouts/GenericLayout.vue";
import ApplianceDisplay from "@renderer/tool-qa/components/fullCheck/Appliances/ApplianceList.vue";
</script>

<template>
  <GenericLayout>
    <template v-slot:title>
      <p class="text-2xl text-black font-semibold mb-2">Appliances</p>
      <p class="text-base text-black mb-4">Connect to your Lab appliances</p>
    </template>

    <template v-slot:content>
      <ApplianceDisplay/>
    </template>
  </GenericLayout>
</template>
