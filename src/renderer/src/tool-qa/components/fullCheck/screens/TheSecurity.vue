<script setup lang="ts">
import Description from "@renderer/tool-qa/components/checks/Description.vue";
import BasicFullCheck from "@renderer/tool-qa/components/fullCheck/BasicFullCheck.vue";
import GenericLayout from "@renderer/tool-qa/components/checks/GenericLayout.vue";
import { useRoute } from "vue-router";

const route = useRoute();
</script>

<template>
  <GenericLayout>
    <template v-slot:title>
      <p class="text-lg text-black mb-3">Security</p>
    </template>

    <template v-slot:content>
      <Description v-if="route.name === 'full-security'"/>
      <BasicFullCheck v-if="route.name === 'full-bitwarden'" title="Bitwarden" object-name="BITWARDEN"/>
    </template>
  </GenericLayout>
</template>
