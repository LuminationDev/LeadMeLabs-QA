<script setup lang="ts">
import Description from "@renderer/components/checks/Description.vue";
import BasicFullCheck from "@renderer/components/checks/BasicFullCheck.vue";
import GenericLayout from "@renderer/components/fullCheck/GenericLayout.vue";
import { useRoute } from "vue-router";

const route = useRoute();
</script>

<template>
  <GenericLayout>
    <template v-slot:title>
      <p class="text-lg text-black mb-3">Windows</p>
    </template>

    <template v-slot:content>
      <Description v-if="route.name === 'full-windows'"/>
      <BasicFullCheck v-if="route.name === 'full-bios'" title="BIOS" object-name="BIOS"/>
      <BasicFullCheck v-if="route.name === 'full-windows-settings'" title="Windows' Settings" object-name="WINDOWS"/>
    </template>
  </GenericLayout>
</template>
